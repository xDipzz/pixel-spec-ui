import { Terminal, Upload, Image, Cpu, FileText, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ToolStatus = 'idle' | 'ready' | 'analyzing' | 'done';

interface HeaderBarProps {
  status: ToolStatus;
  onNewUpload: () => void;
  onLoadSample: () => void;
  onAnalyze: () => void;
  canAnalyze: boolean;
  onOpenDocs: () => void;
  onOpenShortcuts: () => void;
}

const statusConfig: Record<ToolStatus, { label: string; color: string }> = {
  idle: { label: 'Idle', color: 'bg-muted-foreground/20 text-muted-foreground' },
  ready: { label: 'Ready', color: 'bg-primary/20 text-primary' },
  analyzing: { label: 'Analyzing', color: 'bg-[hsl(var(--neon-yellow))]/20 text-[hsl(var(--neon-yellow))]' },
  done: { label: 'Done', color: 'bg-[hsl(var(--neon-cyan))]/20 text-[hsl(var(--neon-cyan))]' },
};

export const HeaderBar = ({
  status,
  onNewUpload,
  onLoadSample,
  onAnalyze,
  canAnalyze,
  onOpenDocs,
  onOpenShortcuts,
}: HeaderBarProps) => {
  const statusInfo = statusConfig[status];

  return (
    <header className="h-11 border-b border-border bg-card flex items-center justify-between px-3 gap-4">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <Terminal className="w-4 h-4 text-primary" />
        <span className="font-mono font-semibold text-sm neon-text">PixelSpec AI</span>
      </div>

      {/* Middle: Nav links */}
      <nav className="flex items-center gap-4">
        <button
          onClick={onOpenDocs}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
        >
          <FileText className="w-3 h-3" />
          Docs
        </button>
        <button
          onClick={onOpenShortcuts}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
        >
          <Keyboard className="w-3 h-3" />
          Shortcuts
        </button>
      </nav>

      {/* Right: Actions + Status */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onNewUpload} className="h-7 text-xs gap-1.5">
          <Upload className="w-3 h-3" />
          New Upload
        </Button>
        <Button variant="ghost" size="sm" onClick={onLoadSample} className="h-7 text-xs gap-1.5">
          <Image className="w-3 h-3" />
          Load Sample
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onAnalyze}
          disabled={!canAnalyze}
          className="h-7 text-xs gap-1.5"
        >
          <Cpu className="w-3 h-3" />
          Analyze
        </Button>

        <div className="w-px h-5 bg-border mx-1" />

        <div className={`status-badge ${statusInfo.color}`}>
          {statusInfo.label}
        </div>
      </div>
    </header>
  );
};
