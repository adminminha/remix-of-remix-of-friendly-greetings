"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface ShikiCodeViewerProps {
  code: string;
  lang?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function ShikiCodeViewer({
  code,
  lang = "tsx",
  showLineNumbers = true,
  className,
}: ShikiCodeViewerProps) {
  const [html, setHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let mounted = true;

    async function highlight() {
      try {
        setIsLoading(true);
        const { createHighlighter } = await import("shiki");
        
        const shikiTheme = resolvedTheme === "dark" ? "github-dark" : "github-light";
        
        const highlighter = await createHighlighter({
          langs: [
            "tsx",
            "typescript",
            "javascript",
            "jsx",
            "json",
            "css",
            "scss",
            "html",
            "markdown",
          ],
          themes: [shikiTheme],
        });

        const highlightedHtml = highlighter.codeToHtml(code, {
          lang: lang === "tsx" ? "typescript" : lang,
          theme: shikiTheme,
        });

        if (mounted) {
          setHtml(highlightedHtml);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Shiki highlighting error:", error);
        if (mounted) {
          // Fallback to plain text
          setHtml(`<pre class="shiki"><code>${escapeHtml(code)}</code></pre>`);
          setIsLoading(false);
        }
      }
    }

    highlight();
    return () => {
      mounted = false;
    };
  }, [code, lang, resolvedTheme]);

  const escapeHtml = (str: string) => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Add line numbers to the HTML
  const addLineNumbers = (htmlContent: string) => {
    if (!showLineNumbers) return htmlContent;
    
    const lines = code.split("\n");
    const lineNumbersHtml = lines
      .map((_, i) => `<span class="line-number">${i + 1}</span>`)
      .join("\n");

    return `<div class="shiki-wrapper with-line-numbers">
      <div class="line-numbers">${lineNumbersHtml}</div>
      <div class="code-content">${htmlContent}</div>
    </div>`;
  };

  return (
    <>
      <style>{`
        .shiki-wrapper {
          display: flex;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace;
          font-size: 13px;
          line-height: 1.6;
        }
        .shiki-wrapper.with-line-numbers .line-numbers {
          display: flex;
          flex-direction: column;
          padding: 1rem 0;
          padding-right: 1rem;
          text-align: right;
          user-select: none;
          color: hsl(var(--muted-foreground) / 0.5);
          border-right: 1px solid hsl(var(--border));
          min-width: 3rem;
        }
        .shiki-wrapper.with-line-numbers .line-number {
          padding: 0 0.5rem;
        }
        .shiki-wrapper .code-content {
          flex: 1;
          overflow-x: auto;
        }
        .shiki-wrapper .code-content pre {
          margin: 0;
          padding: 1rem;
          background: transparent !important;
        }
        .shiki-wrapper .code-content code {
          display: block;
        }
        .shiki-wrapper .code-content .line {
          display: block;
          min-height: 1.6em;
        }
        .shiki {
          background: transparent !important;
        }
      `}</style>
      <div className={cn("overflow-auto h-full", className)}>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="text-sm">Loading code...</span>
            </div>
          </div>
        ) : (
          <div
            className="shiki-container"
            dangerouslySetInnerHTML={{ __html: addLineNumbers(html) }}
          />
        )}
      </div>
    </>
  );
}

export default ShikiCodeViewer;
