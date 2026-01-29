import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { buildFullPreviewHtml } from '@/lib/preview-html-builder';
import { buildMinimalFileSet, getLoadingStats } from '@/lib/preview-builder';

export interface ProjectFile {
  id: string;
  project_id: string;
  file_path: string;
  content: string | null;
  file_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface GeneratedComponent {
  code: string;
  componentName: string;
  filePath: string;
  previewHtml?: string;
}

export function useProjectFiles(projectId: string | undefined) {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch all files for a project
  const fetchFiles = useCallback(async () => {
    if (!projectId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setFiles(data || []);
    } catch (error: any) {
      console.error('Error fetching files:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load project files',
      });
    } finally {
      setIsLoading(false);
    }
  }, [projectId, toast]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Save a generated component to the database
  const saveComponent = useCallback(async (component: GeneratedComponent): Promise<ProjectFile | null> => {
    if (!projectId) return null;

    try {
      // Check if file already exists
      const { data: existingFile } = await supabase
        .from('files')
        .select('id')
        .eq('project_id', projectId)
        .eq('file_path', component.filePath)
        .maybeSingle();

      let result;
      if (existingFile) {
        // Update existing file
        const { data, error } = await supabase
          .from('files')
          .update({
            content: component.code,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingFile.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Insert new file
        const { data, error } = await supabase
          .from('files')
          .insert({
            project_id: projectId,
            file_path: component.filePath,
            content: component.code,
            file_type: 'tsx',
          })
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      // Update local state
      await fetchFiles();

      return result;
    } catch (error: any) {
      console.error('Error saving component:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save component',
      });
      return null;
    }
  }, [projectId, fetchFiles, toast]);

  // Delete a file
  const deleteFile = useCallback(async (fileId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      await fetchFiles();
      return true;
    } catch (error: any) {
      console.error('Error deleting file:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete file',
      });
      return false;
    }
  }, [fetchFiles, toast]);

  // Update file content
  const updateFile = useCallback(async (fileId: string, content: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('files')
        .update({
          content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', fileId);

      if (error) throw error;

      await fetchFiles();
      return true;
    } catch (error: any) {
      console.error('Error updating file:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update file',
      });
      return false;
    }
  }, [fetchFiles, toast]);

  // Generate smart preview HTML using new builder
  const generateFullPreviewHtml = useCallback((): string => {
    if (files.length === 0) return '';

    // Convert to preview file format
    const previewFiles = files
      .filter(f => f.content && f.file_type === 'tsx')
      .map(f => ({
        file_path: f.file_path,
        content: f.content!,
        file_type: f.file_type || 'tsx',
      }));

    // Build minimal file set (only loads used components)
    const minimalFiles = buildMinimalFileSet(previewFiles);
    
    // Log stats for debugging
    const stats = getLoadingStats(previewFiles);
    console.log('📊 Preview Stats:', stats);

    // Build the HTML preview
    return buildFullPreviewHtml(previewFiles);
  }, [files]);

  // Memoize the preview HTML to avoid unnecessary regeneration
  const previewHtml = useMemo(() => generateFullPreviewHtml(), [generateFullPreviewHtml]);

  return {
    files,
    isLoading,
    previewHtml,
    fetchFiles,
    saveComponent,
    deleteFile,
    updateFile,
    generateFullPreviewHtml,
  };
}
