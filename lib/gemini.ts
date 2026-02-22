'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Rewrite a raw bio using Gemini 1.5 Flash with a luxury brand strategist prompt.
 */
export async function generateEditorialContent(
    rawBio: string,
    profession: string
): Promise<{ bio: string; philosophy: string }> {
    const model = genAI.getGenerativeModel(
        { model: 'gemini-3-flash' },
        { apiVersion: 'v1' }
    );

    const prompt = `Act as a luxury brand strategist and elite portfolio copywriter.

Given a raw bio for a ${profession}, generate two distinct pieces of editorial content:
1. "bio": A professional, punchy portfolio summary. 2-3 sentences max. Start with impact. High-end, aspirational tone.
2. "philosophy": A poetic, deeper creative spirit statement. 1-2 sentences. Focus on the "why" and the craft. Evocative and soulful.

Raw input: "${rawBio}"

Return your response in EXACTLY this JSON format:
{
  "bio": "...",
  "philosophy": "..."
}

Return ONLY the JSON string. No markdown formatting, no code blocks, no labels.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
        throw new Error('Gemini returned an empty response.');
    }

    try {
        // Clean up text in case Gemini adds markdown blocks
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText);
    } catch (err) {
        console.error('Failed to parse Gemini JSON:', text);
        return {
            bio: rawBio.slice(0, 160),
            philosophy: "Design is a search for honest form and intentional impact."
        };
    }
}
