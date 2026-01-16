import { ElementStyles, ElementBounds } from '@/lib/types';

interface VisualBoxModelProps {
  styles: ElementStyles;
  bounds: ElementBounds;
}

export const VisualBoxModel = ({ styles, bounds }: VisualBoxModelProps) => {
  const margin = styles.margin || { top: 0, right: 0, bottom: 0, left: 0 };
  const padding = styles.padding || { top: 0, right: 0, bottom: 0, left: 0 };

  return (
    <div className="flex flex-col items-center justify-center py-2 select-none font-mono text-[9px]">
      {/* Margin Box (Outer) */}
      <div className="relative bg-[#f9cc9d]/10 border border-[#f9cc9d]/40 rounded p-4 group/margin transition-colors hover:bg-[#f9cc9d]/20">
        <span className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[#f9cc9d] opacity-0 group-hover/margin:opacity-100 transition-opacity">margin</span>
        
        {/* Margin Values */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[#f9cc9d]">{margin.top}</div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[#f9cc9d]">{margin.bottom}</div>
        <div className="absolute top-1/2 left-1 -translate-y-1/2 text-[#f9cc9d]">{margin.left}</div>
        <div className="absolute top-1/2 right-1 -translate-y-1/2 text-[#f9cc9d]">{margin.right}</div>

        {/* Border Box */}
        <div className="relative bg-[#fceea7]/10 border border-[#fceea7]/40 rounded p-4 group/border transition-colors hover:bg-[#fceea7]/20">
           <span className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[#fceea7] opacity-0 group-hover/border:opacity-100 transition-opacity">border</span>

          {/* Padding Box */}
          <div className="relative bg-[#c3e88d]/10 border border-[#c3e88d]/40 rounded p-4 group/padding transition-colors hover:bg-[#c3e88d]/20">
            <span className="absolute top-0.5 left-1/2 -translate-x-1/2 text-[#c3e88d] opacity-0 group-hover/padding:opacity-100 transition-opacity">padding</span>

            {/* Padding Values */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[#c3e88d]">{padding.top}</div>
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[#c3e88d]">{padding.bottom}</div>
            <div className="absolute top-1/2 left-1 -translate-y-1/2 text-[#c3e88d]">{padding.left}</div>
            <div className="absolute top-1/2 right-1 -translate-y-1/2 text-[#c3e88d]">{padding.right}</div>

            {/* Content Box */}
            <div className="bg-[#82aaff]/20 border border-[#82aaff]/50 rounded min-w-[60px] h-6 flex items-center justify-center px-2 text-[#82aaff] group/content transition-colors hover:bg-[#82aaff]/30">
              {Math.round(bounds.width)} × {Math.round(bounds.height)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
