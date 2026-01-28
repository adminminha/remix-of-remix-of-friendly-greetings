import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bird, Plus, Search, Bell, FolderOpen, Zap, Clock, HardDrive,
  MoreVertical, Eye, Copy, Trash2, Archive, LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  preview_url: string | null;
  created_at: string;
  updated_at: string;
}

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [aiGenerations, setAiGenerations] = useState({ used: 0, total: 100 });
  const [storageUsed, setStorageUsed] = useState({ used: 0, total: 10 }); // in GB
  
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch AI generations count from chat messages
      const { count: messagesCount } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'assistant');

      setAiGenerations({ 
        used: messagesCount || 0, 
        total: 100 
      });

      // Calculate storage from files
      const { data: files } = await supabase
        .from('files')
        .select('content');

      const totalBytes = files?.reduce((acc, file) => {
        return acc + (file.content?.length || 0);
      }, 0) || 0;

      const usedGB = totalBytes / (1024 * 1024 * 1024);
      setStorageUsed({ used: usedGB, total: 10 });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const createProject = async () => {
    if (!newProjectName.trim()) return;
    setCreating(true);

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: newProjectName,
          description: newProjectDesc || null,
          user_id: user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Project Created! 🎉",
        description: `${newProjectName} is ready to build`,
      });

      setCreateDialogOpen(false);
      setNewProjectName('');
      setNewProjectDesc('');
      navigate(`/builder/${data.id}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setCreating(false);
    }
  };

  const deleteProject = async (id: string, name: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProjects(projects.filter(p => p.id !== id));
      toast({
        title: "Project Deleted",
        description: `${name} has been deleted`,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      icon: FolderOpen,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'AI Generations',
      value: `${aiGenerations.used}/${aiGenerations.total}`,
      icon: Zap,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      progress: Math.round((aiGenerations.used / aiGenerations.total) * 100),
    },
    {
      title: 'Active Projects',
      value: projects.filter(p => p.status === 'active').length,
      icon: Clock,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Storage Used',
      value: storageUsed.used < 0.01 ? '< 10 MB' : `${storageUsed.used.toFixed(2)} GB`,
      icon: HardDrive,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
      progress: Math.round((storageUsed.used / storageUsed.total) * 100),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Bird className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">Tota AI</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.email?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's what's happening with your projects.
            </p>
          </div>
          
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="liquid-button">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Start building your website with AI assistance
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    placeholder="My Awesome Website"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="A brief description of your project..."
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={createProject}
                  disabled={!newProjectName.trim() || creating}
                  className="liquid-button"
                >
                  {creating ? 'Creating...' : 'Create Project'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  {stat.progress !== undefined && (
                    <Progress value={stat.progress} className="mt-3 h-1.5" />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Projects Section */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Your Projects</CardTitle>
            <Tabs defaultValue="all" className="w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-40 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                  <FolderOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first project to start building with AI
                </p>
                <Button onClick={() => setCreateDialogOpen(true)} className="liquid-button">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Project
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="group border-border/50 hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer overflow-hidden">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Bird className="h-12 w-12 text-primary/50" />
                        </div>
                        <div className="absolute top-2 right-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/builder/${project.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Open
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Copy className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Archive className="h-4 w-4 mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => deleteProject(project.id, project.name)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <CardContent className="p-4" onClick={() => navigate(`/builder/${project.id}`)}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold truncate">{project.name}</h3>
                            <p className="text-sm text-muted-foreground truncate">
                              {project.description || 'No description'}
                            </p>
                          </div>
                          <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3">
                          Updated {new Date(project.updated_at).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
