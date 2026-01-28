import { ScrollArea } from '@/components/ui/scroll-area';
import { FileCode, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CodeViewerProps {
  fileName: string | null;
  content: string | null;
}

// Simple syntax highlighting for TSX/TypeScript
function highlightCode(code: string): JSX.Element[] {
  const lines = code.split('\n');
  
  return lines.map((line, lineIndex) => {
    // Tokenize the line
    const tokens: JSX.Element[] = [];
    let remaining = line;
    let key = 0;

    // Patterns for syntax highlighting
    const patterns: { regex: RegExp; className: string }[] = [
      // Comments
      { regex: /^(\/\/.*)$/, className: 'text-gray-500 italic' },
      // Strings
      { regex: /^("[^"]*"|'[^']*'|`[^`]*`)/, className: 'text-green-400' },
      // Keywords
      { regex: /^(import|export|from|const|let|var|function|return|if|else|for|while|class|extends|interface|type|async|await|default|new|this|null|undefined|true|false)\b/, className: 'text-purple-400' },
      // JSX Tags
      { regex: /^(<\/?[A-Z][a-zA-Z0-9]*|<\/?[a-z][a-zA-Z0-9-]*)/, className: 'text-blue-400' },
      // Component names (PascalCase)
      { regex: /^([A-Z][a-zA-Z0-9]+)/, className: 'text-yellow-400' },
      // Properties/attributes
      { regex: /^([a-zA-Z_][a-zA-Z0-9_]*)(=)/, className: 'text-cyan-400' },
      // Numbers
      { regex: /^(\d+\.?\d*)/, className: 'text-orange-400' },
      // Operators
      { regex: /^(=>|===|!==|==|!=|<=|>=|&&|\|\||[+\-*/%=<>!&|^~?:])/, className: 'text-gray-400' },
      // Brackets
      { regex: /^([{}[\]()]+)/, className: 'text-gray-300' },
      // Default text
      { regex: /^(\S+)/, className: 'text-foreground' },
      // Whitespace
      { regex: /^(\s+)/, className: '' },
    ];

    while (remaining.length > 0) {
      let matched = false;
      
      for (const { regex, className } of patterns) {
        const match = remaining.match(regex);
        if (match) {
          const [fullMatch] = match;
          tokens.push(
            <span key={key++} className={className}>
              {fullMatch}
            </span>
          );
          remaining = remaining.slice(fullMatch.length);
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        // Take one character and continue
        tokens.push(
          <span key={key++} className="text-foreground">
            {remaining[0]}
          </span>
        );
        remaining = remaining.slice(1);
      }
    }

    return (
      <div key={lineIndex} className="table-row">
        <span className="table-cell pr-4 text-right text-muted-foreground/50 select-none w-10 text-xs">
          {lineIndex + 1}
        </span>
        <span className="table-cell">
          {tokens.length > 0 ? tokens : '\u00A0'}
        </span>
      </div>
    );
  });
}

const CodeViewer = ({ fileName, content }: CodeViewerProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!content) return;
    
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({ title: 'Copied!', description: 'Code copied to clipboard' });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to copy' });
    }
  };

  if (!fileName || !content) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
        <FileCode className="h-12 w-12 mb-4 opacity-20" />
        <p className="text-sm">Select a file to view its code</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-2 text-sm font-medium">
          <FileCode className="h-4 w-4 text-blue-400" />
          <span className="truncate">{fileName}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 gap-1"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Code Content */}
      <ScrollArea className="flex-1">
        <pre className="p-4 text-xs font-mono leading-5">
          <code className="table">
            {highlightCode(content)}
          </code>
        </pre>
      </ScrollArea>
    </div>
  );
};

export default CodeViewer;
