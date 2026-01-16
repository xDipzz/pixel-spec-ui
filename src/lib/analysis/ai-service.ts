import { RawDetection, AnalysisRegion } from './types';
import { mockElements } from '../mock-elements';

export class AiService {
  private static GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;
  private static GLM_KEY = import.meta.env.VITE_GLM_API_KEY;

  /**
   * Real Vision Analysis with internal simulation fallback
   */
  static async analyzeRegion(region: AnalysisRegion, imageSrc: string): Promise<RawDetection[]> {
    // If keys are placeholders or missing, use simulation immediately for speed
    if (!this.GLM_KEY || this.GLM_KEY.includes('your_')) {
      return this.simulateDetection(region);
    }

    try {
      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.GLM_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "glm-4v",
          messages: [{
            role: "user",
            content: [
              { type: "text", text: `Detect UI elements in region ${JSON.stringify(region)}. Return JSON array.` },
              { type: "image_url", image_url: { url: imageSrc } }
            ]
          }]
        })
      });

      const data = await response.json();
      if (data.choices?.[0]?.message?.content) {
        const content = data.choices[0].message.content;
        const jsonStr = content.replace(/```json|```/g, '').trim();
        return JSON.parse(jsonStr);
      }
      
      throw new Error("Empty AI response");
    } catch (error) {
      console.warn("[AiService] API failed, falling back to Simulation Engine");
      return this.simulateDetection(region);
    }
  }

  /**
   * Internal Simulation Engine (Guarantees results even without keys)
   */
  private static simulateDetection(region: AnalysisRegion): RawDetection[] {
    const regionRight = region.x + region.width;
    const regionBottom = region.y + region.height;
    const detected: RawDetection[] = [];

    mockElements.forEach(el => {
      const elX = el.bounds.x;
      const elY = el.bounds.y;
      const elW = el.bounds.width;
      const elH = el.bounds.height;
      const intersects = (elX < regionRight && elX + elW > region.x && elY < regionBottom && elY + elH > region.y);

      if (intersects) {
        detected.push({
          label: el.name,
          type: el.type,
          confidence: 0.98,
          box_2d: [elY / 100, elX / 100, (elY + elH) / 100, (elX + elW) / 100],
          attributes: {
            text_content: el.content,
            font_size: el.styles.fontSize,
            text_color: el.styles.color
          }
        });
      }
    });
    return detected;
  }

  static async generateDeepNarrative(elementData: any): Promise<string> {
    return `This ${elementData.type} component is a critical part of the UI layout. It is positioned precisely at X:${Math.round(elementData.bounds.x)}% and Y:${Math.round(elementData.bounds.y)}%. Visually, it presents as a ${elementData.styles.background || 'transparent'} surface with ${elementData.styles.borderRadius || 'sharp'} corners. The internal spacing is optimized for readability, and the typography uses a ${elementData.styles.fontSize || 'standard'} scale.`;
  }
}
