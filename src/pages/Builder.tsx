import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import TopBar, { DeviceType } from '@/components/builder/TopBar';
import ChatInterface from '@/components/builder/ChatInterface';
import PreviewPanel from '@/components/builder/PreviewPanel';
import DevModePanel from '@/components/builder/DevModePanel';
import ExportDialog from '@/components/builder/ExportDialog';
import { useCodeGeneration } from '@/hooks/useCodeGeneration';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useProjectFiles } from '@/hooks/useProjectFiles';
import { cn } from '@/lib/utils';
import { getBaseTemplateFiles } from '@/lib/templates/project-base-template';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  codeGenerated?: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  preview_url: string | null;
}

const Builder = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileView, setMobileView] = useState<'chat' | 'preview'>('chat');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showDevMode, setShowDevMode] = useState(false);
  
  // Device and refresh state
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Preview HTML from edge function (priority)
  const [currentPreviewHtml, setCurrentPreviewHtml] = useState<string>('');
  
  // Code generation hook
  const { isGenerating, generationProgress, generateComponent } = useCodeGeneration(projectId);
  
  // Project files hook
  const {
    files: generatedFiles,
    isLoading: filesLoading,
    fetchFiles,
    generateFullPreviewHtml,
  } = useProjectFiles(projectId);

  // Merge base template with generated files
  const baseTemplateFiles = getBaseTemplateFiles();
  const mergedFiles = (() => {
    const map = new Map<string, { file_path: string; content: string | null }>();
    for (const f of baseTemplateFiles) map.set(f.file_path, { file_path: f.file_path, content: f.content });
    for (const f of generatedFiles) map.set(f.file_path, { file_path: f.file_path, content: f.content });
    return Array.from(map.values()).sort((a, b) => a.file_path.localeCompare(b.file_path));
  })();

  // Use edge function preview HTML if available, otherwise generate locally
  const previewHtml = currentPreviewHtml || generateFullPreviewHtml();
  
  // Auto-save hook
  const { isSaving, lastSavedText, save, markChanged } = useAutoSave(projectId);

  useEffect(() => {
    if (projectId) {
      fetchProject();
      fetchMessages();
      fetchFiles();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Project not found",
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(
        (data || []).map((msg) => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.created_at),
        }))
      );
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!projectId) return;

    // Add user message immediately
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Save user message to database
    await supabase.from('chat_messages').insert({
      project_id: projectId,
      role: 'user',
      content,
    });

    try {
      // Generate component using AI
      const result = await generateComponent(content);
      
      let aiContent: string;
      let codeGenerated: string | undefined;
      
      // Handle different response types
      if (result.success && result.type === 'conversation') {
        // Conversation response
        aiContent = result.response || "আমি আপনাকে সাহায্য করতে পারি! কি ধরনের website তৈরি করতে চান?";
      } else if (result.success && (result.type === 'website' || result.type === 'component')) {
        // Component/Website generation
        const componentCount = result.components?.length || 1;
        const componentNames = result.components?.map(c => c.name).join(', ') || result.component?.componentName;
        
        aiContent = `✅ ${result.description || `Created ${componentNames}!`}\n\n🎉 Generated ${componentCount} component(s)!\n\nPreview updated with your new website.`;
        codeGenerated = result.component?.code;
        
        // Update preview HTML from edge function response
        if (result.component?.previewHtml) {
          setCurrentPreviewHtml(result.component.previewHtml);
        }
        
        // Refresh files to show in Dev Mode
        await fetchFiles();
      } else {
        aiContent = `❌ ${result.error || "Generation failed. Please try again!"}`;
      }
      
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: aiContent,
        timestamp: new Date(),
        codeGenerated,
      };
      setMessages((prev) => [...prev, aiResponse]);
      
      // Mark as changed for auto-save
      markChanged();

      // Save AI response
      await supabase.from('chat_messages').insert({
        project_id: projectId,
        role: 'assistant',
        content: aiContent,
      });
    } catch (error: any) {
      console.error('Generation error:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "⚠️ Sorry, I encountered an error. Please try again!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleUndo = async (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    const newMessages = messages.slice(0, messageIndex);
    setMessages(newMessages);

    toast({
      title: "Undo successful",
      description: "Message and subsequent changes have been removed",
    });
  };

  const handleProjectNameChange = async (name: string) => {
    if (!projectId || !project) return;

    try {
      const { error } = await supabase
        .from('projects')
        .update({ name })
        .eq('id', projectId);

      if (error) throw error;

      setProject({ ...project, name });
      toast({ title: "Project renamed", description: `Now called "${name}"` });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleSave = async () => {
    const success = await save();
    if (success) {
      toast({ title: "Saved!", description: "All changes have been saved" });
    }
  };

  const handleToggleDevMode = () => {
    setShowDevMode(!showDevMode);
  };

  const handlePreview = () => {
    if (project?.preview_url) {
      window.open(project.preview_url, '_blank');
    } else {
      toast({
        title: "Preview",
        description: "Generate some content first to see the preview",
      });
    }
  };

  const handleDeploy = () => {
    toast({
      title: "Deploy",
      description: "Deployment feature coming soon!",
    });
  };

  const handleExport = () => {
    setShowExportDialog(true);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchProject();
      await fetchFiles();
      // Clear cached preview to force regeneration
      setCurrentPreviewHtml('');
      toast({ title: "Refreshed", description: "Preview has been refreshed" });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleFullscreen = () => {
    if (project?.preview_url) {
      window.open(project.preview_url, '_blank');
    } else {
      toast({
        title: "Fullscreen",
        description: "Generate some content first to see fullscreen preview",
      });
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar
        projectName={project.name}
        onProjectNameChange={handleProjectNameChange}
        onSave={handleSave}
        onPreview={handlePreview}
        onDeploy={handleDeploy}
        onExport={handleExport}
        isSaving={isSaving}
        lastSavedText={lastSavedText}
        device={device}
        onDeviceChange={setDevice}
        onRefresh={handleRefresh}
        onFullscreen={handleFullscreen}
        isRefreshing={isRefreshing}
        isDevMode={showDevMode}
        onToggleDevMode={handleToggleDevMode}
      />

      {/* Desktop Layout: 40/60 Split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel - 40% on desktop */}
        <motion.div
          className={cn(
            "border-r border-border/50 flex flex-col",
            "md:flex md:w-[40%]",
            mobileView === 'chat' ? "flex w-full" : "hidden"
          )}
        >
          <ChatInterface
            projectId={projectId!}
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isGenerating}
            onUndo={handleUndo}
            getFileContent={(path) => {
              const f = mergedFiles.find((x) => x.file_path === path);
              return f?.content ?? null;
            }}
          />
          
          {/* Show generation progress */}
          {isGenerating && generationProgress && (
            <div className="px-4 pb-4">
              <div className="bg-primary/10 rounded-lg p-3 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <span className="text-sm text-primary">{generationProgress}</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Preview Panel - 60% on desktop */}
        <motion.div
          className={cn(
            "flex-1 flex flex-col",
            "md:flex",
            mobileView === 'preview' ? "flex w-full" : "hidden"
          )}
        >
          {showDevMode ? (
            <DevModePanel 
              files={mergedFiles as any} 
              isLoading={filesLoading}
              projectName={project.name}
            />
          ) : (
            <PreviewPanel
              previewUrl={project.preview_url || undefined}
              previewHtml={previewHtml}
              isLoading={isGenerating}
              device={device}
              onRefresh={handleRefresh}
            />
          )}
        </motion.div>
      </div>

      {/* Mobile Toggle */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-background border border-border rounded-full p-1 shadow-lg flex gap-1">
          <Button
            variant={mobileView === 'chat' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMobileView('chat')}
            className={cn(
              "rounded-full gap-2",
              mobileView === 'chat' && "liquid-button"
            )}
          >
            <MessageSquare className="h-4 w-4" />
            Chat
          </Button>
          <Button
            variant={mobileView === 'preview' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMobileView('preview')}
            className={cn(
              "rounded-full gap-2",
              mobileView === 'preview' && "liquid-button"
            )}
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>

      {/* Export Dialog */}
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        projectId={projectId!}
        projectName={project.name}
      />
    </div>
  );
};

export default Builder;
