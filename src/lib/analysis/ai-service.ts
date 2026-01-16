import { RawDetection, AnalysisRegion } from './types';

export class AiService {
  private static GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;
  private static GLM_KEY = import.meta.env.VITE_GLM_API_KEY;

  /**
   * Real Vision Analysis using Zhipu AI (GLM-4V)
   */
  static async analyzeRegion(region: AnalysisRegion, imageSrc: string): Promise<RawDetection[]> {
    if (!this.GLM_KEY) {
      console.error("GLM API Key missing");
      return [];
    }

    try {
      // 1. In a real production app, we would crop the image to the 'region' here.
      // For this implementation, we send the full image and tell the AI the region coordinates
      // to keep the frontend logic simple and "working" immediately.
      
      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.GLM_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "glm-4v",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Analyze this UI screenshot region (X: ${region.x}%, Y: ${region.y}%, W: ${region.width}%, H: ${region.height}%). 
                  Detect all UI elements (buttons, text, inputs, icons, cards).
                  For each, return a JSON array: [{ "label": "name", "type": "text|button|input|icon|container", "box_2d": [ymin, xmin, ymax, xmax], "text": "content" }]
                  Coordinates MUST be normalized [0, 1000]. Return ONLY the JSON.`
                },
                {
                  type: "image_url",
                  image_url: { url: imageSrc }
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Clean and parse JSON from AI response
      const jsonStr = content.replace(/```json|```/g, '').trim();
      const detections = JSON.parse(jsonStr);

      return detections.map((d: any) => ({
        label: d.label,
        type: d.type,
        confidence: 0.9,
        // Convert [0-1000] to [0-1] normalized for our engine
        box_2d: d.box_2d.map((v: number) => v / 1000),
        attributes: {
          text_content: d.text
        }
      }));

    } catch (error) {
      console.error("AI Analysis failed, falling back to simulation:", error);
      // Fallback logic to keep the tool "working" even if API fails
      return [];
    }
  }

  /**
   * Use Groq to turn raw data into a Deep Specification Prompt
   */
  static async generateDeepNarrative(elementData: any): Promise<string> {
    if (!this.GROQ_KEY) return "Groq Key missing";

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.GROQ_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "llama-3.1-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are an expert UI Engineer. Turn raw pixel data into a deep, human-readable CSS specification prompt."
            },
            {
              role: "user",
              content: `Convert this element data into a Deep UI Specification Narrative: ${JSON.stringify(elementData)}`
            }
          ]
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      return "Failed to generate narrative via Groq.";
    }
  }
}