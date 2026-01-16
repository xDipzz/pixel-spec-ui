import { Terminal, Upload, Image, Cpu, FileText, Keyboard, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToolStore } from '@/lib/tool-store';
import { ToolStatus } from '@/lib/types';

interface ToolHeaderProps {
  onOpenDocs: () => void;
  onOpenShortcuts: () => void;
  onOpenSettings: () => void;
}

const statusStyles: Record<ToolStatus, string> = {
  idle: 'bg-muted-foreground/20 text-muted-foreground',
  ready: 'bg-primary/20 text-primary',
  analyzing: 'bg-[hsl(var(--neon-yellow))]/20 text-[hsl(var(--neon-yellow))]',
  done: 'bg-[hsl(var(--neon-cyan))]/20 text-[hsl(var(--neon-cyan))]',
  failed: 'bg-destructive/20 text-destructive',
};

export const ToolHeader = ({ onOpenDocs, onOpenShortcuts, onOpenSettings }: ToolHeaderProps) => {
  const { status, uploadedImage, reset, setUploadedImage, analyzeScreenshot, analysisProgress } = useToolStore();

  const handleLoadSample = () => {
    import('@/assets/sample-screenshot.png').then((module) => {
      setUploadedImage(module.default, 'sample.png');
    });
  };

  const handleAnalyze = () => {
    analyzeScreenshot();
  };

  return (
    <header className="h-8 border-b border-border bg-card flex items-center justify-between px-2 gap-3 select-none">
      {/* Left: Logo */}
      <div className="flex items-center gap-1.5">
        <Terminal className="w-3.5 h-3.5 text-primary" />
        <span className="font-mono font-bold text-xs neon-text tracking-tight">PixelSpec AI</span>
      </div>

      {/* Center: Nav */}
      <nav className="flex items-center gap-1">
        <button onClick={onOpenDocs} className="compact-btn text-muted-foreground hover:text-foreground flex items-center gap-1">
          <FileText className="w-3 h-3" />
          <span>Docs</span>
        </button>
        <button onClick={onOpenShortcuts} className="compact-btn text-muted-foreground hover:text-foreground flex items-center gap-1">
          <Keyboard className="w-3 h-3" />
          <span>Shortcuts</span>
        </button>
        <button onClick={onOpenSettings} className="compact-btn text-muted-foreground hover:text-foreground flex items-center gap-1">
          <Settings className="w-3 h-3" />
          <span>Settings</span>
        </button>
      </nav>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={reset} className="compact-btn">
          <Upload className="w-3 h-3" />
          New <kbd className="kbd ml-0.5">N</kbd>
        </Button>
        <Button variant="ghost" size="sm" onClick={handleLoadSample} className="compact-btn">
          <Image className="w-3 h-3" />
          Sample
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={handleAnalyze}
          disabled={!uploadedImage || status === 'analyzing' || status === 'done'}
          className="compact-btn"
        >
          <Cpu className="w-3 h-3" />
          Analyze <kbd className="kbd ml-0.5 bg-primary-foreground/20 border-primary-foreground/30 text-primary-foreground">A</kbd>
        </Button>

        <div className="toolbar-separator" />

        <div className={`status-badge ${statusStyles[status]}`}>
          {status === 'analyzing' ? `analyzing ${Math.round(analysisProgress)}%` : status}
        </div>
      </div>
    </header>
  );
};
