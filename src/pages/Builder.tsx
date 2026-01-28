import { useState, useEffect } from 'react';
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
import { cn } from '@/lib/utils';

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [mobileView, setMobileView] = useState<'chat' | 'preview'>('chat');
  
  // New state for device and refresh
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);

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

    // Call AI Chat Edge Function
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          projectContext: {
            projectName: project?.name,
          },
        },
      });

      if (error) throw error;

      const aiContent = data.message || data.error || "I couldn't generate a response.";
      
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: aiContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);

      // Save AI response
      await supabase.from('chat_messages').insert({
        project_id: projectId,
        role: 'assistant',
        content: aiContent,
      });
    } catch (error: any) {
      console.error('AI Chat error:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "⚠️ Sorry, I encountered an error. Please try again!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
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
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setLastSaved(new Date());
    toast({ title: "Saved!", description: "All changes have been saved" });
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

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
      fetchProject();
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
        isSaving={isSaving}
        lastSaved={lastSaved}
        device={device}
        onDeviceChange={setDevice}
        onRefresh={handleRefresh}
        onFullscreen={handleFullscreen}
        isRefreshing={isRefreshing}
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
          <PreviewPanel
            previewUrl={project.preview_url || undefined}
            isLoading={isGenerating}
            device={device}
          />
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
    </div>
  );
};

export default Builder;