import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Monitor, RefreshCw, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DeviceType } from './TopBar';

interface PreviewPanelProps {
  previewUrl?: string;
  previewHtml?: string;
  isLoading?: boolean;
  device?: DeviceType;
  onRefresh?: () => void;
}

const deviceSizes = {
  desktop: { width: '100%', maxWidth: '100%' },
  tablet: { width: '768px', maxWidth: '768px' },
  mobile: { width: '375px', maxWidth: '375px' },
};

const PreviewPanel = ({ 
  previewUrl, 
  previewHtml,
  isLoading = false, 
  device = 'desktop',
  onRefresh 
}: PreviewPanelProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeKey, setIframeKey] = useState(0);

  // Create blob URL for HTML content
  const blobUrl = useMemo(() => {
    if (!previewHtml) return null;
    const blob = new Blob([previewHtml], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }, [previewHtml]);

  // Cleanup blob URL on unmount or change
  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
    onRefresh?.();
  };

  const hasContent = previewUrl || previewHtml;

  return (
    <div className="flex flex-col h-full bg-muted/30">
      {/* Preview Frame */}
      <div className="flex-1 overflow-auto p-4 flex items-start justify-center">
        <motion.div
          layout
          className={cn(
            "bg-background border border-border/50 rounded-lg shadow-lg overflow-hidden transition-all duration-300 relative",
            device === 'mobile' && "rounded-[2rem]"
          )}
          style={{
            width: deviceSizes[device].width,
            maxWidth: deviceSizes[device].maxWidth,
            height: device === 'desktop' ? 'calc(100% - 1rem)' : device === 'tablet' ? '600px' : '667px',
          }}
        >
          {isLoading ? (
            <div className="w-full h-full p-4 space-y-4">
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Generating component...</p>
                </div>
              </div>
              <Skeleton className="h-16 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-40 w-full" />
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </div>
            </div>
          ) : hasContent ? (
            <>
              <iframe
                key={iframeKey}
                ref={iframeRef}
                src={blobUrl || previewUrl}
                className="w-full h-full border-0"
                title="Preview"
                sandbox="allow-scripts allow-same-origin"
              />
              {/* Refresh button overlay */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 bg-background/80 hover:bg-background shadow-sm"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                  <Monitor className="h-8 w-8" />
                </div>
                <h3 className="font-semibold mb-2">Preview Area</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Start chatting with AI to generate your website. The preview will appear here.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PreviewPanel;