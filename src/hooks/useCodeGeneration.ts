import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface GeneratedComponent {
  code: string;
  componentName: string;
  filePath: string;
  previewHtml?: string;
}

export interface GenerationResult {
  success: boolean;
  type?: 'component' | 'website' | 'conversation';
  component?: GeneratedComponent;
  components?: Array<{
    name: string;
    path: string;
    code: string;
  }>;
  homeUpdate?: {
    path: string;
    code: string;
  };
  description?: string;
  response?: string;
  error?: string;
}

export function useCodeGeneration(projectId: string | undefined) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<string>('');
  const [lastGeneration, setLastGeneration] = useState<GenerationResult | null>(null);
  const { toast } = useToast();

  const generateComponent = useCallback(async (
    prompt: string,
    currentPage?: string
  ): Promise<GenerationResult> => {
    if (!projectId) {
      return { success: false, error: 'No project ID provided' };
    }

    setIsGenerating(true);
    setGenerationProgress('🔄 Analyzing request...');
    
    try {
      // Call the generate-component edge function
      setGenerationProgress('⚡ Generating components...');
      
      const { data, error } = await supabase.functions.invoke('generate-component', {
        body: {
          prompt,
          projectId,
          currentPage,
        },
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || 'Generation failed');

      // Handle conversation type
      if (data.type === 'conversation') {
        setGenerationProgress('');
        const result: GenerationResult = {
          success: true,
          type: 'conversation',
          response: data.response,
        };
        setLastGeneration(result);
        return result;
      }

      // Handle component/website generation
      if (data.type === 'website' || data.type === 'component') {
        setGenerationProgress('💾 Saving components to database...');
        
        // Save all generated components to database
        const components = data.components || [];
        const savePromises: Promise<any>[] = [];

        for (const comp of components) {
          // First check if file exists
          const { data: existingFile } = await supabase
            .from('files')
            .select('id')
            .eq('project_id', projectId)
            .eq('file_path', comp.path)
            .maybeSingle();

          if (existingFile) {
            // Update existing
            await supabase.from('files').update({
              content: comp.code,
              updated_at: new Date().toISOString(),
            }).eq('id', existingFile.id);
          } else {
            // Insert new
            await supabase.from('files').insert({
              project_id: projectId,
              file_path: comp.path,
              content: comp.code,
              file_type: 'component',
            });
          }
        }

        // Also save/update Home.tsx
        if (data.homeUpdate) {
          const { data: existingHome } = await supabase
            .from('files')
            .select('id')
            .eq('project_id', projectId)
            .eq('file_path', data.homeUpdate.path)
            .maybeSingle();

          if (existingHome) {
            await supabase.from('files').update({
              content: data.homeUpdate.code,
              updated_at: new Date().toISOString(),
            }).eq('id', existingHome.id);
          } else {
            await supabase.from('files').insert({
              project_id: projectId,
              file_path: data.homeUpdate.path,
              content: data.homeUpdate.code,
              file_type: 'page',
            });
          }
        }
        
        setGenerationProgress('');

        // Show success toast
        toast({
          title: "✅ Website Generated!",
          description: `Created ${components.length} components successfully.`,
        });

        const result: GenerationResult = {
          success: true,
          type: data.type,
          component: data.component,
          components: data.components,
          homeUpdate: data.homeUpdate,
          description: data.description,
        };

        setLastGeneration(result);
        return result;
      }

      throw new Error('Invalid response type');

    } catch (error: any) {
      console.error('Generation error:', error);
      setGenerationProgress('');
      
      // Handle specific errors
      if (error.message?.includes('Rate limit') || error.message?.includes('429')) {
        toast({
          variant: 'destructive',
          title: 'Rate Limited',
          description: 'Too many requests. Please wait a moment and try again.',
        });
      } else if (error.message?.includes('402') || error.message?.includes('credits')) {
        toast({
          variant: 'destructive',
          title: 'Credits Exhausted',
          description: 'AI credits have run out. Please add more credits.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Generation Failed',
          description: error.message || 'Failed to generate component',
        });
      }

      const errorResult: GenerationResult = {
        success: false,
        error: error.message || 'Unknown error',
      };
      
      setLastGeneration(errorResult);
      return errorResult;
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
    }
  }, [projectId, toast]);

  return {
    isGenerating,
    generationProgress,
    lastGeneration,
    generateComponent,
  };
}
