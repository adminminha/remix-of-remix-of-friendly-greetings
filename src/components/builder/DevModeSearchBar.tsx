"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Search, X, FileCode, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SearchResult {
  file_path: string;
  line: number;
  content: string;
  matchStart: number;
  matchEnd: number;
}

interface DevModeSearchBarProps {
  files: { file_path: string; content: string | null }[];
  onFileSelect: (path: string, line?: number) => void;
  className?: string;
}

export function DevModeSearchBar({
  files,
  onFileSelect,
  className,
}: DevModeSearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Search through all files
  const results = useMemo((): SearchResult[] => {
    if (!query || query.length < 2) return [];

    const searchResults: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();
    const maxResults = 50;

    for (const file of files) {
      if (!file.content) continue;
      if (searchResults.length >= maxResults) break;

      const lines = file.content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (searchResults.length >= maxResults) break;

        const line = lines[i];
        const lowerLine = line.toLowerCase();
        const matchIndex = lowerLine.indexOf(lowerQuery);

        if (matchIndex !== -1) {
          searchResults.push({
            file_path: file.file_path,
            line: i + 1,
            content: line.trim(),
            matchStart: matchIndex,
            matchEnd: matchIndex + query.length,
          });
        }
      }
    }

    return searchResults;
  }, [query, files]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || results.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            onFileSelect(results[selectedIndex].file_path, results[selectedIndex].line);
            setIsOpen(false);
            setQuery("");
          }
          break;
        case "Escape":
          setIsOpen(false);
          break;
      }
    },
    [isOpen, results, selectedIndex, onFileSelect]
  );

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current && results.length > 0) {
      const selected = resultsRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      selected?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex, results.length]);

  const handleFocus = () => setIsOpen(true);
  const handleBlur = () => {
    // Delay to allow click on results
    setTimeout(() => setIsOpen(false), 150);
  };

  const clearSearch = () => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Search in files... (min 2 chars)"
          className="pl-9 pr-8 h-9 text-sm"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
            onClick={clearSearch}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowUp className="h-3 w-3" />
              <ArrowDown className="h-3 w-3" />
              <span>navigate</span>
            </div>
          </div>
          <ScrollArea className="max-h-[300px]">
            <div ref={resultsRef} className="py-1">
              {results.map((result, index) => (
                <button
                  key={`${result.file_path}-${result.line}`}
                  data-index={index}
                  className={cn(
                    "w-full px-3 py-2 text-left flex flex-col gap-0.5 transition-colors",
                    index === selectedIndex
                      ? "bg-accent"
                      : "hover:bg-accent/50"
                  )}
                  onClick={() => {
                    onFileSelect(result.file_path, result.line);
                    setIsOpen(false);
                    setQuery("");
                  }}
                >
                  <div className="flex items-center gap-2">
                    <FileCode className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                    <span className="text-xs font-medium truncate">
                      {result.file_path}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      :{result.line}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate pl-5 font-mono">
                    {result.content.length > 80
                      ? result.content.slice(0, 80) + "..."
                      : result.content}
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* No results message */}
      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50 p-4 text-center">
          <p className="text-sm text-muted-foreground">No matches found</p>
        </div>
      )}
    </div>
  );
}

export default DevModeSearchBar;
