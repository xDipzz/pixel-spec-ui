import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToolStore } from '@/lib/tool-store';
import { InspectorPanel } from './InspectorPanel';
import { ExportTabs } from './ExportTabs';
import { TokensPanel } from './TokensPanel';
import { RightPanelTab } from '@/lib/types';
import { Search, Palette, Code } from 'lucide-react';

export const RightPanel = () => {
  const { rightPanelTab, setRightPanelTab } = useToolStore();

  return (
    <Tabs value={rightPanelTab} onValueChange={(v) => setRightPanelTab(v as RightPanelTab)} className="flex flex-col h-full">
      <TabsList className="h-7 w-full bg-card border-b border-border rounded-none justify-start gap-0 p-0">
        <TabsTrigger value="inspector" className="h-7 px-2 text-[10px] uppercase tracking-wider rounded-none data-[state=active]:bg-muted/50 gap-1">
          <Search className="w-3 h-3" />
          Inspector
        </TabsTrigger>
        <TabsTrigger value="tokens" className="h-7 px-2 text-[10px] uppercase tracking-wider rounded-none data-[state=active]:bg-muted/50 gap-1">
          <Palette className="w-3 h-3" />
          Tokens
        </TabsTrigger>
      </TabsList>

      <TabsContent value="inspector" className="flex-1 flex flex-col m-0 overflow-hidden">
        <div className="flex-[0.55] flex flex-col overflow-hidden">
          <InspectorPanel />
        </div>
        <div className="flex-[0.45] border-t border-white/10 flex flex-col shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <div className="panel-header bg-white/5 border-b border-white/5">
            <span className="flex items-center gap-1.5 text-primary">
              <Code className="w-3.5 h-3.5" />
              Detailed Specification
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <ExportTabs />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="tokens" className="flex-1 m-0 overflow-hidden">
        <TokensPanel />
      </TabsContent>
    </Tabs>
  );
};
