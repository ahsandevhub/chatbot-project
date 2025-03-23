/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/nebiusService.ts
import OpenAI from 'openai';

const client = new OpenAI({
    baseURL: 'https://api.studio.nebius.com/v1/',
    apiKey: import.meta.env.VITE_NEBIUS_API_KEY,
});

export const getNebiusResponse = async (messages: any) : Promise<string | null> => { //Added export
    try {
        const response = await client.chat.completions.create({
            "model": "deepseek-ai/DeepSeek-V3",
            "max_tokens": 512,
            "temperature": 0.3,
            "top_p": 0.95,
            messages: messages,
        });

        return response.choices[0].message.content; // Extract the response text
    } catch (error) {
        console.error("Error calling Nebius API:", error);
        return null; // or throw error, depending on your error handling
    }
}