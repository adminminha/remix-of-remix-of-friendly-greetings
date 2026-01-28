import { useState } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import FileTree from './FileTree';
import CodeViewer from './CodeViewer';
import { ProjectFile } from '@/hooks/useProjectFiles';

interface DevModePanelProps {
  files: ProjectFile[];
  isLoading?: boolean;
}

const DevModePanel = ({ files, isLoading = false }: DevModePanelProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Find content for selected file
  const selectedFileContent = files.find(f => f.file_path === selectedFile)?.content || null;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      {/* File Tree - 25% */}
      <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
        <div className="h-full border-r border-border/50 bg-muted/20">
          <FileTree
            files={files}
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
          />
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Code Viewer - 75% */}
      <ResizablePanel defaultSize={75}>
        <div className="h-full bg-background">
          <CodeViewer
            fileName={selectedFile}
            content={selectedFileContent}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default DevModePanel;
