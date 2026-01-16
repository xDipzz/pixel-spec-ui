import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Settings, Eye, Grid3X3, MessageSquare } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useToolStore } from '@/lib/tool-store';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsModal = ({ open, onOpenChange }: SettingsModalProps) => {
  const { overlaysEnabled, toggleOverlays, gridEnabled, toggleGrid, tooltipEnabled, toggleTooltip, wrapLines, setWrapLines } = useToolStore();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm">
            <Settings className="w-4 h-4 text-primary" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] flex items-center gap-1.5">
              <Eye className="w-3 h-3 text-muted-foreground" />
              Show overlays
            </span>
            <Switch checked={overlaysEnabled} onCheckedChange={toggleOverlays} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] flex items-center gap-1.5">
              <Grid3X3 className="w-3 h-3 text-muted-foreground" />
              Show grid
            </span>
            <Switch checked={gridEnabled} onCheckedChange={toggleGrid} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3 text-muted-foreground" />
              Show tooltips
            </span>
            <Switch checked={tooltipEnabled} onCheckedChange={toggleTooltip} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px]">Wrap export lines</span>
            <Switch checked={wrapLines} onCheckedChange={setWrapLines} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
