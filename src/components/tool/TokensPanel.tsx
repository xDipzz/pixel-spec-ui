import { mockTokens } from '@/lib/mock-elements';
import { useToolStore } from '@/lib/tool-store';
import { toast } from 'sonner';

export const TokensPanel = () => {
  const { status, designTokens } = useToolStore();
  const isReady = status === 'done';
  
  // Use real tokens if available, otherwise mock
  const tokens = designTokens || mockTokens;

  const copyToken = (value: string, name: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`Copied ${name}: ${value}`);
  };

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2 p-4 text-center">
        <div className="w-8 h-8 rounded-full border border-dashed border-muted-foreground/30 animate-spin-slow" />
        <p className="text-[10px]">Analyze an image to extract design tokens</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto scrollbar-thin p-3 space-y-5 h-full">
      {/* Colors */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Colors</h4>
          <span className="text-[9px] text-muted-foreground/50">{tokens.colors.length} found</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {tokens.colors.map(c => (
            <button
              key={c.name}
              className="group flex items-center gap-2 p-1.5 rounded-md bg-card border border-border hover:border-primary/50 transition-all text-left"
              onClick={() => copyToken(c.value, c.name)}
            >
              <div 
                className="w-8 h-8 rounded border border-border/50 shadow-sm transition-transform group-hover:scale-105" 
                style={{ background: c.value }} 
              />
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-medium truncate w-full group-hover:text-primary transition-colors">{c.name}</span>
                <span className="text-[9px] font-mono text-muted-foreground truncate opacity-70">{c.value}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Typography</h4>
        <div className="space-y-1">
          {tokens.typography.map(t => (
            <button
              key={t.name}
              className="w-full flex items-center justify-between p-2 rounded-md bg-muted/20 border border-transparent hover:border-border hover:bg-muted/40 transition-all group text-left"
              onClick={() => copyToken(`font-size: ${t.size}; font-weight: ${t.weight};`, t.name)}
            >
              <div className="flex flex-col">
                <span className="text-foreground group-hover:text-primary transition-colors truncate" 
                      style={{ fontSize: Math.min(parseInt(t.size), 20) + 'px', fontWeight: t.weight }}>
                  Aa {t.name}
                </span>
                <span className="text-[9px] text-muted-foreground/60">{t.weight} • {t.size}</span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 text-[9px] font-mono bg-background px-1.5 py-0.5 rounded border border-border">
                Copy
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Spacing & Radius Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Spacing */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Spacing</h4>
          <div className="space-y-1.5">
            {tokens.spacing.map(s => (
              <button 
                key={s.name}
                className="w-full flex items-center gap-2 group"
                onClick={() => copyToken(s.value, `spacing-${s.name}`)}
              >
                <div className="w-8 flex justify-end text-[9px] font-mono text-muted-foreground group-hover:text-foreground">{s.value}</div>
                <div className="flex-1 h-3 bg-muted/30 rounded overflow-hidden relative">
                  <div className="absolute inset-y-0 left-0 bg-primary/40 group-hover:bg-primary transition-colors" style={{ width: Math.min(parseInt(s.value) * 4, 100) + '%' }} />
                </div>
                <div className="w-8 text-[9px] text-muted-foreground group-hover:text-primary">{s.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Radius */}
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Radius</h4>
          <div className="flex flex-wrap content-start gap-2">
            {tokens.radius.map(r => (
              <button 
                key={r.name}
                className="flex flex-col items-center gap-1 group"
                onClick={() => copyToken(r.value, `radius-${r.name}`)}
              >
                <div 
                  className="w-8 h-8 border-2 border-primary/30 group-hover:border-primary transition-colors bg-muted/20"
                  style={{ borderRadius: r.value === '9999px' ? '50%' : r.value }}
                />
                <span className="text-[9px] font-mono text-muted-foreground group-hover:text-primary">{r.value}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
