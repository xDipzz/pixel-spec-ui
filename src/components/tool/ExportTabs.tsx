import { useState } from 'react';
import { Copy, Download, Check, WrapText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToolStore } from '@/lib/tool-store';
import { mockElements } from '@/lib/mock-elements';
import { getExportContent } from '@/lib/export-generators';
import { ExportTab } from '@/lib/types';
import { toast } from 'sonner';

export const ExportTabs = () => {
  const { selectedElementId, exportTab, setExportTab, wrapLines, setWrapLines, status } = useToolStore();
  const [copied, setCopied] = useState(false);
  
  const isReady = status === 'done';
  const element = mockElements.find(el => el.id === selectedElementId);

  const handleCopy = () => {
    if (!element) return;
    navigator.clipboard.writeText(getExportContent(element, exportTab));
    setCopied(true);
    toast.success('Copied!');
    setTimeout(() => setCopied(false), 1500);
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
    toast.success('Downloaded!');
  };

  if (!isReady || !element) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-[10px]">
        Select element to export
      </div>
    );
  }

  const content = getExportContent(element, exportTab);
  const lines = content.split('\n');

  return (
    <Tabs value={exportTab} onValueChange={(v) => setExportTab(v as ExportTab)} className="flex flex-col h-full">
      <div className="flex items-center border-b border-border bg-muted/20">
        <TabsList className="h-6 bg-transparent p-0 gap-0">
          {(['spec', 'json', 'tailwind', 'css'] as ExportTab[]).map(tab => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="h-6 px-2 text-[9px] uppercase tracking-wider rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex-1" />
        <Button
          variant={wrapLines ? 'secondary' : 'ghost'}
          size="sm"
          className="compact-icon-btn mr-0.5"
          onClick={() => setWrapLines(!wrapLines)}
        >
          <WrapText className="w-3 h-3" />
        </Button>
      </div>

      {(['spec', 'json', 'tailwind', 'css'] as ExportTab[]).map(tab => (
        <TabsContent key={tab} value={tab} className="flex-1 flex flex-col m-0 overflow-hidden">
          <div className={`code-block flex-1 overflow-auto p-0 ${wrapLines ? 'whitespace-pre-wrap' : 'whitespace-pre'}`}>
            <table className="w-full">
              <tbody>
                {lines.map((line, i) => (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="w-6 text-right pr-2 text-muted-foreground/50 select-none text-[9px] align-top">{i + 1}</td>
                    <td className="text-[10px]">{line || ' '}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-1 p-1 border-t border-border bg-muted/20">
            <Button variant="ghost" size="sm" className="compact-btn flex-1" onClick={handleCopy}>
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              Copy
            </Button>
            <Button variant="ghost" size="sm" className="compact-btn flex-1" onClick={handleDownload}>
              <Download className="w-3 h-3" />
              Download
            </Button>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
