// Tota AI - Project Base Template (virtual)
// Provides the pre-structured template files as in-memory strings so they can be:
// - shown in Dev Mode
// - included in exports
// without needing to store thousands of rows in the database.

import { BASE_FILES_MAP } from "@/lib/templates/base-files";

// Load raw source for UI components from the repo at build time.
// Vite will bundle these as strings.
// NOTE: path is relative to this file (src/lib/templates).
const rawUiFiles = import.meta.glob("../../components/ui/*.tsx", {
  as: "raw",
  eager: true,
}) as Record<string, string>;

const rawHooks = import.meta.glob("../../hooks/*.ts{,x}", {
  as: "raw",
  eager: true,
}) as Record<string, string>;

const rawLib = import.meta.glob("../../lib/*.ts", {
  as: "raw",
  eager: true,
}) as Record<string, string>;

export type VirtualProjectFile = {
  file_path: string;
  file_type: string;
  content: string;
};

function extToType(filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase();
  if (!ext) return "text";
  if (ext === "tsx" || ext === "ts") return ext;
  if (ext === "css") return "css";
  if (ext === "json") return "json";
  if (ext === "md") return "md";
  if (ext === "html") return "html";
  if (ext === "js") return "js";
  return "text";
}

function normalizeToRepoPath(rawKey: string): string {
  // rawKey example: "../../components/ui/button.tsx" (resolved by Vite)
  // Normalize to a virtual project path that matches template manifest style.
  const idx = rawKey.lastIndexOf("/src/");
  if (idx !== -1) return rawKey.slice(idx + 1);
  const srcIdx = rawKey.indexOf("src/");
  if (srcIdx !== -1) return rawKey.slice(srcIdx);
  // Fallback: try to infer based on known folders
  if (rawKey.includes("/components/")) {
    return `src/${rawKey.split("/components/")[1] ? `components/${rawKey.split("/components/")[1]}` : rawKey}`;
  }
  if (rawKey.includes("/hooks/")) {
    return `src/${rawKey.split("/hooks/")[1] ? `hooks/${rawKey.split("/hooks/")[1]}` : rawKey}`;
  }
  if (rawKey.includes("/lib/")) {
    return `src/${rawKey.split("/lib/")[1] ? `lib/${rawKey.split("/lib/")[1]}` : rawKey}`;
  }
  return rawKey;
}

export function getBaseTemplateFiles(): VirtualProjectFile[] {
  const out: VirtualProjectFile[] = [];

  // Config/base files (already maintained as strings)
  for (const [file_path, content] of Object.entries(BASE_FILES_MAP)) {
    out.push({
      file_path,
      file_type: extToType(file_path),
      content,
    });
  }

  // UI components (real shadcn files in this repo)
  for (const [rawKey, content] of Object.entries(rawUiFiles)) {
    const file_path = normalizeToRepoPath(rawKey);
    out.push({
      file_path,
      file_type: extToType(file_path),
      content,
    });
  }

  // Common hooks/utils (helps match the template expectation)
  for (const [rawKey, content] of Object.entries(rawHooks)) {
    const file_path = normalizeToRepoPath(rawKey);
    out.push({
      file_path,
      file_type: extToType(file_path),
      content,
    });
  }

  for (const [rawKey, content] of Object.entries(rawLib)) {
    const file_path = normalizeToRepoPath(rawKey);
    out.push({
      file_path,
      file_type: extToType(file_path),
      content,
    });
  }

  // Deduplicate by file_path (generated files can override in caller)
  const map = new Map<string, VirtualProjectFile>();
  for (const f of out) map.set(f.file_path, f);
  return Array.from(map.values()).sort((a, b) => a.file_path.localeCompare(b.file_path));
}
