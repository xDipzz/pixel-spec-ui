import { mockTokens } from '@/lib/mock-elements';
import { useToolStore } from '@/lib/tool-store';

export const TokensPanel = () => {
  const { status } = useToolStore();
  const isReady = status === 'done';

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-[10px]">
        Analyze to see tokens
      </div>
    );
  }

  return (
    <div className="overflow-auto scrollbar-thin p-2 space-y-3">
      {/* Colors */}
      <div>
        <h4 className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Colors</h4>
        <div className="grid grid-cols-2 gap-1">
          {mockTokens.colors.map(c => (
            <div key={c.name} className="flex items-center gap-1.5 px-1 py-0.5 rounded bg-muted/30">
              <span className="w-3 h-3 rounded border border-border flex-shrink-0" style={{ background: c.value }} />
              <span className="text-[9px] font-mono truncate">{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div>
        <h4 className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Typography</h4>
        <div className="space-y-0.5">
          {mockTokens.typography.map(t => (
            <div key={t.name} className="flex items-center justify-between px-1 py-0.5 rounded bg-muted/30 text-[9px]">
              <span className="font-mono">{t.name}</span>
              <span className="text-muted-foreground">{t.size} / {t.weight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div>
        <h4 className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Spacing</h4>
        <div className="flex flex-wrap gap-1">
          {mockTokens.spacing.map(s => (
            <div key={s.name} className="px-1.5 py-0.5 rounded bg-muted/30 text-[9px] font-mono">
              {s.name}: {s.value}
            </div>
          ))}
        </div>
      </div>

      {/* Radius */}
      <div>
        <h4 className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Radius</h4>
        <div className="flex flex-wrap gap-1">
          {mockTokens.radius.map(r => (
            <div key={r.name} className="px-1.5 py-0.5 rounded bg-muted/30 text-[9px] font-mono">
              {r.name}: {r.value}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
