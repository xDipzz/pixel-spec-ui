export interface PixelStats {
  dominantColors: string[];
  backgroundColor: string;
  uniqueColors: number;
}

export class PixelProcessor {
  
  static analyzeImage(imageElement: HTMLImageElement): PixelStats {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Scale down for speed (we don't need 4k resolution to find dominant colors)
    const MAX_DIM = 200;
    const scale = Math.min(1, MAX_DIM / Math.max(imageElement.width, imageElement.height));
    canvas.width = imageElement.width * scale;
    canvas.height = imageElement.height * scale;

    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return this.processPixels(imageData.data);
  }

  private static processPixels(data: Uint8ClampedArray): PixelStats {
    const colorCounts: Record<string, number> = {};
    let maxCount = 0;
    let backgroundColor = '#ffffff';

    // scan every 4th pixel for speed
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a < 128) continue; // Skip transparent

      // Quantize slightly to group similar colors
      const qr = Math.round(r / 5) * 5;
      const qg = Math.round(g / 5) * 5;
      const qb = Math.round(b / 5) * 5;

      const hex = this.rgbToHex(qr, qg, qb);
      colorCounts[hex] = (colorCounts[hex] || 0) + 1;

      if (colorCounts[hex] > maxCount) {
        maxCount = colorCounts[hex];
        backgroundColor = hex;
      }
    }

    // Sort colors by frequency
    const sortedColors = Object.entries(colorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8) // Top 8 colors
      .map(([color]) => color);

    return {
      dominantColors: sortedColors,
      backgroundColor,
      uniqueColors: Object.keys(colorCounts).length
    };
  }

  private static rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
}
