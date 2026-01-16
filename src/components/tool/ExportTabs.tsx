import { useState } from 'react';
import { Copy, Download, Check, WrapText, Maximize2, Minimize2, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToolStore } from '@/lib/tool-store';
import { mockElements } from '@/lib/mock-elements';
import { getExportContent } from '@/lib/export-generators';
import { ExportTab } from '@/lib/types';
import { toast } from 'sonner';

export const ExportTabs = () => {
  const { selectedElementId, exportTab, setExportTab, wrapLines, setWrapLines, status, elements } = useToolStore();
  const [copied, setCopied] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  
  const isReady = status === 'done';
  const element = elements.find(el => el.id === selectedElementId) || mockElements.find(el => el.id === selectedElementId);

  const handleCopy = () => {
    if (!element) return;
    navigator.clipboard.writeText(getExportContent(element, exportTab));
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!element) return;
    const content = getExportContent(element, exportTab);
    const ext = exportTab === 'tailwind' ? 'tsx' : exportTab === 'json' ? 'json' : exportTab === 'css' ? 'css' : 'txt';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${element.id}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${element.id}.${ext}`);
  };

  if (!isReady || !element) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-6 space-y-2 opacity-40">
        <Terminal className="w-5 h-5 mb-1" />
        <p className="text-[10px]">Select an element to view code</p>
      </div>
    );
  }

  const content = getExportContent(element, exportTab);
  const lines = content.split('\n');

  // Simple syntax highlighting logic
  const highlight = (line: string) => {
    if (!line.trim()) return <span>&nbsp;</span>;
    
    // JSON
    if (exportTab === 'json') {
      return line.split(/(".*?"|[:{},[\]])/).map((part, i) => {
        if (part.startsWith('"')) return <span key={i} className="text-[hsl(var(--neon-cyan))] font-medium">{part}</span>;
        if ([':', '{', '}', '[', ']', ','].includes(part)) return <span key={i} className="text-white/40">{part}</span>;
        return <span key={i} className="text-white">{part}</span>;
      });
    }

    // CSS / Spec / Prompt
    if (exportTab === 'css' || exportTab === 'spec') {
      if (line.includes(':')) {
        const [key, ...rest] = line.split(':');
        return (
          <>
            <span className="text-primary font-bold">{key}</span>
            <span className="text-white/30 mx-1">:</span>
            <span className="text-[hsl(var(--neon-yellow))] font-medium">{rest.join(':')}</span>
          </>
        );
      }
      if (line.startsWith('#') || line.startsWith('.')) return <span className="text-primary font-black text-xs">{line}</span>;
      if (line.startsWith('UI SPECIFICATION') || line.startsWith('==')) return <span className="text-[hsl(var(--neon-pink))] font-black tracking-widest uppercase">{line}</span>;
    }

    return <span className="text-white/90">{line}</span>;
  };

  return (
    <div className={`flex flex-col h-full bg-[#050505] transition-all duration-300 ${isMaximized ? 'fixed inset-4 z-[60] rounded-xl shadow-2xl border-2 border-primary/40' : ''}`}>
      <Tabs value={exportTab} onValueChange={(v) => setExportTab(v as ExportTab)} className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-2 py-1">
          <TabsList className="h-8 bg-transparent p-0 gap-1">
            {(['spec', 'json', 'tailwind', 'css'] as ExportTab[]).map(tab => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="h-7 px-3 text-[10px] font-bold uppercase tracking-widest rounded-md border border-transparent data-[state=active]:bg-primary data-[state=active]:text-black transition-all"
              >
                {tab === 'spec' ? 'prompt' : tab}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="flex items-center gap-1">
            <Button
              variant={wrapLines ? 'secondary' : 'ghost'}
              size="sm"
              className="h-7 w-7 p-0 hover:bg-primary/20 hover:text-primary transition-colors"
              onClick={() => setWrapLines(!wrapLines)}
            >
              <WrapText className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 hover:bg-primary/20 hover:text-primary transition-colors"
              onClick={() => setIsMaximized(!isMaximized)}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative group bg-black">
          <div className={`absolute inset-0 overflow-auto scrollbar-thin p-4 font-mono leading-relaxed selection:bg-primary selection:text-black ${wrapLines ? 'whitespace-pre-wrap' : 'whitespace-pre'}`}>
             <table className="w-full border-collapse">
              <tbody>
                {lines.map((line, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors leading-normal">
                    <td className="w-10 text-right pr-4 text-white/20 select-none text-[10px] border-r border-white/5 pt-1 align-top font-mono">{i + 1}</td>
                    <td className="pl-4 text-[11px] py-1 tracking-tight">{highlight(line)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="absolute bottom-4 right-6 flex gap-2">
            <Button size="sm" className="h-9 px-4 text-[11px] font-bold bg-primary hover:bg-primary/90 text-black shadow-[0_0_20px_rgba(var(--primary),0.3)] gap-2 uppercase tracking-wider" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Prompt'}
            </Button>
          </div>
        </div>
      </Tabs>
    </div>
  );
};
