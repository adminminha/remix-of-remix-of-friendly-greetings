"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import DevModeFileTree from "./DevModeFileTree";
import DevModeCodeViewer from "./DevModeCodeViewer";
import DevModeSearchBar from "./DevModeSearchBar";
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
  const [highlightLine, setHighlightLine] = useState<number | undefined>(undefined);

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

  // Handle file select with optional line number
  const handleFileSelect = useCallback((path: string, line?: number) => {
    setSelectedFile(path);
    setHighlightLine(line);
    // Clear highlight after a delay
    if (line) {
      setTimeout(() => setHighlightLine(undefined), 3000);
    }
  }, []);

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
        <div className="h-full border-r border-border bg-card flex flex-col">
          {/* Search Bar */}
          <div className="p-2 border-b border-border">
            <DevModeSearchBar
              files={files}
              onFileSelect={handleFileSelect}
            />
          </div>
          
          {/* File Tree */}
          <div className="flex-1 overflow-hidden">
            <DevModeFileTree
              files={files}
              selectedFile={selectedFile}
              onFileSelect={handleFileSelect}
              projectName={projectName}
              projectVersion="1.0.0"
            />
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Code Viewer - 75% */}
      <ResizablePanel defaultSize={75}>
        <div className="h-full bg-background">
          <DevModeCodeViewer
            fileName={selectedFile || null}
            content={selectedFileContent}
            highlightLine={highlightLine}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default DevModePanel;
