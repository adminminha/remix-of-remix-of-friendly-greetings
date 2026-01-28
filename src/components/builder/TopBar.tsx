import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bird, Save, ExternalLink, Rocket, Settings, ChevronDown, Check, Loader2, Monitor, Tablet, Smartphone, RefreshCw, Maximize2, Download, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
export type DeviceType = 'desktop' | 'tablet' | 'mobile';
interface TopBarProps {
  projectName: string;
  onProjectNameChange?: (name: string) => void;
  onSave?: () => void;
  onPreview?: () => void;
  onDeploy?: () => void;
  onExport?: () => void;
  isSaving?: boolean;
  lastSavedText?: string | null;
  // Device switching
  device?: DeviceType;
  onDeviceChange?: (device: DeviceType) => void;
  onRefresh?: () => void;
  onFullscreen?: () => void;
  isRefreshing?: boolean;
  // Dev mode
  isDevMode?: boolean;
  onToggleDevMode?: () => void;
}
const TopBar = ({
  projectName,
  onProjectNameChange,
  onSave,
  onPreview,
  onDeploy,
  onExport,
  isSaving = false,
  lastSavedText,
  device = 'desktop',
  onDeviceChange,
  onRefresh,
  onFullscreen,
  isRefreshing = false,
  isDevMode = false,
  onToggleDevMode
}: TopBarProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(projectName);
  const handleNameSubmit = () => {
    if (editName.trim() && onProjectNameChange) {
      onProjectNameChange(editName.trim());
    }
    setIsEditing(false);
  };
  return <header className="h-14 border-b border-border/50 bg-background flex items-center justify-between px-4">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Bird className="h-4 w-4 text-primary-foreground" />
          </div>
        </Link>

        <div className="h-6 w-px bg-border" />

        {/* Project Name */}
        {isEditing ? <Input value={editName} onChange={e => setEditName(e.target.value)} onBlur={handleNameSubmit} onKeyDown={e => e.key === 'Enter' && handleNameSubmit()} className="h-8 w-48 text-sm font-medium" autoFocus /> : <button onClick={() => {
        setIsEditing(true);
        setEditName(projectName);
      }} className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors">
            {projectName}
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>}

        {/* Save Status */}
        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
          {isSaving ? <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Saving...</span>
            </> : lastSavedText ? <>
              <Check className="h-3 w-3 text-primary" />
              <span>Saved {lastSavedText}</span>
            </> : null}
        </div>
      </div>

      {/* Center Section - Device Controls */}
      <div className="hidden md:flex items-center gap-3">
        <Tabs value={device} onValueChange={v => onDeviceChange?.(v as DeviceType)}>
          <TabsList className="h-9">
            <TabsTrigger value="desktop" className="h-7 px-3 gap-1.5">
              <Monitor className="h-4 w-4" />
              
            </TabsTrigger>
            <TabsTrigger value="tablet" className="h-7 px-3 gap-1.5">
              <Tablet className="h-4 w-4" />
              
            </TabsTrigger>
            <TabsTrigger value="mobile" className="h-7 px-3 gap-1.5">
              <Smartphone className="h-4 w-4" />
              
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="h-6 w-px bg-border" />

        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRefresh} disabled={isRefreshing}>
          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onFullscreen}>
          <Maximize2 className="h-4 w-4" />
        </Button>

        <div className="h-6 w-px bg-border" />

        {/* Dev Mode Toggle */}
        <Button variant={isDevMode ? "default" : "ghost"} size="sm" className={cn("h-8 gap-1.5", isDevMode && "bg-primary")} onClick={onToggleDevMode}>
          <Code className="h-4 w-4" />
          
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onSave} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          
        </Button>

        <Button variant="ghost" size="sm" onClick={onPreview} className="gap-2">
          <ExternalLink className="h-4 w-4" />
          <span className="hidden sm:inline">Preview</span>
        </Button>

        <Button size="sm" onClick={onDeploy} className="liquid-button gap-2">
          <Rocket className="h-4 w-4" />
          <span className="hidden sm:inline">Deploy</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Project Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Code
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Help & Documentation</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>;
};
export default TopBar;