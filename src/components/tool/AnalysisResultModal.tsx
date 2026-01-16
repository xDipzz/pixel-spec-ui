import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToolStore } from '@/lib/tool-store';
import { ExportTabs } from './ExportTabs';
import { Terminal, X, Sparkles } from 'lucide-react';

export const AnalysisResultModal = () => {
  const { resultModalOpen, setResultModalOpen, elements } = useToolStore();

  return (
    <Dialog open={resultModalOpen} onOpenChange={setResultModalOpen}>
      <DialogContent className="max-w-5xl h-[85vh] bg-black/90 border-primary/20 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)] p-0 gap-0 overflow-hidden outline-none">
        <div className="flex flex-col h-full">
          {/* Custom Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.2)]">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-white uppercase">Analysis Complete</h2>
                <p className="text-[10px] text-primary font-mono uppercase tracking-widest opacity-70">
                  Deep Specification Generated • {elements.length} elements detected
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setResultModalOpen(false)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10 group"
            >
              <X className="w-4 h-4 text-white group-hover:text-primary transition-colors" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-hidden flex flex-col bg-[#050505]">
            <ExportTabs />
          </div>

          {/* Footer Info */}
          <div className="px-6 py-3 border-t border-white/10 bg-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono">
              <Terminal className="w-3 h-3" />
              <span>POWERED BY GROQ & GLM-4V VISION ENGINE</span>
            </div>
            <div className="text-[10px] text-white/20 uppercase tracking-widest">
              PixelSpec AI Inspection System v1.0
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
