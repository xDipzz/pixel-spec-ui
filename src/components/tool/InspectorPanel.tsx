import { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Box, Type, Palette, FileText, Layout, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToolStore } from '@/lib/tool-store';
import { mockElements } from '@/lib/mock-elements';
import { getExportContent } from '@/lib/export-generators';
import { ElementType } from '@/lib/types';
import { toast } from 'sonner';
import { VisualBoxModel } from './VisualBoxModel';

const typeColors: Record<ElementType, string> = {
  container: 'bg-[hsl(var(--el-container))]/20 text-[hsl(var(--el-container))]',
  text: 'bg-[hsl(var(--el-text))]/20 text-[hsl(var(--el-text))]',
  button: 'bg-[hsl(var(--el-button))]/20 text-[hsl(var(--el-button))]',
  input: 'bg-[hsl(var(--el-input))]/20 text-[hsl(var(--el-input))]',
  image: 'bg-[hsl(var(--el-image))]/20 text-[hsl(var(--el-image))]',
  card: 'bg-[hsl(var(--el-card))]/20 text-[hsl(var(--el-card))]',
  icon: 'bg-[hsl(var(--el-icon))]/20 text-[hsl(var(--el-icon))]',
  nav: 'bg-[hsl(var(--el-nav))]/20 text-[hsl(var(--el-nav))]',
};

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const Section = ({ title, icon, defaultOpen = true, children }: SectionProps) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="inspector-section">
      <button className="inspector-section-header w-full group" onClick={() => setOpen(!open)}>
        <span className="flex items-center gap-1.5 transition-colors group-hover:text-primary">
          {icon}
          {title}
        </span>
        {open ? <ChevronDown className="w-3 h-3 transition-transform group-hover:text-primary" /> : <ChevronRight className="w-3 h-3 transition-transform group-hover:text-primary" />}
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
};

