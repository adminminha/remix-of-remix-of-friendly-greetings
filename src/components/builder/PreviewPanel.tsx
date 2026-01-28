import { motion } from 'framer-motion';
import { Monitor } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { DeviceType } from './TopBar';

interface PreviewPanelProps {
  previewUrl?: string;
  isLoading?: boolean;
  device?: DeviceType;
}

const deviceSizes = {
  desktop: { width: '100%', maxWidth: '100%' },
  tablet: { width: '768px', maxWidth: '768px' },
  mobile: { width: '375px', maxWidth: '375px' },
};

const PreviewPanel = ({ previewUrl, isLoading = false, device = 'desktop' }: PreviewPanelProps) => {
  return (
    <div className="flex flex-col h-full bg-muted/30">
      {/* Preview Frame */}
      <div className="flex-1 overflow-auto p-4 flex items-start justify-center">
        <motion.div
          layout
          className={cn(
            "bg-background border border-border/50 rounded-lg shadow-lg overflow-hidden transition-all duration-300",
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
          ) : previewUrl ? (
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title="Preview"
              sandbox="allow-scripts allow-same-origin"
            />
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