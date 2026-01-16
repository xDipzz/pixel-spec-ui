import { create } from 'zustand';
import { ToolStatus, RightPanelTab, ExportTab, LayerFilter, UIElement, DesignToken } from './types';
import { mockElements, mockTokens } from './mock-elements';
import { AnalysisEngine } from './analysis/analysis-engine';

interface ToolState {
  // Data
  elements: UIElement[];
  designTokens: DesignToken | null;

  // Image
  uploadedImage: string | null;
  imageName: string | null;
  
  // Status
  status: ToolStatus;
  analysisProgress: number;
  resultModalOpen: boolean;
  
  // Selection
  selectedElementId: string | null;
  
  // View toggles
  overlaysEnabled: boolean;
  gridEnabled: boolean;
  tooltipEnabled: boolean;
  
  // Zoom
  zoom: number;
  
  // Panels
  rightPanelTab: RightPanelTab;
  exportTab: ExportTab;
  layerFilter: LayerFilter;
  
  // Layers
  expandedLayers: Set<string>;
  allLayersExpanded: boolean;
  
  // Export options
  wrapLines: boolean;
  
  // Mouse position (for status bar)
  mouseX: number;
  mouseY: number;
  
  // Actions
  setElements: (elements: UIElement[]) => void;
  setDesignTokens: (tokens: DesignToken) => void;
  setUploadedImage: (image: string | null, name?: string | null) => void;
  setStatus: (status: ToolStatus) => void;
  setResultModalOpen: (open: boolean) => void;
  analyzeScreenshot: () => Promise<void>;
  setSelectedElementId: (id: string | null) => void;
  toggleOverlays: () => void;
  toggleGrid: () => void;
  toggleTooltip: () => void;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setRightPanelTab: (tab: RightPanelTab) => void;
  setExportTab: (tab: ExportTab) => void;
  setLayerFilter: (filter: LayerFilter) => void;
  toggleLayerExpanded: (id: string) => void;
  expandAllLayers: () => void;
  collapseAllLayers: () => void;
  setWrapLines: (wrap: boolean) => void;
  setMousePosition: (x: number, y: number) => void;
  reset: () => void;
}

const initialExpandedLayers = new Set(['app_shell', 'sidebar', 'main', 'right_panel', 'header_tabs', 'post_1', 'subscribe_card']);

export const useToolStore = create<ToolState>((set, get) => ({
  elements: mockElements,
  designTokens: mockTokens,
  uploadedImage: null,
  imageName: null,
  status: 'idle',
  analysisProgress: 0,
  resultModalOpen: false,
  selectedElementId: null,
  overlaysEnabled: true,
  gridEnabled: false,
  tooltipEnabled: true,
  zoom: 100,
  rightPanelTab: 'inspector',
  exportTab: 'spec',
  layerFilter: 'all',
  expandedLayers: initialExpandedLayers,
  allLayersExpanded: true,
  wrapLines: false,
  mouseX: 0,
  mouseY: 0,

  setElements: (elements) => set({ elements }),
  setDesignTokens: (tokens) => set({ designTokens: tokens }),

  setUploadedImage: (image, name = null) => set({ 
    uploadedImage: image, 
    imageName: name,
    status: image ? 'ready' : 'idle',
    selectedElementId: null
  }),
  
  setStatus: (status) => set({ status }),
  setResultModalOpen: (open) => set({ resultModalOpen: open }),

  analyzeScreenshot: async () => {
    const { uploadedImage } = get();
    if (!uploadedImage) return;

    set({ status: 'analyzing', analysisProgress: 0, resultModalOpen: false });

    try {
      const engine = new AnalysisEngine();
      
      const { elements, designTokens } = await engine.runAnalysis(uploadedImage, 100, 100, (progress) => {
        set({ analysisProgress: progress * 100 });
      });

      set({ 
        elements, 
        designTokens,
        status: 'done', 
        analysisProgress: 100,
        resultModalOpen: true,
        selectedElementId: elements.find(e => e.parentId === null)?.id || elements[0]?.id || null, // AUTO SELECT ROOT
        expandedLayers: new Set(elements.map(e => e.id)) 
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      set({ status: 'failed', analysisProgress: 0 });
    }
  },
  
  setSelectedElementId: (id) => set({ selectedElementId: id }),
  
  toggleOverlays: () => set((state) => ({ overlaysEnabled: !state.overlaysEnabled })),
  
  toggleGrid: () => set((state) => ({ gridEnabled: !state.gridEnabled })),
  
  toggleTooltip: () => set((state) => ({ tooltipEnabled: !state.tooltipEnabled })),
  
  setZoom: (zoom) => set({ zoom: Math.max(25, Math.min(200, zoom)) }),
  
  zoomIn: () => set((state) => ({ zoom: Math.min(200, state.zoom + 25) })),
  
  zoomOut: () => set((state) => ({ zoom: Math.max(25, state.zoom - 25) })),
  
  resetZoom: () => set({ zoom: 100 }),
  
  setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
  
  setExportTab: (tab) => set({ exportTab: tab }),
  
  setLayerFilter: (filter) => set({ layerFilter: filter }),
  
  toggleLayerExpanded: (id) => set((state) => {
    const next = new Set(state.expandedLayers);
    next.has(id) ? next.delete(id) : next.add(id);
    return { expandedLayers: next };
  }),
  
  expandAllLayers: () => set({ 
    expandedLayers: new Set(get().elements.map(e => e.id)),
    allLayersExpanded: true 
  }),
  
  collapseAllLayers: () => set({ 
    expandedLayers: new Set(),
    allLayersExpanded: false 
  }),
  
  setWrapLines: (wrap) => set({ wrapLines: wrap }),
  
  setMousePosition: (x, y) => set({ mouseX: x, mouseY: y }),
  
  reset: () => set({
    uploadedImage: null,
    imageName: null,
    status: 'idle',
    selectedElementId: null,
    zoom: 100,
    elements: mockElements,
    designTokens: mockTokens,
    resultModalOpen: false,
  }),
}));