export const InspectorPanel = () => {
  const { selectedElementId, status, elements } = useToolStore();
  const isReady = status === 'done';
  
  // Use elements from store (real) or fallback to mock
  const element = elements.find(el => el.id === selectedElementId) || mockElements.find(el => el.id === selectedElementId);

  const copyExport = (type: 'json' | 'tailwind' | 'css') => {
    if (!element) return;
    navigator.clipboard.writeText(getExportContent(element, type));
    toast.success(`${type.toUpperCase()} copied!`);
  };

  if (!isReady || !element) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center px-4 space-y-3">
        <div className="w-10 h-10 rounded-xl bg-muted/20 flex items-center justify-center border border-border/50 shadow-inner">
          <Box className="w-5 h-5 opacity-20" />
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-foreground">Nothing Selected</p>
          <p className="text-[10px] opacity-60 px-4">{isReady ? 'Click an element on the canvas to see its deep properties.' : 'Run analysis to start inspecting UI elements.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto scrollbar-thin pb-4">
      {/* Header */}
      <div className="px-3 py-3 border-b border-border bg-muted/10 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
             <span className={`el-badge ${typeColors[element.type]} shadow-sm`}>{element.type}</span>
             <h3 className="font-bold text-[12px] truncate leading-tight text-foreground">{element.name}</h3>
          </div>
          <button className="text-muted-foreground hover:text-primary transition-colors">
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
        <p className="text-[9px] font-mono text-muted-foreground/50 mb-3 px-0.5">ID: {element.id}</p>
        
        <div className="grid grid-cols-3 gap-1.5">
          <Button variant="outline" size="sm" className="h-6 text-[9px] bg-card hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all gap-1" onClick={() => copyExport('json')}>
            <Copy className="w-2.5 h-2.5" /> JSON
          </Button>
          <Button variant="outline" size="sm" className="h-6 text-[9px] bg-card hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all gap-1" onClick={() => copyExport('tailwind')}>
            <Copy className="w-2.5 h-2.5" /> TW
          </Button>
          <Button variant="outline" size="sm" className="h-6 text-[9px] bg-card hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all gap-1" onClick={() => copyExport('css')}>
            <Copy className="w-2.5 h-2.5" /> CSS
          </Button>
        </div>
      </div>

      {/* Box Model Visual */}
      <Section title="Box Model" icon={<Box className="w-3 h-3 text-primary" />}>
        <VisualBoxModel styles={element.styles} bounds={element.bounds} />
        
        <div className="px-3 grid grid-cols-2 gap-2 mt-2">
           <div className="p-1.5 rounded bg-muted/30 border border-border/50 flex flex-col gap-0.5">
              <span className="text-[8px] uppercase tracking-tighter text-muted-foreground">Coordinates</span>
              <span className="text-[10px] font-mono">X: {Math.round(element.bounds.x)}% Y: {Math.round(element.bounds.y)}%</span>
           </div>
           <div className="p-1.5 rounded bg-muted/30 border border-border/50 flex flex-col gap-0.5">
              <span className="text-[8px] uppercase tracking-tighter text-muted-foreground">Dimensions</span>
              <span className="text-[10px] font-mono">{Math.round(element.bounds.width)}px × {Math.round(element.bounds.height)}px</span>
           </div>
        </div>
      </Section>

      {/* Layout Properties */}
      {(element.styles.display || element.styles.flexDirection || element.styles.gap) && (
        <Section title="Layout" icon={<Layout className="w-3 h-3 text-primary" />}>
           <div className="px-3 space-y-1">
             {element.styles.display && (
               <div className="inspector-row">
                 <span className="inspector-label">Display</span>
                 <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[9px] font-mono border border-primary/20">{element.styles.display}</span>
               </div>
             )}
             {element.styles.flexDirection && (
               <div className="inspector-row">
                 <span className="inspector-label">Direction</span>
                 <span className="px-1.5 py-0.5 rounded bg-muted/50 text-foreground text-[9px] font-mono border border-border">{element.styles.flexDirection}</span>
               </div>
             )}
             {element.styles.justifyContent && (
               <div className="inspector-row">
                 <span className="inspector-label">Justify</span>
                 <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[80px]">{element.styles.justifyContent}</span>
               </div>
             )}
             {element.styles.gap && (
               <div className="inspector-row">
                 <span className="inspector-label">Gap</span>
                 <span className="text-foreground font-mono">{element.styles.gap}px</span>
               </div>
             )}
           </div>
        </Section>
      )}

      {/* Typography */}
      {(element.styles.fontSize || element.styles.fontWeight || element.styles.color) && (
        <Section title="Typography" icon={<Type className="w-3 h-3 text-primary" />}>
          <div className="px-3 space-y-1.5">
            <div className="flex flex-wrap gap-1 mb-2">
              {element.styles.fontSize && <span className="px-1.5 py-0.5 rounded bg-muted/50 text-foreground text-[9px] font-mono border border-border">{element.styles.fontSize}</span>}
              {element.styles.fontWeight && <span className="px-1.5 py-0.5 rounded bg-muted/50 text-foreground text-[9px] font-mono border border-border">w:{element.styles.fontWeight}</span>}
              {element.styles.lineHeight && <span className="px-1.5 py-0.5 rounded bg-muted/50 text-foreground text-[9px] font-mono border border-border">lh:{element.styles.lineHeight}</span>}
            </div>
            
            {element.styles.color && (
              <button 
                className="w-full flex items-center justify-between p-1.5 rounded bg-muted/30 border border-border/50 hover:border-primary/50 transition-all group"
                onClick={() => {
                  navigator.clipboard.writeText(element.styles.color!);
                  toast.success("Color copied!");
                }}
              >
                <span className="inspector-label">Text Color</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full border border-border shadow-sm" style={{ background: element.styles.color }} />
                  <span className="text-[10px] font-mono text-foreground group-hover:text-primary transition-colors uppercase">{element.styles.color}</span>
                </span>
              </button>
            )}
            
            {element.content && (
              <div className="mt-2 p-2 rounded bg-muted/20 border border-dashed border-border text-[10px] font-serif leading-relaxed italic text-muted-foreground/80">
                "{element.content}"
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Visual */}
      <Section title="Visual" icon={<Palette className="w-3 h-3 text-primary" />} defaultOpen={false}>
        <div className="px-3 space-y-2">
          {element.styles.background && (
            <button 
              className="w-full flex items-center justify-between p-1.5 rounded bg-muted/30 border border-border/50 hover:border-primary/50 transition-all group"
              onClick={() => {
                navigator.clipboard.writeText(element.styles.background!);
                toast.success("Background copied!");
              }}
            >
              <span className="inspector-label">Background</span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded border border-border shadow-sm" style={{ background: element.styles.background }} />
                <span className="text-[10px] font-mono text-foreground group-hover:text-primary transition-colors uppercase truncate max-w-[60px]">{element.styles.background}</span>
              </span>
            </button>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            {element.styles.borderRadius && (
               <div className="p-1.5 rounded bg-muted/30 border border-border/50 flex flex-col gap-0.5">
                  <span className="text-[8px] uppercase tracking-tighter text-muted-foreground">Radius</span>
                  <span className="text-[10px] font-mono">{element.styles.borderRadius}</span>
               </div>
            )}
            {element.styles.border && (
               <div className="p-1.5 rounded bg-muted/30 border border-border/50 flex flex-col gap-0.5 overflow-hidden">
                  <span className="text-[8px] uppercase tracking-tighter text-muted-foreground">Border</span>
                  <span className="text-[10px] font-mono truncate">{element.styles.border}</span>
               </div>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
};
