import { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, Box, Type, Palette, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToolStore } from '@/lib/tool-store';
import { mockElements } from '@/lib/mock-elements';
import { getExportContent } from '@/lib/export-generators';
import { ElementType } from '@/lib/types';
import { toast } from 'sonner';

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
      <button className="inspector-section-header w-full" onClick={() => setOpen(!open)}>
        <span className="flex items-center gap-1.5">
          {icon}
          {title}
        </span>
        {open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>
      {open && <div className="pb-1.5">{children}</div>}
    </div>
  );
};

export const InspectorPanel = () => {
  const { selectedElementId, status } = useToolStore();
  const isReady = status === 'done';
  const element = mockElements.find(el => el.id === selectedElementId);

  const copyExport = (type: 'json' | 'tailwind' | 'css') => {
    if (!element) return;
    navigator.clipboard.writeText(getExportContent(element, type));
    toast.success(`${type.toUpperCase()} copied!`);
  };

  if (!isReady || !element) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center px-4">
        <Box className="w-6 h-6 mb-2 opacity-20" />
        <p className="text-[10px]">{isReady ? 'Click element to inspect' : 'Analyze to inspect'}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto scrollbar-thin">
      {/* Header */}
      <div className="px-2 py-1.5 border-b border-border bg-muted/30">
        <div className="flex items-center gap-1.5 mb-1">
          <span className={`el-badge ${typeColors[element.type]}`}>{element.type}</span>
          <span className="font-medium text-[11px] truncate">{element.name}</span>
        </div>
        <p className="text-[9px] font-mono text-muted-foreground">#{element.id}</p>
        <div className="flex gap-1 mt-1.5">
          <Button variant="ghost" size="sm" className="compact-btn flex-1" onClick={() => copyExport('json')}>
            <Copy className="w-2.5 h-2.5" /> JSON
          </Button>
          <Button variant="ghost" size="sm" className="compact-btn flex-1" onClick={() => copyExport('tailwind')}>
            <Copy className="w-2.5 h-2.5" /> TW
          </Button>
          <Button variant="ghost" size="sm" className="compact-btn flex-1" onClick={() => copyExport('css')}>
            <Copy className="w-2.5 h-2.5" /> CSS
          </Button>
        </div>
      </div>

      {/* Box Model */}
      <Section title="Box Model" icon={<Box className="w-3 h-3 text-primary" />}>
        <div className="px-2 grid grid-cols-2 gap-x-3 gap-y-0">
          <div className="inspector-row"><span className="inspector-label">x</span><span className="inspector-value">{element.bounds.x}%</span></div>
          <div className="inspector-row"><span className="inspector-label">y</span><span className="inspector-value">{element.bounds.y}%</span></div>
          <div className="inspector-row"><span className="inspector-label">w</span><span className="inspector-value">{element.bounds.width}%</span></div>
          <div className="inspector-row"><span className="inspector-label">h</span><span className="inspector-value">{element.bounds.height}%</span></div>
        </div>
        {element.styles.padding && (
          <div className="px-2 mt-1 pt-1 border-t border-border/30">
            <div className="inspector-row">
              <span className="inspector-label">padding</span>
              <span className="inspector-value">{element.styles.padding.top} {element.styles.padding.right} {element.styles.padding.bottom} {element.styles.padding.left}</span>
            </div>
          </div>
        )}
        {element.styles.gap && (
          <div className="px-2">
            <div className="inspector-row"><span className="inspector-label">gap</span><span className="inspector-value">{element.styles.gap}px</span></div>
          </div>
        )}
        {/* Mini box model visualization */}
        <div className="px-2 mt-2 flex justify-center">
          <div className="relative w-20 h-14 border border-dashed border-muted-foreground/30 rounded flex items-center justify-center text-[8px] text-muted-foreground">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px]">{element.styles.margin?.top || 0}</div>
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-[8px]">{element.styles.margin?.bottom || 0}</div>
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 text-[8px]">{element.styles.margin?.left || 0}</div>
            <div className="absolute top-1/2 -right-3 -translate-y-1/2 text-[8px]">{element.styles.margin?.right || 0}</div>
            <div className="w-12 h-8 bg-primary/10 border border-primary/30 rounded flex items-center justify-center">
              <span className="text-[7px] font-mono text-primary">{element.bounds.width}×{element.bounds.height}</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Typography */}
      {(element.styles.fontSize || element.styles.fontWeight || element.styles.color) && (
        <Section title="Typography" icon={<Type className="w-3 h-3 text-primary" />}>
          <div className="px-2 space-y-0">
            {element.styles.fontSize && <div className="inspector-row"><span className="inspector-label">size</span><span className="inspector-value">{element.styles.fontSize}</span></div>}
            {element.styles.fontWeight && <div className="inspector-row"><span className="inspector-label">weight</span><span className="inspector-value">{element.styles.fontWeight}</span></div>}
            {element.styles.lineHeight && <div className="inspector-row"><span className="inspector-label">line-h</span><span className="inspector-value">{element.styles.lineHeight}</span></div>}
            {element.styles.letterSpacing && <div className="inspector-row"><span className="inspector-label">spacing</span><span className="inspector-value">{element.styles.letterSpacing}</span></div>}
            {element.styles.color && (
              <div className="inspector-row">
                <span className="inspector-label">color</span>
                <span className="inspector-value flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded border border-border" style={{ background: element.styles.color }} />
                  {element.styles.color}
                </span>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Visual */}
      <Section title="Visual" icon={<Palette className="w-3 h-3 text-primary" />} defaultOpen={false}>
        <div className="px-2 space-y-0">
          {element.styles.background && (
            <div className="inspector-row">
              <span className="inspector-label">bg</span>
              <span className="inspector-value flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded border border-border" style={{ background: element.styles.background }} />
                <span className="truncate max-w-[70px]">{element.styles.background}</span>
              </span>
            </div>
          )}
          {element.styles.border && <div className="inspector-row"><span className="inspector-label">border</span><span className="inspector-value truncate max-w-[90px]">{element.styles.border}</span></div>}
          {element.styles.borderRadius && <div className="inspector-row"><span className="inspector-label">radius</span><span className="inspector-value">{element.styles.borderRadius}</span></div>}
          {element.styles.boxShadow && <div className="inspector-row"><span className="inspector-label">shadow</span><span className="inspector-value">yes</span></div>}
          {element.styles.alignment && <div className="inspector-row"><span className="inspector-label">align</span><span className="inspector-value">{element.styles.alignment}</span></div>}
        </div>
      </Section>

      {/* Content */}
      {element.content && (
        <Section title="Content" icon={<FileText className="w-3 h-3 text-primary" />} defaultOpen={false}>
          <div className="px-2">
            <div className="bg-muted/40 rounded px-1.5 py-1 text-[10px] font-mono break-words">"{element.content}"</div>
          </div>
        </Section>
      )}
    </div>
  );
};
