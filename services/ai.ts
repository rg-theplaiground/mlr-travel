
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AIAirport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export const searchAirportsNaturalLanguage = async (query: string): Promise<AIAirport[]> => {
  if (!query || query.length < 3) return [];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find the best airports for the following travel query: "${query}". 
      Return a JSON array of objects with keys: code (3-letter IATA), name, city, country.
      Prioritize the most convenient airports. Limit to 3 results.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              code: { type: Type.STRING },
              name: { type: Type.STRING },
              city: { type: Type.STRING },
              country: { type: Type.STRING }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAirport[];
    }
    return [];
  } catch (error) {
    console.error("AI Airport Search Failed:", error);
    return [];
  }
};
