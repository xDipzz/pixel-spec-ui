import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const shortcuts = [
  { keys: ['Esc'], action: 'Deselect element' },
  { keys: ['O'], action: 'Toggle overlays' },
  { keys: ['G'], action: 'Toggle grid' },
  { keys: ['T'], action: 'Toggle tooltips' },
  { keys: ['N'], action: 'New upload' },
  { keys: ['A'], action: 'Analyze' },
  { keys: ['Ctrl', '+'], action: 'Zoom in' },
  { keys: ['Ctrl', '-'], action: 'Zoom out' },
  { keys: ['Ctrl', '0'], action: 'Reset zoom' },
  { keys: ['Ctrl', 'C'], action: 'Copy current export' },
  { keys: ['Ctrl', 'V'], action: 'Paste image' },
];

export const ShortcutsModal = ({ open, onOpenChange }: ShortcutsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm">
            <Keyboard className="w-4 h-4 text-primary" />
            Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-1">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-1 border-b border-border/30 last:border-0">
              <span className="text-[11px] text-muted-foreground">{s.action}</span>
              <div className="flex items-center gap-0.5">
                {s.keys.map((k, j) => (
                  <span key={j}>
                    <kbd className="kbd">{k}</kbd>
                    {j < s.keys.length - 1 && <span className="text-muted-foreground/50 mx-0.5">+</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
