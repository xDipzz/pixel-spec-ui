import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Lightbulb } from 'lucide-react';

interface DocsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DocsModal = ({ open, onOpenChange }: DocsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-primary" />
            Documentation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-[11px]">
          <section>
            <h3 className="font-semibold mb-1.5 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-primary" />
              Quick Start
            </h3>
            <ol className="list-decimal list-inside space-y-0.5 text-muted-foreground">
              <li>Upload screenshot (drop, click, or Ctrl+V)</li>
              <li>Click "Analyze" to detect elements</li>
              <li>Click elements to inspect properties</li>
              <li>Export as JSON, Tailwind, or CSS</li>
            </ol>
          </section>

          <section>
            <h3 className="font-semibold mb-1.5">Tips</h3>
            <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
              <li>Use layer filters to find specific elements</li>
              <li>Toggle overlays/grid for better inspection</li>
              <li>Minimap shows viewport position</li>
              <li>All processing is local & private</li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};
