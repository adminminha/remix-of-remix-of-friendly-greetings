// Tota AI - Smart Preview Builder
// Dependency-based file loading for fast preview rendering
// Only loads files that are actually needed (not all 48 components)

import { getBaseTemplateFiles, VirtualProjectFile } from '@/lib/templates/project-base-template';
import { AVAILABLE_UI_COMPONENTS, COMPONENT_IMPORT_PATHS } from '@/lib/templates/template-exports';

export interface PreviewFile {
  file_path: string;
  content: string;
  file_type: string;
}

// In-memory cache for loaded files
const fileCache = new Map<string, PreviewFile>();

/**
 * Parse imports from component code
 * Extracts all @/ imports to find dependencies
 */
function parseImports(code: string): { from: string; path: string }[] {
  const importRegex = /import\s+(?:\{[^}]*\}|[\w*]+(?:\s+as\s+\w+)?)\s+from\s+['"]([^'"]+)['"]/g;
  const imports: { from: string; path: string }[] = [];
  let match;

  while ((match = importRegex.exec(code)) !== null) {
    const importPath = match[1];
    
    if (importPath.startsWith('@/')) {
      // Convert @/ alias to actual path
      let actualPath = importPath.replace('@/', 'src/');
      
      // Add .tsx extension if not present
      if (!actualPath.includes('.')) {
        actualPath += '.tsx';
      }
      
      imports.push({
        from: importPath,
        path: actualPath,
      });
    } else if (importPath.startsWith('./') || importPath.startsWith('../')) {
      // Relative imports - would need context to resolve
      imports.push({
        from: importPath,
        path: importPath, // Needs resolution based on current file
      });
    }
  }

  return imports;
}

/**
 * Extract which UI components are used in code
 * By checking for component names in the code
 */
function extractUsedUIComponents(code: string): string[] {
  const used: string[] = [];
  
  for (const componentName of AVAILABLE_UI_COMPONENTS) {
    // Check if component is used in JSX (with < prefix)
    const jsxRegex = new RegExp(`<${componentName}[\\s/>]`, 'g');
    // Check if component is imported
    const importRegex = new RegExp(`import.*\\{[^}]*${componentName}[^}]*\\}.*from`, 'g');
    
    if (jsxRegex.test(code) || importRegex.test(code)) {
      used.push(componentName);
    }
  }
  
  return used;
}

/**
 * Get file from base template
 */
function getBaseTemplateFile(filePath: string): VirtualProjectFile | null {
  const baseFiles = getBaseTemplateFiles();
  return baseFiles.find(f => f.file_path === filePath) || null;
}

/**
 * Resolve all dependencies for a component recursively
 * Returns a map of file_path -> content
 */
export async function resolveDependencies(
  entryCode: string,
  generatedFiles: PreviewFile[],
  resolved = new Map<string, PreviewFile>()
): Promise<Map<string, PreviewFile>> {
  // Find UI components used in this code
  const usedComponents = extractUsedUIComponents(entryCode);
  
  // Add UI component files to resolved
  for (const componentName of usedComponents) {
    // Convert component name to file path
    const filePath = `src/components/ui/${componentName.toLowerCase().replace('group', '-group')}.tsx`;
    
    if (!resolved.has(filePath)) {
      // Check cache first
      if (fileCache.has(filePath)) {
        resolved.set(filePath, fileCache.get(filePath)!);
      } else {
        // Get from base template
        const baseFile = getBaseTemplateFile(filePath);
        if (baseFile) {
          const file: PreviewFile = {
            file_path: baseFile.file_path,
            content: baseFile.content,
            file_type: baseFile.file_type,
          };
          resolved.set(filePath, file);
          fileCache.set(filePath, file);
        }
      }
    }
  }

  // Always include utils.ts (needed by all components)
  const utilsPath = 'src/lib/utils.ts';
  if (!resolved.has(utilsPath)) {
    const utilsFile = getBaseTemplateFile(utilsPath);
    if (utilsFile) {
      resolved.set(utilsPath, {
        file_path: utilsFile.file_path,
        content: utilsFile.content,
        file_type: utilsFile.file_type,
      });
    }
  }

  // Parse imports and resolve generated files
  const imports = parseImports(entryCode);
  for (const imp of imports) {
    if (!resolved.has(imp.path)) {
      // Check if it's a generated file
      const genFile = generatedFiles.find(f => f.file_path === imp.path);
      if (genFile) {
        resolved.set(imp.path, genFile);
        // Recursively resolve dependencies of this file
        await resolveDependencies(genFile.content, generatedFiles, resolved);
      }
    }
  }

  return resolved;
}

/**
 * Build minimal file set needed for preview
 * Only loads files that are actually imported
 */
export function buildMinimalFileSet(
  generatedFiles: PreviewFile[]
): PreviewFile[] {
  const result: PreviewFile[] = [];
  const included = new Set<string>();

  // Always include essential files
  const essentialPaths = [
    'src/lib/utils.ts',
    'src/index.css',
  ];

  for (const path of essentialPaths) {
    if (!included.has(path)) {
      const file = getBaseTemplateFile(path);
      if (file) {
        result.push({
          file_path: file.file_path,
          content: file.content,
          file_type: file.file_type,
        });
        included.add(path);
      }
    }
  }

  // Analyze generated files to find used UI components
  const allUsedComponents = new Set<string>();
  
  for (const genFile of generatedFiles) {
    if (genFile.content) {
      const used = extractUsedUIComponents(genFile.content);
      used.forEach(c => allUsedComponents.add(c));
    }
  }

  // Add only used UI component files
  for (const componentName of allUsedComponents) {
    const filePath = `src/components/ui/${componentName.toLowerCase().replace('group', '-group')}.tsx`;
    
    if (!included.has(filePath)) {
      const file = getBaseTemplateFile(filePath);
      if (file) {
        result.push({
          file_path: file.file_path,
          content: file.content,
          file_type: file.file_type,
        });
        included.add(filePath);
      }
    }
  }

  // Add all generated files
  for (const genFile of generatedFiles) {
    if (!included.has(genFile.file_path)) {
      result.push(genFile);
      included.add(genFile.file_path);
    }
  }

  return result;
}

/**
 * Get statistics about what files would be loaded
 * Useful for debugging and optimization
 */
export function getLoadingStats(generatedFiles: PreviewFile[]) {
  const baseFiles = getBaseTemplateFiles();
  const minimalSet = buildMinimalFileSet(generatedFiles);
  
  return {
    totalBaseFiles: baseFiles.length,
    generatedFiles: generatedFiles.length,
    minimalSetSize: minimalSet.length,
    reduction: `${Math.round((1 - minimalSet.length / baseFiles.length) * 100)}%`,
    loadedFiles: minimalSet.map(f => f.file_path),
  };
}

/**
 * Clear the file cache
 * Call this when files are updated externally
 */
export function clearFileCache(): void {
  fileCache.clear();
}
