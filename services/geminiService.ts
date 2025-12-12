import { GoogleGenAI } from "@google/genai";

const getGeminiClient = () => {
  // Assuming process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' is available as per guidelines
  if (!process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT') {
    console.warn("API Key is missing. Gemini features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY || 'FAKE_API_KEY_FOR_DEVELOPMENT' });
};

export const analyzeFileWithGemini = async (
  base64Data: string,
  mimeType: string,
  prompt: string = "Analyze this file and provide a short, helpful summary or description."
): Promise<string> => {
  const client = getGeminiClient();
  if (!client) return "API Key missing.";

  try {
    // Extract base64 string without the data:image/...;base64, prefix if present
    const base64Content = base64Data.includes('base64,') 
      ? base64Data.split('base64,')[1] 
      : base64Data;

    const modelId = mimeType.startsWith('image/') ? 'gemini-2.5-flash' : 'gemini-2.5-flash';

    const response = await client.models.generateContent({
      model: modelId,
      contents: {
        parts: [
            {
                inlineData: {
                    mimeType: mimeType,
                    data: base64Content
                }
            },
            {
                text: prompt
            }
        ]
      }
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return "Failed to analyze file with Gemini.";
  }
};

export const generateFileName = async (
    base64Data: string,
    mimeType: string
): Promise<string> => {
    const client = getGeminiClient();
    if (!client) return "";
  
    try {
      const base64Content = base64Data.includes('base64,') 
        ? base64Data.split('base64,')[1] 
        : base64Data;
  
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
              {
                  inlineData: {
                      mimeType: mimeType,
                      data: base64Content
                  }
              },
              {
                  text: "Generate a short, concise, and descriptive filename for this content. Do not include the file extension. Max 5 words."
              }
          ]
        }
      });
  
      return response.text.trim();
    } catch (error) {
      console.error("Gemini filename generation failed:", error);
      return "";
    }
  };