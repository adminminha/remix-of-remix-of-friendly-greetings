"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, FileCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import ShikiCodeViewer from "./ShikiCodeViewer";

interface DevModeCodeViewerProps {
  fileName: string | null;
  content: string | null;
}

function getFileType(filePath: string): string {
  if (filePath.endsWith(".tsx")) return "TSX";
  if (filePath.endsWith(".ts")) return "TS";
  if (filePath.endsWith(".js")) return "JS";
  if (filePath.endsWith(".jsx")) return "JSX";
  if (filePath.endsWith(".md")) return "MD";
  if (filePath.endsWith(".css")) return "CSS";
  if (filePath.endsWith(".scss")) return "SCSS";
  if (filePath.endsWith(".json")) return "JSON";
  if (filePath.endsWith(".html")) return "HTML";
  return "TXT";
}

function getLanguageFromPath(filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "tsx":
    case "ts":
      return "typescript";
    case "jsx":
    case "js":
    case "mjs":
      return "javascript";
    case "json":
      return "json";
    case "css":
      return "css";
    case "scss":
      return "scss";
    case "html":
      return "html";
    case "md":
      return "markdown";
    default:
      return "typescript";
  }
}

export function DevModeCodeViewer({ fileName, content }: DevModeCodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Code copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  if (!fileName || !content) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-background">
        <FileCode className="h-16 w-16 mb-4 opacity-20" />
        <p className="text-sm font-medium">Select a file to view its code</p>
        <p className="text-xs mt-1 opacity-60">
          Choose a file from the tree on the left
        </p>
      </div>
    );
  }

  const fileType = getFileType(fileName);
  const language = getLanguageFromPath(fileName);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs font-mono">
            {fileType}
          </Badge>
          <span className="text-sm font-medium text-foreground truncate max-w-[300px]">
            {fileName}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 gap-1.5 text-xs"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs">
            <ExternalLink className="h-3.5 w-3.5" />
            Open
          </Button>
        </div>
      </div>

      {/* Code Content */}
      <ScrollArea className="flex-1">
        <ShikiCodeViewer 
          code={content} 
          lang={language} 
          showLineNumbers={true}
        />
      </ScrollArea>
    </div>
  );
}

export default DevModeCodeViewer;
