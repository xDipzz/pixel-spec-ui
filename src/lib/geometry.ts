import { ElementBounds } from './types';

export const isPointInBounds = (x: number, y: number, bounds: ElementBounds): boolean => {
  return x >= bounds.x && 
         x <= bounds.x + bounds.width && 
         y >= bounds.y && 
         y <= bounds.y + bounds.height;
};

export const getBoundsCenter = (bounds: ElementBounds): { x: number; y: number } => ({
  x: bounds.x + bounds.width / 2,
  y: bounds.y + bounds.height / 2,
});

export const formatSize = (w: number, h: number): string => `${w}×${h}`;
