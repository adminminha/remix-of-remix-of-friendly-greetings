"use client";

import { useState, useMemo, useCallback } from "react";
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen, 
  FileCode,
  FileText,
  FileJson,
  FileType,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  extension?: string;
}

interface DevModeFileTreeProps {
  files: { file_path: string; content: string | null }[];
  selectedFile: string | undefined;
  onFileSelect: (path: string) => void;
  projectName?: string;
  projectVersion?: string;
}

// Build tree from flat file list
function buildTree(files: { file_path: string }[]): FileNode[] {
  const tree: FileNode[] = [];
  const folderMap: { [key: string]: FileNode } = {};

  const sortedFiles = [...files].sort((a, b) => a.file_path.localeCompare(b.file_path));

  sortedFiles.forEach((file) => {
    const parts = file.file_path.split("/");

    // Create folder hierarchy
    for (let i = 0; i < parts.length - 1; i++) {
      const folderPath = parts.slice(0, i + 1).join("/");
      if (!folderMap[folderPath]) {
        const folderNode: FileNode = {
          id: folderPath,
          name: parts[i],
          type: "folder",
          children: [],
        };
        folderMap[folderPath] = folderNode;

        if (i === 0) {
          tree.push(folderNode);
        } else {
          const parentPath = parts.slice(0, i).join("/");
          folderMap[parentPath]?.children?.push(folderNode);
        }
      }
    }

    // Add file
    const fileName = parts[parts.length - 1];
    const extension = fileName.split(".").pop()?.toLowerCase();
    const fileNode: FileNode = {
      id: file.file_path,
      name: fileName,
      type: "file",
      extension,
    };

    if (parts.length === 1) {
      tree.push(fileNode);
    } else {
      const parentPath = parts.slice(0, -1).join("/");
      folderMap[parentPath]?.children?.push(fileNode);
    }
  });

  // Sort: folders first, then alphabetically
  const sortNodes = (nodes: FileNode[]): FileNode[] => {
    return nodes
      .sort((a, b) => {
        if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
        return a.name.localeCompare(b.name);
      })
      .map((node) => ({
        ...node,
        children: node.children ? sortNodes(node.children) : undefined,
      }));
  };

  return sortNodes(tree);
}

function getFileIcon(extension: string | undefined, className: string) {
  switch (extension) {
    case "tsx":
    case "jsx":
      return <FileCode className={cn(className, "text-blue-500")} />;
    case "ts":
    case "js":
    case "mjs":
      return <FileCode className={cn(className, "text-yellow-500")} />;
    case "json":
      return <FileJson className={cn(className, "text-amber-500")} />;
    case "css":
    case "scss":
      return <FileType className={cn(className, "text-pink-500")} />;
    case "svg":
    case "ico":
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return <ImageIcon className={cn(className, "text-purple-500")} />;
    case "md":
      return <FileText className={cn(className, "text-gray-500")} />;
    default:
      return <FileText className={cn(className, "text-muted-foreground")} />;
  }
}

interface TreeNodeProps {
  node: FileNode;
  level: number;
  selectedFile: string | undefined;
  expandedItems: Set<string>;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
}

function TreeNode({
  node,
  level,
  selectedFile,
  expandedItems,
  onToggle,
  onSelect,
}: TreeNodeProps) {
  const isExpanded = expandedItems.has(node.id);
  const isSelected = selectedFile === node.id;
  const indent = level * 16;

  if (node.type === "folder") {
    return (
      <div>
        <button
          onClick={() => onToggle(node.id)}
          className={cn(
            "w-full flex items-center gap-1.5 py-1.5 px-2 text-sm rounded-md transition-colors",
            "hover:bg-accent/50 text-left group"
          )}
          style={{ paddingLeft: `${indent + 8}px` }}
        >
          {isExpanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          )}
          {isExpanded ? (
            <FolderOpen className="h-4 w-4 text-amber-500 shrink-0" />
          ) : (
            <Folder className="h-4 w-4 text-amber-500 shrink-0" />
          )}
          <span className="truncate font-medium">{node.name}</span>
        </button>
        {isExpanded && node.children && (
          <div>
            {node.children.map((child) => (
              <TreeNode
                key={child.id}
                node={child}
                level={level + 1}
                selectedFile={selectedFile}
                expandedItems={expandedItems}
                onToggle={onToggle}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => onSelect(node.id)}
      className={cn(
        "w-full flex items-center gap-2 py-1.5 px-2 text-sm rounded-md transition-colors text-left",
        isSelected
          ? "bg-primary/10 text-primary font-medium"
          : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
      )}
      style={{ paddingLeft: `${indent + 24}px` }}
    >
      {getFileIcon(node.extension, "h-4 w-4 shrink-0")}
      <span className="truncate">{node.name}</span>
    </button>
  );
}

export function DevModeFileTree({
  files,
  selectedFile,
  onFileSelect,
  projectName = "Project",
  projectVersion = "1.0.0",
}: DevModeFileTreeProps) {
  const tree = useMemo(() => buildTree(files), [files]);

  // Auto-expand first two levels
  const initialExpanded = useMemo(() => {
    const expanded = new Set<string>();
    const expandLevel = (nodes: FileNode[], level: number) => {
      if (level > 1) return;
      nodes.forEach((node) => {
        if (node.type === "folder") {
          expanded.add(node.id);
          if (node.children) {
            expandLevel(node.children, level + 1);
          }
        }
      });
    };
    expandLevel(tree, 0);
    return expanded;
  }, [tree]);

  const [expandedItems, setExpandedItems] = useState<Set<string>>(initialExpanded);

  const handleToggle = useCallback((id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  if (files.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        No files generated yet.
        <br />
        <span className="text-xs">Start chatting to create components!</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
        <Folder className="h-4 w-4 text-amber-500" />
        <span className="font-semibold text-sm">{projectName}</span>
        <span className="text-xs text-muted-foreground ml-auto">{projectVersion}</span>
      </div>

      {/* Tree */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {tree.map((node) => (
            <TreeNode
              key={node.id}
              node={node}
              level={0}
              selectedFile={selectedFile}
              expandedItems={expandedItems}
              onToggle={handleToggle}
              onSelect={onFileSelect}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

export default DevModeFileTree;
