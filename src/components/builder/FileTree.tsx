import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileCode, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

interface FileTreeProps {
  files: { file_path: string; content: string | null }[];
  selectedFile: string | null;
  onFileSelect: (path: string) => void;
}

// Build tree structure from flat file list
function buildTree(files: { file_path: string }[]): FileNode[] {
  const root: { [key: string]: FileNode } = {};

  files.forEach(file => {
    const parts = file.file_path.split('/');
    let current = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const path = parts.slice(0, index + 1).join('/');

      if (!current[part]) {
        current[part] = {
          name: part,
          path,
          type: isFile ? 'file' : 'folder',
          children: isFile ? undefined : [],
        };
      }

      if (!isFile) {
        const children = current[part].children || [];
        current = children.reduce((acc, child) => {
          acc[child.name] = child;
          return acc;
        }, {} as { [key: string]: FileNode });
        
        // Update children reference
        current[part] = current[part] || { name: part, path, type: 'folder', children: [] };
      }
    });
  });

  // Convert to array and sort
  function convertToArray(obj: { [key: string]: FileNode }): FileNode[] {
    return Object.values(obj).sort((a, b) => {
      // Folders first, then files
      if (a.type !== b.type) {
        return a.type === 'folder' ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });
  }

  return convertToArray(root);
}

// Simpler tree building approach
function buildSimpleTree(files: { file_path: string }[]): FileNode[] {
  const tree: FileNode[] = [];
  const folderMap: { [key: string]: FileNode } = {};

  // Sort files to ensure folders are processed correctly
  const sortedFiles = [...files].sort((a, b) => a.file_path.localeCompare(b.file_path));

  sortedFiles.forEach(file => {
    const parts = file.file_path.split('/');
    
    // Create folder hierarchy
    for (let i = 0; i < parts.length - 1; i++) {
      const folderPath = parts.slice(0, i + 1).join('/');
      if (!folderMap[folderPath]) {
        const folderNode: FileNode = {
          name: parts[i],
          path: folderPath,
          type: 'folder',
          children: [],
        };
        folderMap[folderPath] = folderNode;

        // Add to parent
        if (i === 0) {
          tree.push(folderNode);
        } else {
          const parentPath = parts.slice(0, i).join('/');
          folderMap[parentPath]?.children?.push(folderNode);
        }
      }
    }

    // Add file
    const fileName = parts[parts.length - 1];
    const fileNode: FileNode = {
      name: fileName,
      path: file.file_path,
      type: 'file',
    };

    if (parts.length === 1) {
      tree.push(fileNode);
    } else {
      const parentPath = parts.slice(0, -1).join('/');
      folderMap[parentPath]?.children?.push(fileNode);
    }
  });

  // Sort each level: folders first, then alphabetically
  const sortNodes = (nodes: FileNode[]): FileNode[] => {
    return nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    }).map(node => ({
      ...node,
      children: node.children ? sortNodes(node.children) : undefined,
    }));
  };

  return sortNodes(tree);
}

function getFileIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  switch (ext) {
    case 'tsx':
    case 'ts':
    case 'jsx':
    case 'js':
      return <FileCode className="h-4 w-4 text-blue-400" />;
    case 'css':
    case 'scss':
      return <FileCode className="h-4 w-4 text-pink-400" />;
    case 'json':
      return <FileCode className="h-4 w-4 text-yellow-400" />;
    case 'md':
      return <FileText className="h-4 w-4 text-gray-400" />;
    default:
      return <FileText className="h-4 w-4 text-muted-foreground" />;
  }
}

function TreeNode({ 
  node, 
  depth = 0, 
  selectedFile, 
  onFileSelect 
}: { 
  node: FileNode; 
  depth?: number;
  selectedFile: string | null;
  onFileSelect: (path: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(depth < 2); // Auto-expand first 2 levels
  const isSelected = selectedFile === node.path;

  if (node.type === 'folder') {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full flex items-center gap-1 py-1 px-2 text-sm hover:bg-muted/50 rounded-sm transition-colors",
            "text-left"
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {isOpen ? (
            <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
          )}
          {isOpen ? (
            <FolderOpen className="h-4 w-4 text-yellow-500 shrink-0" />
          ) : (
            <Folder className="h-4 w-4 text-yellow-500 shrink-0" />
          )}
          <span className="truncate">{node.name}</span>
        </button>
        {isOpen && node.children && (
          <div>
            {node.children.map((child) => (
              <TreeNode
                key={child.path}
                node={child}
                depth={depth + 1}
                selectedFile={selectedFile}
                onFileSelect={onFileSelect}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => onFileSelect(node.path)}
      className={cn(
        "w-full flex items-center gap-2 py-1 px-2 text-sm rounded-sm transition-colors text-left",
        isSelected 
          ? "bg-primary/10 text-primary" 
          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
      )}
      style={{ paddingLeft: `${depth * 12 + 20}px` }}
    >
      {getFileIcon(node.name)}
      <span className="truncate">{node.name}</span>
    </button>
  );
}

const FileTree = ({ files, selectedFile, onFileSelect }: FileTreeProps) => {
  const tree = buildSimpleTree(files);

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
    <ScrollArea className="h-full">
      <div className="p-2">
        <div className="text-xs font-medium text-muted-foreground px-2 py-1 uppercase tracking-wider">
          Project Files
        </div>
        <div className="mt-1">
          {tree.map((node) => (
            <TreeNode
              key={node.path}
              node={node}
              selectedFile={selectedFile}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
};

export default FileTree;
