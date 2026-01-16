export type ElementType = 'container' | 'text' | 'button' | 'input' | 'image' | 'card' | 'icon' | 'nav';

export interface ElementBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ElementStyles {
  margin?: { top: number; right: number; bottom: number; left: number };
  padding?: { top: number; right: number; bottom: number; left: number };
  gap?: number;
  
  // Typography
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  
  // Visuals
  color?: string;
  background?: string;
  border?: string;
  borderWidth?: string;
  borderColor?: string;
  borderRadius?: string;
  boxShadow?: string;
  opacity?: number;
  
  // Layout
  display?: 'flex' | 'grid' | 'block' | 'inline-block' | 'none';
  flexDirection?: 'row' | 'column';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  width?: string; // e.g. "100%", "fixed"
  height?: string;
  
  // Meta
  alignment?: 'left' | 'center' | 'right'; // Deprecated in favor of flex props, kept for backward compat
}

export interface UIElement {
  id: string;
  name: string;
  type: ElementType;
  parentId: string | null;
  childrenIds: string[];
  bounds: ElementBounds;
  styles: ElementStyles;
  content?: string;
}

export type ToolStatus = 'idle' | 'ready' | 'analyzing' | 'done' | 'failed';
export type RightPanelTab = 'inspector' | 'tokens';
export type ExportTab = 'spec' | 'json' | 'tailwind' | 'css';
export type LayerFilter = 'all' | 'text' | 'button' | 'input' | 'icon' | 'container' | 'card' | 'image' | 'nav';

export interface DesignToken {
  colors: { name: string; value: string }[];
  typography: { name: string; size: string; weight: string }[];
  spacing: { name: string; value: string }[];
  radius: { name: string; value: string }[];
}
