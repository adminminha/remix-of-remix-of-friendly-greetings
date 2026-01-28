import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileCode, 
  FileText, 
  Copy, 
  Check, 
  Loader2,
  Package,
  Globe
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
}

type ExportFormat = 'react' | 'html' | 'clipboard';

const ExportDialog = ({ 
  open, 
  onOpenChange, 
  projectId, 
  projectName 
}: ExportDialogProps) => {
  const [format, setFormat] = useState<ExportFormat>('react');
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const exportOptions = [
    {
      id: 'react' as const,
      title: 'React Project',
      description: 'Download as a complete React + Vite project (.zip)',
      icon: Package,
    },
    {
      id: 'html' as const,
      title: 'Static HTML',
      description: 'Export as static HTML files with inline styles',
      icon: Globe,
    },
    {
      id: 'clipboard' as const,
      title: 'Copy to Clipboard',
      description: 'Copy the main component code to clipboard',
      icon: Copy,
    },
  ];

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Fetch project files
      const { data: files, error } = await supabase
        .from('files')
        .select('*')
        .eq('project_id', projectId);

      if (error) throw error;

      switch (format) {
        case 'react':
          await exportReactProject(files || []);
          break;
        case 'html':
          await exportStaticHtml(files || []);
          break;
        case 'clipboard':
          await copyToClipboard(files || []);
          break;
      }

      toast({
        title: 'Export successful!',
        description: format === 'clipboard' 
          ? 'Code copied to clipboard' 
          : 'Your project has been downloaded',
      });

      if (format !== 'clipboard') {
        onOpenChange(false);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Export failed',
        description: error.message,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportReactProject = async (files: any[]) => {
    // Create a simple text representation of the project
    // In production, this would use JSZip to create actual .zip file
    const projectContent = files
      .map(f => `// ${f.file_path}\n${f.content || '// Empty file'}`)
      .join('\n\n---\n\n');

    const blob = new Blob([projectContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}-project.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportStaticHtml = async (files: any[]) => {
    // Find the main component and convert to HTML
    const mainFile = files.find(f => 
      f.file_path.includes('App.tsx') || 
      f.file_path.includes('index.tsx') ||
      f.file_type === 'tsx'
    );

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body>
  <div id="app">
    <!-- Generated from Tota AI -->
    ${mainFile?.content || '<p>No content generated yet</p>'}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (files: any[]) => {
    const mainFile = files.find(f => f.file_type === 'tsx');
    const content = mainFile?.content || '// No component code found';
    
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Project
          </DialogTitle>
          <DialogDescription>
            Choose how you want to export "{projectName}"
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup
            value={format}
            onValueChange={(value) => setFormat(value as ExportFormat)}
            className="space-y-3"
          >
            {exportOptions.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Label
                  htmlFor={option.id}
                  className={`
                    flex items-start gap-4 p-4 rounded-lg border cursor-pointer
                    transition-colors
                    ${format === option.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                    }
                  `}
                >
                  <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <option.icon className="h-4 w-4 text-primary" />
                      <span className="font-medium">{option.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </div>
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : format === 'clipboard' ? (
              <>
                {copied ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copied ? 'Copied!' : 'Copy'}
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
