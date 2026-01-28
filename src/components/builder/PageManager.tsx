import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  MoreVertical, 
  Home, 
  Trash2, 
  Edit2, 
  Check, 
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Page {
  id: string;
  title: string;
  slug: string;
  is_home: boolean;
  component_path: string | null;
}

interface PageManagerProps {
  projectId: string;
  currentPageId?: string;
  onPageSelect: (page: Page) => void;
  onPageCreate?: (page: Page) => void;
}

const PageManager = ({ 
  projectId, 
  currentPageId, 
  onPageSelect,
  onPageCreate 
}: PageManagerProps) => {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const { toast } = useToast();

  // Fetch pages on mount and when projectId changes
  useEffect(() => {
    fetchPages();
  }, [projectId]);

  const fetchPages = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('project_id', projectId)
        .order('is_home', { ascending: false })
        .order('title', { ascending: true });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createPage = async () => {
    if (!newPageTitle.trim()) return;

    const slug = newPageTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    try {
      const { data, error } = await supabase
        .from('pages')
        .insert({
          project_id: projectId,
          title: newPageTitle.trim(),
          slug,
          is_home: pages.length === 0, // First page is home
        })
        .select()
        .single();

      if (error) throw error;

      setPages([...pages, data]);
      setNewPageTitle('');
      setIsCreating(false);
      onPageCreate?.(data);
      
      toast({
        title: 'Page created',
        description: `"${data.title}" has been created`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  const updatePage = async (pageId: string, updates: Partial<Page>) => {
    try {
      const { error } = await supabase
        .from('pages')
        .update(updates)
        .eq('id', pageId);

      if (error) throw error;

      setPages(pages.map(p => p.id === pageId ? { ...p, ...updates } : p));
      setEditingPageId(null);
      
      toast({
        title: 'Page updated',
        description: 'Changes saved successfully',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  const deletePage = async (pageId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (page?.is_home && pages.length > 1) {
      toast({
        variant: 'destructive',
        title: 'Cannot delete',
        description: 'Set another page as home first',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('pages')
        .delete()
        .eq('id', pageId);

      if (error) throw error;

      setPages(pages.filter(p => p.id !== pageId));
      
      toast({
        title: 'Page deleted',
        description: `"${page?.title}" has been deleted`,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  const setAsHome = async (pageId: string) => {
    // First, unset current home
    const currentHome = pages.find(p => p.is_home);
    if (currentHome) {
      await supabase
        .from('pages')
        .update({ is_home: false })
        .eq('id', currentHome.id);
    }

    // Set new home
    await updatePage(pageId, { is_home: true });
    
    // Update local state
    setPages(pages.map(p => ({
      ...p,
      is_home: p.id === pageId
    })));
  };

  const startEditing = (page: Page) => {
    setEditingPageId(page.id);
    setEditingTitle(page.title);
  };

  const saveEditing = () => {
    if (editingPageId && editingTitle.trim()) {
      const slug = editingTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      updatePage(editingPageId, { 
        title: editingTitle.trim(),
        slug 
      });
    }
    setEditingPageId(null);
  };

  const cancelEditing = () => {
    setEditingPageId(null);
    setEditingTitle('');
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="border-b border-border/50">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between px-3 py-2 h-auto"
          >
            <div className="flex items-center gap-2">
              {isOpen ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="font-medium text-sm">Pages</span>
              <span className="text-xs text-muted-foreground">({pages.length})</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                setIsCreating(true);
                setIsOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-2 pb-2 space-y-1">
            {/* Loading state */}
            {isLoading && (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                Loading pages...
              </div>
            )}

            {/* Empty state */}
            {!isLoading && pages.length === 0 && !isCreating && (
              <div className="px-2 py-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">No pages yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreating(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create first page
                </Button>
              </div>
            )}

            {/* Page list */}
            <AnimatePresence>
              {pages.map((page) => (
                <motion.div
                  key={page.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    "group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors",
                    currentPageId === page.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  )}
                  onClick={() => {
                    if (editingPageId !== page.id) {
                      onPageSelect(page);
                    }
                  }}
                >
                  {page.is_home ? (
                    <Home className="h-4 w-4 shrink-0" />
                  ) : (
                    <FileText className="h-4 w-4 shrink-0" />
                  )}

                  {editingPageId === page.id ? (
                    <div className="flex-1 flex items-center gap-1">
                      <Input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="h-6 text-sm py-0"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEditing();
                          if (e.key === 'Escape') cancelEditing();
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          saveEditing();
                        }}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          cancelEditing();
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 text-sm truncate">{page.title}</span>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => startEditing(page)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          {!page.is_home && (
                            <DropdownMenuItem onClick={() => setAsHome(page.id)}>
                              <Home className="h-4 w-4 mr-2" />
                              Set as Home
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => deletePage(page.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* New page input */}
            {isCreating && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-1 px-2 py-1"
              >
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <Input
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  placeholder="Page name..."
                  className="h-7 text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') createPage();
                    if (e.key === 'Escape') {
                      setIsCreating(false);
                      setNewPageTitle('');
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={createPage}
                  disabled={!newPageTitle.trim()}
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    setIsCreating(false);
                    setNewPageTitle('');
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </motion.div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default PageManager;
