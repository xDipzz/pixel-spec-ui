import { mockElements } from '../mock-elements';
import { RawDetection, AnalysisRegion } from './types';
import { UIElement } from '../types';

// Simulate a network delay
const DELAY_MS = 600;

export class GeminiSimulator {
  
  static async analyzeRegion(region: AnalysisRegion, imageWidth: number, imageHeight: number): Promise<RawDetection[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const detections = this.findElementsInRegion(region, imageWidth, imageHeight);
        resolve(detections);
      }, DELAY_MS);
    });
  }

  private static findElementsInRegion(region: AnalysisRegion, totalW: number, totalH: number): RawDetection[] {
    // We use the 'mockElements' as the "Ground Truth" of what exists in the image.
    // The simulator finds elements that overlap with the requested region.
    
    const regionRight = region.x + region.width;
    const regionBottom = region.y + region.height;

    const detected: RawDetection[] = [];

    mockElements.forEach(el => {
      // Basic overlap detection
      // Note: mockElements uses 0-100 scale (percentages) roughly. 
      // We assume the input image width/height maps to this 0-100 scale for simplicity in this simulation,
      // or we treat the mock coordinates as absolute pixels if we assume a standard canvas size (e.g. 1000x1000).
      // Let's assume the mock elements are in Percentage coordinates (0-100) for now, as that's how they look.
      
      const elX = el.bounds.x;
      const elY = el.bounds.y;
      const elW = el.bounds.width;
      const elH = el.bounds.height;
      const elRight = elX + elW;
      const elBottom = elY + elH;

      // Check for intersection
      const intersects = (
        elX < regionRight &&
        elRight > region.x &&
        elY < regionBottom &&
        elBottom > region.y
      );

      if (intersects) {
        // Create a detection.
        // We simulate some "noise" or "imperfection" if we wanted, but for now let's be perfect.
        // We convert the bounds to the normalized [ymin, xmin, ymax, xmax] format the AI uses.
        
        // Normalize coordinates (0-1) based on the "image dimensions" (which we assume is 100x100 for the mock data context)
        const normYMin = elY / 100;
        const normXMin = elX / 100;
        const normYMax = (elY + elH) / 100;
        const normXMax = (elX + elW) / 100;

        detected.push({
          label: el.name,
          type: el.type,
          confidence: 0.95 + (Math.random() * 0.05), // Random high confidence
          box_2d: [normYMin, normXMin, normYMax, normXMax],
          attributes: {
            text_content: el.content,
            font_size: el.styles.fontSize,
            font_weight: el.styles.fontWeight,
            text_color: el.styles.color,
            bg_color: el.styles.background
          }
        });
      }
    });

    return detected;
  }
}
