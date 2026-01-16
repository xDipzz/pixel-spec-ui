import { useState } from 'react';
import { ChevronRight, ChevronDown, Search, Layers, ChevronsUpDown, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToolStore } from '@/lib/tool-store';
import { mockElements, getChildElements } from '@/lib/mock-elements';
import { ElementType, LayerFilter } from '@/lib/types';

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

export const LayersPanel = () => {
  const [search, setSearch] = useState('');
  const { 
    status, selectedElementId, setSelectedElementId, 
    expandedLayers, toggleLayerExpanded, allLayersExpanded,
    expandAllLayers, collapseAllLayers, layerFilter, setLayerFilter 
  } = useToolStore();

  const isReady = status === 'done';

  const filteredElements = mockElements.filter(el => {
    const matchesSearch = !search || 
      el.name.toLowerCase().includes(search.toLowerCase()) ||
      el.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = layerFilter === 'all' || el.type === layerFilter;
    return matchesSearch && matchesFilter;
  });

  const renderTree = (parentId: string | null, depth = 0): React.ReactNode => {
    const children = getChildElements(parentId).filter(el => 
      filteredElements.some(f => f.id === el.id)
    );
    
    return children.map(el => {
      const hasChildren = mockElements.some(e => e.parentId === el.id);
      const isExpanded = expandedLayers.has(el.id);
      const isSelected = selectedElementId === el.id;

      return (
        <div key={el.id}>
          <div
            className={`tree-item ${isSelected ? 'selected' : ''}`}
            style={{ paddingLeft: `${depth * 10 + 4}px` }}
            onClick={() => setSelectedElementId(el.id)}
          >
            <button
              className="w-3 h-3 flex items-center justify-center text-muted-foreground hover:text-foreground flex-shrink-0"
              onClick={(e) => { e.stopPropagation(); if (hasChildren) toggleLayerExpanded(el.id); }}
            >
              {hasChildren && (isExpanded ? <ChevronDown className="w-2.5 h-2.5" /> : <ChevronRight className="w-2.5 h-2.5" />)}
            </button>
            <span className={`el-badge ${typeColors[el.type]} flex-shrink-0`}>{el.type.slice(0, 3)}</span>
            <span className="truncate flex-1 text-[11px]">{el.name}</span>
            <span className="text-[9px] text-muted-foreground/60 font-mono flex-shrink-0">{el.bounds.width}×{el.bounds.height}</span>
          </div>
          {hasChildren && isExpanded && renderTree(el.id, depth + 1)}
        </div>
      );
    });
  };

  const count = isReady ? mockElements.length : 0;

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="panel-header">
        <span className="flex items-center gap-1">
          <Layers className="w-3 h-3" />
          Layers
          {isReady && <span className="text-primary ml-1">{count}</span>}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="compact-icon-btn"
          onClick={allLayersExpanded ? collapseAllLayers : expandAllLayers}
          disabled={!isReady}
        >
          <ChevronsUpDown className="w-3 h-3" />
        </Button>
      </div>

      {/* Search + Filter */}
      <div className="p-1.5 border-b border-border space-y-1">
        <div className="relative">
          <Search className="absolute left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-6 h-6 text-[11px] bg-muted/30 border-border/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="absolute right-1.5 top-1/2 -translate-y-1/2" onClick={() => setSearch('')}>
              <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        <Select value={layerFilter} onValueChange={(v) => setLayerFilter(v as LayerFilter)}>
          <SelectTrigger className="h-6 text-[10px] bg-muted/30 border-border/50">
            <Filter className="w-3 h-3 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="container">Containers</SelectItem>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="button">Buttons</SelectItem>
            <SelectItem value="input">Inputs</SelectItem>
            <SelectItem value="card">Cards</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="nav">Nav</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-auto py-0.5 scrollbar-thin">
        {!isReady ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center px-3">
            <Layers className="w-6 h-6 mb-2 opacity-20" />
            <p className="text-[10px]">Upload & analyze to see layers</p>
          </div>
        ) : search || layerFilter !== 'all' ? (
          filteredElements.map(el => (
            <div
              key={el.id}
              className={`tree-item ${selectedElementId === el.id ? 'selected' : ''}`}
              onClick={() => setSelectedElementId(el.id)}
            >
              <span className={`el-badge ${typeColors[el.type]}`}>{el.type.slice(0, 3)}</span>
              <span className="truncate flex-1">{el.name}</span>
            </div>
          ))
        ) : (
          renderTree(null)
        )}
      </div>
    </div>
  );
};
