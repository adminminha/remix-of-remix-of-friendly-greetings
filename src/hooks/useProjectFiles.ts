import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  previewHtml: string;
}

export function useProjectFiles(projectId: string | undefined) {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPreviewHtml, setCurrentPreviewHtml] = useState<string>('');
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
      
      // Update preview HTML
      setCurrentPreviewHtml(component.previewHtml);

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

  // Generate combined preview HTML from all components
  const generateFullPreviewHtml = useCallback((): string => {
    if (files.length === 0) return '';

    // Combine all component code into a single preview
    const componentContents = files
      .filter(f => f.content && f.file_type === 'tsx')
      .map(f => {
        // Extract JSX from component
        const returnMatch = f.content?.match(/return\s*\(\s*([\s\S]*?)\s*\);?\s*\}[\s\S]*?(?:export|$)/);
        return returnMatch ? returnMatch[1] : '';
      })
      .join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { 
      margin: 0; 
      font-family: system-ui, -apple-system, sans-serif; 
    }
  </style>
</head>
<body>
  ${componentContents
    .replace(/className=/g, 'class=')
    .replace(/\{[^}]*\}/g, '')}
</body>
</html>`;
  }, [files]);

  return {
    files,
    isLoading,
    currentPreviewHtml,
    setCurrentPreviewHtml,
    fetchFiles,
    saveComponent,
    deleteFile,
    updateFile,
    generateFullPreviewHtml,
  };
}
