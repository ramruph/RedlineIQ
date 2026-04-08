import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const getTuningSuggestions = async (carName: string, specs: any, currentPerformance: any) => {
  if (!apiKey) {
    return "API_KEY_MISSING: Please configure GEMINI_API_KEY in the secrets panel.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    You are an expert automotive race engineer for the Apex Velocity System.
    Analyze the following vehicle and provide 3 specific, technical tuning suggestions to optimize its performance.
    
    Vehicle: ${carName}
    Specs: ${JSON.stringify(specs)}
    Current Performance: ${JSON.stringify(currentPerformance)}
    
    Format your response as a concise list of 3 points, each starting with a technical category (e.g., AERO, ECU, SUSPENSION).
    Keep the tone professional, technical, and high-performance.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "No suggestions generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "ERROR: Failed to connect to Apex Intelligence Core.";
  }
};

export const getAutomotiveNews = async (topic: string = "racecar technique and automotive technology") => {
  if (!apiKey) {
    return [];
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `
    Fetch the latest news and technical articles about ${topic}.
    Provide a list of 5 recent, high-quality articles with a title, a short technical summary (2 sentences), and a source name.
    Focus on professional racing, engineering breakthroughs, and advanced driving techniques.
    Return the data as a JSON array of objects with the following structure:
    [
      {
        "title": "Article Title",
        "summary": "Technical summary...",
        "source": "Source Name",
        "category": "TECH / RACING / AERO / etc",
        "date": "YYYY-MM-DD"
      }
    ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini News API Error:", error);
    return [];
  }
};
