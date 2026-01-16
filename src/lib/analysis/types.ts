import { UIElement, ElementType, ElementStyles } from '../types';

export type AnalysisStage = 'idle' | 'preprocessing' | 'splitting' | 'analyzing' | 'merging' | 'complete' | 'error';

export interface AnalysisConfig {
  overlapRatio: number; // e.g., 0.1 for 10% overlap
  minTileSize: number;
  strategy: 'grid' | 'semantic'; // 'grid' = fixed tiles, 'semantic' = layout-aware split
}

export interface AnalysisRegion {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'global' | 'section' | 'detail';
  priority: number;
}

// The raw output from the "Understanding Layer" (Gemini) before merging
export interface RawDetection {
  label: string; // The semantic label (e.g., "submit_button")
  type: ElementType;
  confidence: number;
  box_2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] standard normalized coords
  attributes?: {
    text_content?: string;
    font_size?: string;
    font_weight?: string;
    text_color?: string;
    bg_color?: string;
    is_clickable?: boolean;
    list_group_id?: string; // To help grouping siblings
  };
}

export interface TileAnalysisResult {
  regionId: string;
  detections: RawDetection[];
  processingTimeMs: number;
}

export interface AnalysisSession {
  id: string;
  timestamp: number;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  regions: AnalysisRegion[];
  results: Map<string, TileAnalysisResult>;
  finalElements: UIElement[];
  status: AnalysisStage;
}
