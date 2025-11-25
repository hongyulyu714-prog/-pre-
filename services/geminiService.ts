import { GoogleGenAI, Type } from "@google/genai";
import { Presentation } from "../types";

const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generatePresentation = async (topic: string): Promise<Presentation> => {
    if (!API_KEY) {
        throw new Error("API Key is missing.");
    }

    // Switched to gemini-2.5-flash for reliability and speed with large JSON responses.
    // The 'pro' model was causing timeouts (Rpc error) due to the large output size.
    const modelId = 'gemini-2.5-flash';

    const prompt = `
    You are a senior financial analyst and investment banker. 
    Create a comprehensive presentation structure for a 45-minute university-level or investor-level presentation.
    
    The Topic is: "${topic}"

    Context:
    - The presentation must last 45 minutes.
    - It must be deeply analytical, citing specific examples (like Nvidia, iFlytek, Cambricon if relevant to the topic).
    - It must balance the "Efficient Market Hypothesis" against "Irrational Exuberance/Bubbles".
    - Include 12-15 detailed slides to cover the time.
    - Content must be in the language of the topic provided (likely Chinese).
    
    Output strictly in JSON format conforming to the schema.
    For 'visualSuggestion', describe a chart (e.g., 'Line chart comparing PE ratios of Nvidia vs Historical Bubble').
    For 'speakerNotes', write a concise but detailed script (~150 words per slide) that the presenter can read.
    `;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        topic: { type: Type.STRING },
                        totalDuration: { type: Type.STRING },
                        slides: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    bulletPoints: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING }
                                    },
                                    speakerNotes: { type: Type.STRING },
                                    visualSuggestion: { type: Type.STRING },
                                    estimatedDuration: { type: Type.STRING }
                                },
                                required: ["title", "bulletPoints", "speakerNotes", "visualSuggestion", "estimatedDuration"]
                            }
                        }
                    },
                    required: ["topic", "totalDuration", "slides"]
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");
        
        return JSON.parse(text) as Presentation;

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};