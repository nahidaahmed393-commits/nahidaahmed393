
import { GoogleGenAI, Type } from "@google/genai";
import type { BookOutline } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

const outlineSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "A compelling and relevant title for the book."
        },
        chapters: {
            type: Type.ARRAY,
            description: "A list of chapter titles that are comprehensive and logically sequenced.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING }
                },
                required: ["title"]
            }
        }
    },
    required: ["title", "chapters"]
};


export const generateBookOutline = async (topic: string, pageCount: number): Promise<BookOutline> => {
    const totalWords = pageCount * 400; // Approximate words per page
    const prompt = `You are an expert author's assistant. A user wants to write a book on the topic: "${topic}".
The book should be approximately ${pageCount} pages long, which is about ${totalWords} words.
Generate a detailed book structure. The number of chapters should be appropriate for a ${pageCount}-page book.
Ensure the chapter titles are logical, flow well, and cover the topic comprehensively.
Provide a compelling title for the book.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: outlineSchema,
                temperature: 0.7,
            },
        });

        const jsonText = response.text.trim();
        const parsedOutline = JSON.parse(jsonText);
        
        if (!parsedOutline.title || !Array.isArray(parsedOutline.chapters) || parsedOutline.chapters.length === 0) {
            throw new Error("Invalid outline structure received from AI.");
        }
        
        return parsedOutline as BookOutline;

    } catch (error) {
        console.error("Error generating book outline:", error);
        throw new Error("Failed to generate a valid book outline from the AI.");
    }
};

export const streamSectionContent = async (prompt: string, wordCount: number, onChunk: (chunk: string) => void): Promise<void> => {
    const fullPrompt = `${prompt} The section should be approximately ${wordCount} words.`;
    try {
        const responseStream = await ai.models.generateContentStream({
            model: model,
            contents: fullPrompt,
            config: {
                temperature: 0.6,
            }
        });

        for await (const chunk of responseStream) {
            onChunk(chunk.text);
        }
    } catch (error) {
        console.error("Error streaming content:", error);
        throw new Error("Failed to stream content from the AI.");
    }
};

export const generateSectionContent = async (prompt: string, wordCount: number): Promise<string> => {
     const fullPrompt = `${prompt} The section should be approximately ${wordCount} words.`;
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: fullPrompt,
            config: {
                temperature: 0.6,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating section content:", error);
        throw new Error("Failed to generate content from the AI.");
    }
}
