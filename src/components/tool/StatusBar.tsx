import { Eye, EyeOff, Grid3X3 } from 'lucide-react';
import { useToolStore } from '@/lib/tool-store';
import { mockElements } from '@/lib/mock-elements';

export const StatusBar = () => {
  const { zoom, selectedElementId, overlaysEnabled, gridEnabled, mouseX, mouseY, status } = useToolStore();
  const element = mockElements.find(el => el.id === selectedElementId);
  const isReady = status === 'done';

  return (
    <footer className="h-5 border-t border-border bg-card flex items-center justify-between px-2 text-[9px] font-mono text-muted-foreground select-none">
      <div className="flex items-center gap-3">
        <span>Zoom: <span className="text-foreground">{zoom}%</span></span>
        <span className="flex items-center gap-0.5">
          {overlaysEnabled ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
          <span className={overlaysEnabled ? 'text-primary' : ''}>Overlays</span>
        </span>
        <span className="flex items-center gap-0.5">
          <Grid3X3 className="w-2.5 h-2.5" />
          <span className={gridEnabled ? 'text-primary' : ''}>Grid</span>
        </span>
        {isReady && <span>Mouse: <span className="text-foreground">{mouseX},{mouseY}</span></span>}
        
        <div className="toolbar-separator mx-2" />
        
        <span className="flex items-center gap-1 opacity-70">
          <span className="text-[8px] uppercase tracking-tighter">Powered by</span>
          <span className="text-primary font-bold">Groq</span>
          <span className="text-[8px]">&</span>
          <span className="text-[hsl(var(--neon-cyan))] font-bold">GLM</span>
        </span>
      </div>

      <div className="flex items-center gap-2 min-w-0">
        {element ? (
          <span className="flex items-center gap-1 min-w-0">
            <span className="text-primary truncate max-w-[200px]">{element.name}</span>
            <span className="text-muted-foreground/60 ml-1 flex-shrink-0">#{element.id}</span>
          </span>
        ) : (
          <span>No selection</span>
        )}
      </div>
    </footer>
  );
};
