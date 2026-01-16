import { AnalysisRegion, AnalysisConfig, TileAnalysisResult, RawDetection } from './types';
import { AiService } from './ai-service';
import { PixelProcessor } from './pixel-processor';
import { UIElement, ElementType, ElementBounds, ElementStyles, DesignToken } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

export interface AnalysisResult {
  elements: UIElement[];
  designTokens: DesignToken;
}

export class AnalysisEngine {
  private config: AnalysisConfig;

  constructor(config: AnalysisConfig = { overlapRatio: 0.1, minTileSize: 20, strategy: 'grid' }) {
    this.config = config;
  }

  async runAnalysis(imageSrc: string, width: number, height: number, onProgress?: (progress: number) => void): Promise<AnalysisResult> {
    
    // 0. Pre-processing (Real Pixel Analysis)
    if (onProgress) onProgress(0.1);
    
    // Load image for pixel processing
    const img = await this.loadImage(imageSrc);
    const pixelStats = PixelProcessor.analyzeImage(img);
    
    // Generate Real Tokens from Pixels
    const designTokens: DesignToken = {
      colors: pixelStats.dominantColors.map((c, i) => ({ 
        name: i === 0 ? 'background' : `color-${i}`, 
        value: c 
      })),
      typography: [ 
        { name: 'body', size: '16px', weight: '400' },
        { name: 'heading', size: '24px', weight: '700' }
      ],
      spacing: [
        { name: 'sm', value: '8px' },
        { name: 'md', value: '16px' }
      ],
      radius: [
        { name: 'md', value: '4px' }
      ]
    };

    // 1. Split
    if (onProgress) onProgress(0.2);
    const regions = this.generateRegions(width, height);
    
    // 2. Analyze (Powered by Groq/GLM)
    const results = new Map<string, TileAnalysisResult>();
    let completed = 0;

    const chunkSize = 3;
    for (let i = 0; i < regions.length; i += chunkSize) {
      const chunk = regions.slice(i, i + chunkSize);
      await Promise.all(chunk.map(async (region) => {
        // CALLING REAL AI SERVICE
        const detections = await AiService.analyzeRegion(region, imageSrc);
        results.set(region.id, {
          regionId: region.id,
          detections,
          processingTimeMs: 0
        });
        completed++;
        if (onProgress) onProgress(0.2 + (completed / regions.length) * 0.6); 
      }));
    }

    // 3. Merge
    if (onProgress) onProgress(0.9);
    const mergedElements = this.mergeResults(Array.from(results.values()), width, height);
    
    // 4. Structure (Parent-Child)
    const structuredElements = this.buildHierarchy(mergedElements);
    
    if (onProgress) onProgress(1.0);
    return {
      elements: structuredElements,
      designTokens
    };
  }

