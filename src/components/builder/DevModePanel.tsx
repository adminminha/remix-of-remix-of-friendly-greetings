"use client";

import { useState, useEffect } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import DevModeFileTree from "./DevModeFileTree";
import DevModeCodeViewer from "./DevModeCodeViewer";
import { ProjectFile } from "@/hooks/useProjectFiles";

interface DevModePanelProps {
  files: ProjectFile[];
  isLoading?: boolean;
  projectName?: string;
}

const DevModePanel = ({
  files,
  isLoading = false,
  projectName = "Project",
}: DevModePanelProps) => {
  const [selectedFile, setSelectedFile] = useState<string | undefined>(undefined);

  // Auto-select first file if none selected
  useEffect(() => {
    if (!selectedFile && files.length > 0) {
      // Try to select a main file first
      const mainFile = files.find(
        (f) =>
          f.file_path === "src/App.tsx" ||
          f.file_path === "src/main.tsx" ||
          f.file_path.endsWith("/index.tsx")
      );
      setSelectedFile(mainFile?.file_path || files[0].file_path);
    }
  }, [files, selectedFile]);

  // Find content for selected file
  const selectedFileContent =
    files.find((f) => f.file_path === selectedFile)?.content || null;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Loading files...</span>
        </div>
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      {/* File Tree - 25% */}
      <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
        <div className="h-full border-r border-border bg-card">
          <DevModeFileTree
            files={files}
            selectedFile={selectedFile}
            onFileSelect={setSelectedFile}
            projectName={projectName}
            projectVersion="1.0.0"
          />
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Code Viewer - 75% */}
      <ResizablePanel defaultSize={75}>
        <div className="h-full bg-background">
          <DevModeCodeViewer
            fileName={selectedFile || null}
            content={selectedFileContent}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default DevModePanel;
