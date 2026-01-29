import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { GeneratedComponent, useProjectFiles } from './useProjectFiles';

export interface GenerationResult {
  success: boolean;
  component?: GeneratedComponent;
  description?: string;
  error?: string;
}

export function useCodeGeneration(projectId: string | undefined) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneration, setLastGeneration] = useState<GenerationResult | null>(null);
  const { toast } = useToast();
  const { saveComponent, files, previewHtml, fetchFiles } = useProjectFiles(projectId);

  const generateComponent = useCallback(async (
    prompt: string,
    currentPage?: string
  ): Promise<GenerationResult> => {
    if (!projectId) {
      return { success: false, error: 'No project ID provided' };
    }

    setIsGenerating(true);
    
    try {
      // Get existing components for context
      const existingComponents = files
        .filter(f => f.file_type === 'tsx')
        .map(f => f.file_path.split('/').pop()?.replace('.tsx', '') || '');

      // Call the generate-component edge function
      const { data, error } = await supabase.functions.invoke('generate-component', {
        body: {
          prompt,
          projectId,
          currentPage,
          existingComponents,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      const component = data.component as GeneratedComponent;
      const result: GenerationResult = {
        success: true,
        component,
        description: data.description,
      };

      // Save the generated component to the database
      await saveComponent(component);
      
      // Refresh files to get updated preview
      await fetchFiles();

      setLastGeneration(result);
      
      toast({
        title: '✨ Component Generated!',
        description: data.description || `Created ${component.componentName}`,
      });

      return result;
    } catch (error: any) {
      console.error('Code generation error:', error);
      
      const errorResult: GenerationResult = {
        success: false,
        error: error.message || 'Failed to generate component',
      };

      setLastGeneration(errorResult);

      // Handle specific error cases
      if (error.message?.includes('Rate limit')) {
        toast({
          variant: 'destructive',
          title: 'Rate Limited',
          description: 'Too many requests. Please wait a moment and try again.',
        });
      } else if (error.message?.includes('credits')) {
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

      return errorResult;
    } finally {
      setIsGenerating(false);
    }
  }, [projectId, files, saveComponent, fetchFiles, toast]);

  return {
    isGenerating,
    lastGeneration,
    generateComponent,
    previewHtml,
  };
}
