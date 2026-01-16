import { useCallback, useEffect, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff, Grid3X3, MessageSquare, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToolStore } from '@/lib/tool-store';

export const CanvasPanel = () => {
  const {
    uploadedImage, status, selectedElementId, setSelectedElementId,
    hoveredElementId, setHoveredElementId,
    overlaysEnabled, toggleOverlays, gridEnabled, toggleGrid,
    tooltipEnabled, toggleTooltip, zoom, zoomIn, zoomOut, resetZoom,
    setUploadedImage, setMousePosition, elements
  } = useToolStore();

  const [isDragging, setIsDragging] = useState(false);

  const isReady = status === 'done';
  const selectedEl = elements.find(e => e.id === selectedElementId);
  const hoveredEl = elements.find(e => e.id === hoveredElementId);

  // Spacing Guide logic
  const renderSpacingGuides = () => {
    if (!selectedEl || !hoveredEl || selectedEl.id === hoveredEl.id) return null;

    const s = selectedEl.bounds;
    const h = hoveredEl.bounds;

    const guides = [];

    // Vertical Distance
    if (h.y > s.y + s.height) { // Hovered is below selected
      guides.push(
        <div key="v-dist" className="absolute border-l border-dashed border-primary/60 z-30 pointer-events-none" 
             style={{ left: `${s.x + s.width/2}%`, top: `${s.y + s.height}%`, height: `${h.y - (s.y + s.height)}%` }}>
          <span className="absolute top-1/2 left-1 -translate-y-1/2 bg-primary text-black text-[8px] px-1 rounded font-bold font-mono shadow-[0_0_10px_rgba(var(--primary),0.5)]">
            {Math.round(h.y - (s.y + s.height))}
          </span>
        </div>
      );
    } else if (s.y > h.y + h.height) { // Hovered is above selected
      guides.push(
        <div key="v-dist-top" className="absolute border-l border-dashed border-primary/60 z-30 pointer-events-none" 
             style={{ left: `${s.x + s.width/2}%`, top: `${h.y + h.height}%`, height: `${s.y - (h.y + h.height)}%` }}>
          <span className="absolute top-1/2 left-1 -translate-y-1/2 bg-primary text-black text-[8px] px-1 rounded font-bold font-mono shadow-[0_0_10px_rgba(var(--primary),0.5)]">
            {Math.round(s.y - (h.y + h.height))}
          </span>
        </div>
      );
    }

    // Horizontal Distance
    if (h.x > s.x + s.width) { // Hovered is right of selected
      guides.push(
        <div key="h-dist" className="absolute border-t border-dashed border-primary/60 z-30 pointer-events-none" 
             style={{ top: `${s.y + s.height/2}%`, left: `${s.x + s.width}%`, width: `${h.x - (s.x + s.width)}%` }}>
          <span className="absolute left-1/2 top-1 -translate-x-1/2 bg-primary text-black text-[8px] px-1 rounded font-bold font-mono shadow-[0_0_10px_rgba(var(--primary),0.5)]">
            {Math.round(h.x - (s.x + s.width))}
          </span>
        </div>
      );
    } else if (s.x > h.x + h.width) { // Hovered is left of selected
      guides.push(
        <div key="h-dist-left" className="absolute border-t border-dashed border-primary/60 z-30 pointer-events-none" 
             style={{ top: `${s.y + s.height/2}%`, left: `${h.x + h.width}%`, width: `${s.x - (h.x + h.width)}%` }}>
          <span className="absolute left-1/2 top-1 -translate-x-1/2 bg-primary text-black text-[8px] px-1 rounded font-bold font-mono shadow-[0_0_10px_rgba(var(--primary),0.5)]">
            {Math.round(s.x - (h.x + h.width))}
          </span>
        </div>
      );
    }

    return guides;
  };

  const handleFile = useCallback((file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target?.result as string, file.name);
      reader.readAsDataURL(file);
    }
  }, [setUploadedImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleClick = useCallback(() => {
    if (uploadedImage) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFile(file);
    };
    input.click();
  }, [handleFile, uploadedImage]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) handleFile(file);
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFile]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setMousePosition(x, y);
  }, [setMousePosition]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Toolbar */}
      <div className="panel-header justify-start gap-0.5 bg-card border-b border-border">
        <Button variant="ghost" size="sm" className="compact-icon-btn" onClick={zoomOut}><ZoomOut className="w-3 h-3" /></Button>
        <span className="text-[9px] font-mono w-8 text-center text-muted-foreground">{zoom}%</span>
        <Button variant="ghost" size="sm" className="compact-icon-btn" onClick={zoomIn}><ZoomIn className="w-3 h-3" /></Button>
        <Button variant="ghost" size="sm" className="compact-icon-btn" onClick={resetZoom}><RotateCcw className="w-3 h-3" /></Button>
        
        <div className="toolbar-separator" />
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={overlaysEnabled ? 'secondary' : 'ghost'} size="sm" className="compact-icon-btn" onClick={toggleOverlays}>
              {overlaysEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-[10px]">Overlays (O)</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={gridEnabled ? 'secondary' : 'ghost'} size="sm" className="compact-icon-btn" onClick={toggleGrid}>
              <Grid3X3 className="w-3 h-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-[10px]">Grid (G)</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={tooltipEnabled ? 'secondary' : 'ghost'} size="sm" className="compact-icon-btn" onClick={toggleTooltip}>
              <MessageSquare className="w-3 h-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-[10px]">Tooltips (T)</TooltipContent>
        </Tooltip>
      </div>

      {/* Canvas */}
      <div
        className={`flex-1 overflow-auto p-3 scrollbar-thin relative ${isDragging ? 'bg-primary/5' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
      >
        {/* Grid overlay */}
        {gridEnabled && uploadedImage && (
          <div
            className="absolute inset-3 pointer-events-none opacity-30 z-10"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--neon) / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--neon) / 0.4) 1px, transparent 1px)`,
              backgroundSize: '16px 16px',
            }}
          />
        )}

        {!uploadedImage ? (
          <div className="h-full flex items-center justify-center p-12">
            <div className={`w-full max-w-[280px] aspect-[4/3] flex flex-col items-center justify-center border border-dashed rounded-xl transition-all cursor-pointer ${isDragging ? 'border-primary bg-primary/10 scale-105' : 'border-border hover:border-primary/40 hover:bg-muted/5'}`}>
              <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                <Upload className={`w-5 h-5 ${isDragging ? 'text-primary' : 'text-muted-foreground/50'}`} />
              </div>
              <p className="text-[11px] font-bold tracking-tight mb-1">{isDragging ? 'Drop to start' : 'Click or Drop Image'}</p>
              <p className="text-[9px] text-muted-foreground/60 font-mono"><kbd className="kbd px-1.5 py-0.5">Ctrl+V</kbd> to paste</p>
            </div>
          </div>
        ) : (
          <div
            className="relative mx-auto"
            style={{ width: `${zoom}%`, maxWidth: '100%' }}
            onClick={(e) => { e.stopPropagation(); setSelectedElementId(null); }}
          >
            <img src={uploadedImage} alt="Screenshot" className="w-full h-auto rounded border border-border" draggable={false} />

            {/* Bounding boxes */}
            {isReady && overlaysEnabled && (
              <div className="absolute inset-0">
                {renderSpacingGuides()}
                {elements.filter(el => el.id !== 'app_shell').map(el => {
                  const isSelected = selectedElementId === el.id;
                  const isHovered = hoveredElementId === el.id;
                  
                  return (
                    <Tooltip key={el.id} open={tooltipEnabled && isHovered && !isSelected}>
                      <TooltipTrigger asChild>
                        <div
                          className={`bounding-box ${isSelected ? 'selected' : ''}`}
                          style={{
                            left: `${el.bounds.x}%`,
                            top: `${el.bounds.y}%`,
                            width: `${el.bounds.width}%`,
                            height: `${el.bounds.height}%`,
                            opacity: isHovered || isSelected ? 1 : 0.35,
                          }}
                          onClick={(e) => { e.stopPropagation(); setSelectedElementId(el.id); }}
                          onMouseEnter={() => setHoveredElementId(el.id)}
                          onMouseLeave={() => setHoveredElementId(null)}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="font-mono text-[9px] px-1.5 py-0.5 bg-popover/95 backdrop-blur">
                        <span className="text-primary">{el.name}</span>
                        <span className="text-muted-foreground mx-1">•</span>
                        <span className="text-muted-foreground">{Math.round(el.bounds.width)}×{Math.round(el.bounds.height)}</span>
                        <span className="text-muted-foreground mx-1">•</span>
                        <span className="text-muted-foreground/70">#{el.id}</span>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            )}

            {/* Minimap */}
            {isReady && (
              <div className="absolute bottom-2 right-2 w-20 h-14 bg-card/90 backdrop-blur border border-border rounded overflow-hidden">
                <img src={uploadedImage} alt="Minimap" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 border-2 border-primary/40 rounded" style={{ transform: `scale(${100/zoom})`, transformOrigin: 'center' }} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};