import { useEffect, useState } from 'react';
import { ToolHeader } from '@/components/tool/ToolHeader';
import { LayersPanel } from '@/components/tool/LayersPanel';
import { CanvasPanel } from '@/components/tool/CanvasPanel';
import { RightPanel } from '@/components/tool/RightPanel';
import { StatusBar } from '@/components/tool/StatusBar';
import { DocsModal } from '@/components/tool/DocsModal';
import { ShortcutsModal } from '@/components/tool/ShortcutsModal';
import { SettingsModal } from '@/components/tool/SettingsModal';
import { AnalysisResultModal } from '@/components/tool/AnalysisResultModal';
import { useToolStore } from '@/lib/tool-store';
import { getExportContent } from '@/lib/export-generators';
import { toast } from 'sonner';

const Index = () => {
  const [docsOpen, setDocsOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const {
    selectedElementId, setSelectedElementId,
    toggleOverlays, toggleGrid, toggleTooltip,
    zoomIn, zoomOut, resetZoom, reset,
    uploadedImage, status, setStatus, setUploadedImage, analyzeScreenshot,
    exportTab,
    elements
  } = useToolStore();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if typing in input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      // Escape - deselect
      if (e.key === 'Escape') {
        setSelectedElementId(null);
        return;
      }

      // Single key shortcuts
      if (!e.ctrlKey && !e.metaKey) {
        if (e.key === 'o' || e.key === 'O') { toggleOverlays(); return; }
        if (e.key === 'g' || e.key === 'G') { toggleGrid(); return; }
        if (e.key === 't' || e.key === 'T') { toggleTooltip(); return; }
        if (e.key === 'n' || e.key === 'N') { reset(); return; }
        if (e.key === 'a' || e.key === 'A') {
          if (uploadedImage && status === 'ready') {
            analyzeScreenshot();
          }
          return;
        }
      }

      // Ctrl/Cmd shortcuts
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') { e.preventDefault(); zoomIn(); return; }
        if (e.key === '-') { e.preventDefault(); zoomOut(); return; }
        if (e.key === '0') { e.preventDefault(); resetZoom(); return; }
        if (e.key === 'c' && selectedElementId) {
          const element = elements.find(el => el.id === selectedElementId);
          if (element) {
            navigator.clipboard.writeText(getExportContent(element, exportTab));
            toast.success('Copied!');
          }
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, toggleOverlays, toggleGrid, toggleTooltip, zoomIn, zoomOut, resetZoom, reset, uploadedImage, status, setStatus, exportTab, setSelectedElementId]);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden select-none">
      {/* Scanlines */}
      <div className="fixed inset-0 scanlines pointer-events-none z-50" />

      <ToolHeader
        onOpenDocs={() => setDocsOpen(true)}
        onOpenShortcuts={() => setShortcutsOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Layers */}
        <div className="w-52 border-r border-border flex-shrink-0">
          <LayersPanel />
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 min-w-0">
          <CanvasPanel />
        </div>

        {/* Right: Inspector/Tokens/Exports */}
        <div className="w-56 border-l border-border flex-shrink-0">
          <RightPanel />
        </div>
      </div>

      <StatusBar />

      <DocsModal open={docsOpen} onOpenChange={setDocsOpen} />
      <ShortcutsModal open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
      <AnalysisResultModal />
    </div>
  );
};

export default Index;
