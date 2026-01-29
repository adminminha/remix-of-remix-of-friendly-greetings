// Unified Template Export for Tota AI
// Combines all component templates into a single exportable map

// Base files (config, setup)
export { BASE_FILES_MAP, BASE_PACKAGE_JSON, BASE_VITE_CONFIG, BASE_TAILWIND_CONFIG, BASE_TSCONFIG, BASE_INDEX_HTML, BASE_MAIN_TSX, BASE_APP_TSX, BASE_INDEX_CSS, BASE_UTILS_TS, BASE_POSTCSS_CONFIG, BASE_COMPONENTS_JSON } from './base-files';

// Core UI components
export { UI_COMPONENTS_MAP, UI_BUTTON, UI_CARD, UI_BADGE, UI_INPUT, UI_TEXTAREA, UI_AVATAR, UI_SEPARATOR, UI_SKELETON, getComponentCode } from './ui-components';

// Extended form/dialog components
export { UI_COMPONENTS_EXTENDED_MAP, UI_LABEL, UI_CHECKBOX, UI_SWITCH, UI_RADIO_GROUP, UI_SLIDER, UI_PROGRESS, UI_SELECT, UI_DIALOG, UI_ALERT, UI_ALERT_DIALOG } from './ui-components-extended';

// Layout components
export { UI_COMPONENTS_LAYOUT_MAP, UI_TABLE, UI_TABS, UI_ACCORDION, UI_POPOVER, UI_TOOLTIP, UI_DROPDOWN_MENU, UI_SCROLL_AREA, UI_HOVER_CARD, UI_ASPECT_RATIO, UI_COLLAPSIBLE } from './ui-components-layout';

// Advanced components
export { UI_COMPONENTS_ADVANCED_MAP, UI_SHEET, UI_DRAWER, UI_TOGGLE, UI_TOGGLE_GROUP, UI_TOAST, UI_SONNER, UI_RESIZABLE } from './ui-components-advanced';

// Template manifest
export { TEMPLATE_FILES, TEMPLATE_METADATA, getUIComponentPaths, getConfigPaths, type TemplateFile } from './index';

// Virtual project template
export { getBaseTemplateFiles, type VirtualProjectFile } from './project-base-template';

// Import all component maps
import { UI_COMPONENTS_MAP } from './ui-components';
import { UI_COMPONENTS_EXTENDED_MAP } from './ui-components-extended';
import { UI_COMPONENTS_LAYOUT_MAP } from './ui-components-layout';
import { UI_COMPONENTS_ADVANCED_MAP } from './ui-components-advanced';
import { BASE_FILES_MAP } from './base-files';

// Complete merged template files map for AI code generation
export const COMPLETE_TEMPLATE_FILES: Record<string, string> = {
  ...BASE_FILES_MAP,
  ...UI_COMPONENTS_MAP,
  ...UI_COMPONENTS_EXTENDED_MAP,
  ...UI_COMPONENTS_LAYOUT_MAP,
  ...UI_COMPONENTS_ADVANCED_MAP,
};

// List of all available UI component names for AI system prompt
export const AVAILABLE_UI_COMPONENTS = [
  // Core
  'Button', 'Card', 'Badge', 'Input', 'Textarea', 'Avatar', 'Separator', 'Skeleton',
  // Form
  'Label', 'Checkbox', 'Switch', 'RadioGroup', 'Slider', 'Progress', 'Select',
  // Dialogs
  'Dialog', 'Alert', 'AlertDialog', 'Sheet', 'Drawer',
  // Layout
  'Table', 'Tabs', 'Accordion', 'Popover', 'Tooltip', 'DropdownMenu', 
  'ScrollArea', 'HoverCard', 'AspectRatio', 'Collapsible',
  // Advanced
  'Toggle', 'ToggleGroup', 'Toast', 'Sonner', 'Resizable',
];

// Component import paths mapping for AI
export const COMPONENT_IMPORT_PATHS: Record<string, string> = {
  Button: '@/components/ui/button',
  Card: '@/components/ui/card',
  Badge: '@/components/ui/badge',
  Input: '@/components/ui/input',
  Textarea: '@/components/ui/textarea',
  Avatar: '@/components/ui/avatar',
  Separator: '@/components/ui/separator',
  Skeleton: '@/components/ui/skeleton',
  Label: '@/components/ui/label',
  Checkbox: '@/components/ui/checkbox',
  Switch: '@/components/ui/switch',
  RadioGroup: '@/components/ui/radio-group',
  Slider: '@/components/ui/slider',
  Progress: '@/components/ui/progress',
  Select: '@/components/ui/select',
  Dialog: '@/components/ui/dialog',
  Alert: '@/components/ui/alert',
  AlertDialog: '@/components/ui/alert-dialog',
  Sheet: '@/components/ui/sheet',
  Drawer: '@/components/ui/drawer',
  Table: '@/components/ui/table',
  Tabs: '@/components/ui/tabs',
  Accordion: '@/components/ui/accordion',
  Popover: '@/components/ui/popover',
  Tooltip: '@/components/ui/tooltip',
  DropdownMenu: '@/components/ui/dropdown-menu',
  ScrollArea: '@/components/ui/scroll-area',
  HoverCard: '@/components/ui/hover-card',
  AspectRatio: '@/components/ui/aspect-ratio',
  Collapsible: '@/components/ui/collapsible',
  Toggle: '@/components/ui/toggle',
  ToggleGroup: '@/components/ui/toggle-group',
  Toast: '@/components/ui/toast',
  Sonner: '@/components/ui/sonner',
  Resizable: '@/components/ui/resizable',
};

// Get component code by name
export function getTemplateComponentCode(componentName: string): string | null {
  const importPath = COMPONENT_IMPORT_PATHS[componentName];
  if (!importPath) return null;
  
  const filePath = `src/components/ui/${componentName.toLowerCase().replace('group', '-group')}.tsx`;
  return COMPLETE_TEMPLATE_FILES[filePath] || null;
}

// Get all template file paths
export function getAllTemplatePaths(): string[] {
  return Object.keys(COMPLETE_TEMPLATE_FILES);
}

// Template statistics
export function getTemplateStats() {
  const paths = getAllTemplatePaths();
  return {
    totalFiles: paths.length,
    uiComponents: AVAILABLE_UI_COMPONENTS.length,
    configFiles: Object.keys(BASE_FILES_MAP).length,
    totalSize: Object.values(COMPLETE_TEMPLATE_FILES).reduce((sum, content) => sum + content.length, 0),
  };
}