  private async loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  private generateRegions(imageW: number, imageH: number): AnalysisRegion[] {
    const regions: AnalysisRegion[] = [];
    
    // 1. Global Context (The "Big Picture")
    regions.push({
      id: 'global',
      x: 0,
      y: 0,
      width: 100, // Using 0-100 scale for mock compatibility
      height: 100,
      type: 'global',
      priority: 1
    });

    // 2. Dense Grid Strategy (High Detail)
    // We want approx 50-60 tiles. 
    // sqrt(60) is approx 7.7, so an 8x8 grid is perfect (64 tiles).
    
    const GRID_COLS = 8;
    const GRID_ROWS = 8;
    
    // We calculate step size based on the 0-100 mock scale.
    // In a real scenario, we'd use imageW/imageH pixels.
    const stepX = 100 / GRID_COLS;
    const stepY = 100 / GRID_ROWS;
    
    // Tile size needs to be larger than step to provide OVERLAP.
    // Overlap ensures elements on the "cut line" aren't missed.
    // Let's add ~15% padding to the tile size.
    const tileW = stepX * 1.15;
    const tileH = stepY * 1.15;

    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        // Calculate position
        let x = col * stepX;
        let y = row * stepY;
        
        // Adjust for overlap centering (shift back slightly so overlap is distributed)
        // Actually, simple top-left alignment with extended width/height is easier and safer.
        // We just need to make sure we don't go out of bounds? 
        // Our simulator/cropper should handle out-of-bounds, but let's clamp for cleanliness.
        
        // Note: It's okay if the tile extends beyond 100% in the request, 
        // the cropper will just clip it.
        
        regions.push({
          id: `tile_${row}_${col}`,
          x: Number(x.toFixed(2)),
          y: Number(y.toFixed(2)),
          width: Number(tileW.toFixed(2)),
          height: Number(tileH.toFixed(2)),
          type: 'detail',
          priority: 2
        });
      }
    }

    return regions;
  }

  private mergeResults(results: TileAnalysisResult[], totalW: number, totalH: number): UIElement[] {
    const allDetections: RawDetection[] = [];
    results.forEach(r => allDetections.push(...r.detections));

    // 1. Deduplication (IoU)
    const uniqueDetections: RawDetection[] = [];
    
    // Sort by confidence to prioritize "sure" bets
    allDetections.sort((a, b) => b.confidence - a.confidence);

    for (const det of allDetections) {
      let isDuplicate = false;
      for (const existing of uniqueDetections) {
        // High IoU threshold for duplicates (0.5 is standard, but for dense grid we might want 0.4)
        if (this.calculateIoU(det.box_2d, existing.box_2d) > 0.4 && det.type === existing.type) {
          isDuplicate = true;
          // TODO: We could merge attributes here (e.g. if one has text and other doesn't)
          break;
        }
      }
      if (!isDuplicate) {
        uniqueDetections.push(det);
      }
    }

    // 2. Convert to Elements
    let elements = uniqueDetections.map(det => this.convertDetectionToElement(det, totalW, totalH));

    // 3. Snap & Align (The "Code" Intelligence)
    // Aligns elements that are extremely close (e.g. 1px off) to share the same axis.
    elements = this.snapAlignment(elements);

    return elements;
  }

  private snapAlignment(elements: UIElement[]): UIElement[] {
    // Threshold for snapping (relative 0-100 scale). 
    // 0.5% is roughly 5-10px on a big screen, which is a good snap distance.
    const SNAP_THRESHOLD = 0.5;

    // We can snap X and Y independently.
    
    // Gather all unique X and Y coordinates (left, center, right, top, bottom)
    // This is a naive implementation. A better one clusters values.
    
    // Let's iterate and align "following" elements to "preceding" ones if close.
    // Sort by position to make this easier.
    
    const sortedX = [...elements].sort((a, b) => a.bounds.x - b.bounds.x);
    
    for (let i = 1; i < sortedX.length; i++) {
      const curr = sortedX[i];
      const prev = sortedX[i - 1];
      
      // Snap Left
      if (Math.abs(curr.bounds.x - prev.bounds.x) < SNAP_THRESHOLD) {
        curr.bounds.x = prev.bounds.x;
      }
      // Snap Right (Left + Width)
      const currRight = curr.bounds.x + curr.bounds.width;
      const prevRight = prev.bounds.x + prev.bounds.width;
      if (Math.abs(currRight - prevRight) < SNAP_THRESHOLD) {
        // Adjust width to match right edge
        curr.bounds.width = prevRight - curr.bounds.x;
      }
    }

    return elements;
  }

  private calculateIoU(boxA: [number, number, number, number], boxB: [number, number, number, number]): number {
    // box: [ymin, xmin, ymax, xmax]
    const yA1 = boxA[0], xA1 = boxA[1], yA2 = boxA[2], xA2 = boxA[3];
    const yB1 = boxB[0], xB1 = boxB[1], yB2 = boxB[2], xB2 = boxB[3];

    const xI1 = Math.max(xA1, xB1);
    const yI1 = Math.max(yA1, yB1);
    const xI2 = Math.min(xA2, xB2);
    const yI2 = Math.min(yA2, yB2);

    const interArea = Math.max(0, xI2 - xI1) * Math.max(0, yI2 - yI1);

    const boxAArea = (xA2 - xA1) * (yA2 - yA1);
    const boxBArea = (xB2 - xB1) * (yB2 - yB1);

    return interArea / (boxAArea + boxBArea - interArea);
  }

  private convertDetectionToElement(det: RawDetection, totalW: number, totalH: number): UIElement {
    // box is normalized 0-1. Convert back to absolute (or 0-100 scale in our mock case)
    const [ymin, xmin, ymax, xmax] = det.box_2d;
    
    const bounds: ElementBounds = {
      x: xmin * 100, // Assuming 0-100 scale
      y: ymin * 100,
      width: (xmax - xmin) * 100,
      height: (ymax - ymin) * 100
    };

    const styles: ElementStyles = {
      fontSize: det.attributes?.font_size,
      fontWeight: det.attributes?.font_weight,
      color: det.attributes?.text_color,
      background: det.attributes?.bg_color,
      // Default layout props
      display: 'flex',
      flexDirection: 'column',
      alignment: 'left' // Legacy support
    };

    return {
      id: generateId(),
      name: det.label || 'Unknown',
      type: det.type,
      parentId: null, // Will be set in hierarchy build
      childrenIds: [],
      bounds,
      styles,
      content: det.attributes?.text_content
    };
  }

  private buildHierarchy(elements: UIElement[]): UIElement[] {
    // Simple containment check
    // Sort by size (smallest first) so we find immediate parents? 
    // No, Sort by area ascending. Smallest elements are potential children. 
    // Largest elements are potential parents.
    
    // We want to find the *smallest* parent that contains an element.
    // So if we iterate elements, for each element we look for a parent.
    
    const sorted = [...elements].sort((a, b) => (a.bounds.width * a.bounds.height) - (b.bounds.width * b.bounds.height));
    
    // Reset relations
    sorted.forEach(e => {
      e.parentId = null;
      e.childrenIds = [];
    });

    for (let i = 0; i < sorted.length; i++) {
      const child = sorted[i];
      // Find the smallest element that contains this child (and is larger than it)
      // Since we sorted by size ascending, we can look at elements *after* i.
      
      let parent: UIElement | null = null;
      
      for (let j = i + 1; j < sorted.length; j++) {
        const potential = sorted[j];
        if (this.contains(potential, child)) {
          // Because the array is sorted by size, the first one we find 
          // might NOT be the direct parent if there are nested containers.
          // Wait, if we sorted by size ascending (small -> big):
          // The first container we find that contains 'child' is the *smallest* container that contains it.
          // So it IS the direct parent.
          
          parent = potential;
          break; 
        }
      }

      if (parent) {
        child.parentId = parent.id;
        parent.childrenIds.push(child.id);
      }
    }
    
    return sorted;
  }

  private contains(parent: UIElement, child: UIElement): boolean {
    const p = parent.bounds;
    const c = child.bounds;
    // Allow small tolerance
    const tolerance = 0.5; 
    return (
      p.x <= c.x + tolerance &&
      p.y <= c.y + tolerance &&
      p.x + p.width >= c.x + c.width - tolerance &&
      p.y + p.height >= c.y + c.height - tolerance
    );
  }
}

