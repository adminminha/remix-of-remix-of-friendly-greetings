// Template Manifest - All file paths & metadata for Tota AI user projects
// This serves as the blueprint for initializing new user projects

export interface TemplateFile {
  path: string;
  type: 'config' | 'component' | 'style' | 'util' | 'page';
  category?: string;
}

// Complete list of template files that will be copied to new projects
export const TEMPLATE_FILES: TemplateFile[] = [
  // Config files
  { path: 'package.json', type: 'config' },
  { path: 'vite.config.ts', type: 'config' },
  { path: 'tailwind.config.ts', type: 'config' },
  { path: 'tsconfig.json', type: 'config' },
  { path: 'tsconfig.app.json', type: 'config' },
  { path: 'tsconfig.node.json', type: 'config' },
  { path: 'postcss.config.js', type: 'config' },
  { path: 'components.json', type: 'config' },
  { path: 'index.html', type: 'config' },
  
  // Public assets
  { path: 'public/favicon.ico', type: 'config' },
  { path: 'public/placeholder.svg', type: 'config' },
  { path: 'public/robots.txt', type: 'config' },
  
  // Core files
  { path: 'src/main.tsx', type: 'util' },
  { path: 'src/App.tsx', type: 'util' },
  { path: 'src/App.css', type: 'style' },
  { path: 'src/index.css', type: 'style' },
  { path: 'src/vite-env.d.ts', type: 'util' },
  
  // Utilities
  { path: 'src/lib/utils.ts', type: 'util' },
  
  // Hooks
  { path: 'src/hooks/use-mobile.tsx', type: 'util' },
  { path: 'src/hooks/use-toast.ts', type: 'util' },
  
  // UI Components (shadcn/ui)
  { path: 'src/components/ui/accordion.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/alert-dialog.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/alert.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/aspect-ratio.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/avatar.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/badge.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/breadcrumb.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/button.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/calendar.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/card.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/carousel.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/chart.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/checkbox.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/collapsible.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/command.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/context-menu.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/dialog.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/drawer.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/dropdown-menu.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/form.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/hover-card.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/input-otp.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/input.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/label.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/menubar.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/navigation-menu.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/pagination.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/popover.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/progress.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/radio-group.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/resizable.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/scroll-area.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/select.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/separator.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/sheet.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/sidebar.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/skeleton.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/slider.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/sonner.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/switch.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/table.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/tabs.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/textarea.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/toast.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/toaster.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/toggle-group.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/toggle.tsx', type: 'component', category: 'ui' },
  { path: 'src/components/ui/tooltip.tsx', type: 'component', category: 'ui' },
];

// Get all UI component paths
export const getUIComponentPaths = (): string[] => {
  return TEMPLATE_FILES
    .filter(f => f.category === 'ui')
    .map(f => f.path);
};

// Get all config file paths
export const getConfigPaths = (): string[] => {
  return TEMPLATE_FILES
    .filter(f => f.type === 'config')
    .map(f => f.path);
};

// Template metadata
export const TEMPLATE_METADATA = {
  name: 'Tota AI Base Template',
  version: '1.0.0',
  framework: 'React 18',
  styling: 'Tailwind CSS',
  uiLibrary: 'shadcn/ui',
  buildTool: 'Vite',
  language: 'TypeScript',
  totalComponents: TEMPLATE_FILES.filter(f => f.category === 'ui').length,
  totalFiles: TEMPLATE_FILES.length,
};
