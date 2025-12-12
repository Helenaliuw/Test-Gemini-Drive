
import { GoogleGenAI, GenerateContentResponse, Part } from '@google/genai';

const getGeminiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error('API_KEY environment variable is not set.');
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Generates an image based on a text prompt using the Gemini API.
 * @param prompt The text prompt for image generation.
 * @returns A base64 data URL of the generated image.
 */
export async function generateImage(prompt: string): Promise<string> {
  const ai = getGeminiClient();
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Using the specified model for image generation
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1", // Default to 1:1 aspect ratio. This is supported.
          // imageSize is only supported for 'gemini-3-pro-image-preview',
          // so it's removed to resolve the "image_size is only supported for Gempix 2 recipe" error.
        },
      },
    });

    if (response.candidates && response.candidates.length > 0) {
      // Fix: Iterate through all parts to find the image part, as per guidelines.
      // Do not assume the first part is an image part.
      for (const candidate of response.candidates) {
        for (const part of candidate.content?.parts || []) {
          // Fix: `mimeType` can be optional in `inlineData` from the `@google/genai` SDK's `Blob_2` type.
          // Provide a fallback 'image/png' if `mimeType` is undefined.
          if (part.inlineData && part.inlineData.data) {
            const base64EncodeString: string = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/png'; // Fallback to 'image/png'
            return `data:${mimeType};base64,${base64EncodeString}`;
          }
        }
      }
      throw new Error('No image data found in the response.');
    } else {
      throw new Error('No candidates found in the Gemini API response.');
    }
  } catch (error) {
    console.error('Error generating image from Gemini API:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error('An unknown error occurred during image generation.');
  }
}
