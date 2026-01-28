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

interface Page {
  id: string;
  title: string;
  slug: string;
  is_home: boolean;
  component_path: string | null;
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
  
  // New state for device and refresh
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Code generation hook
  const { isGenerating, generateComponent } = useCodeGeneration(projectId);
  
  // Project files hook (generated files live here)
  const {
    files: generatedFiles,
    isLoading: filesLoading,
    fetchFiles,
    generateFullPreviewHtml,
  } = useProjectFiles(projectId);

  const baseTemplateFiles = getBaseTemplateFiles();
  const mergedFiles = (() => {
    // generated files should override base template with same path
    const map = new Map<string, { file_path: string; content: string | null }>();
    for (const f of baseTemplateFiles) map.set(f.file_path, { file_path: f.file_path, content: f.content });
    for (const f of generatedFiles) map.set(f.file_path, { file_path: f.file_path, content: f.content });
    return Array.from(map.values()).sort((a, b) => a.file_path.localeCompare(b.file_path));
  })();

  const previewHtml = generateFullPreviewHtml();
  
  // Auto-save hook
  const { isSaving, lastSavedText, save, markChanged } = useAutoSave(projectId);

  useEffect(() => {
    if (projectId) {
      fetchProject();
      fetchMessages();
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

    // Add user message
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
      
       if (result.success && result.component) {
         aiContent = `✅ ${result.description || `Created ${result.component.componentName}!`}\n\nফাইল: ${result.component.filePath}\n\nPreview updated with your new component.`;
        codeGenerated = result.component.code;
      } else {
        aiContent = result.error || "I couldn't generate the component. Please try again!";
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
    // Find the message index
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    // Remove this message and all following messages
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

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
      fetchProject();
      fetchFiles();
      toast({ title: "Refreshed", description: "Preview has been refreshed" });
    }, 1000);
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
            // Mobile: show only when chat view is active
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
        </motion.div>

        {/* Preview Panel - 60% on desktop */}
        <motion.div
          className={cn(
            "flex-1 flex flex-col",
            "md:flex",
            // Mobile: show only when preview view is active
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