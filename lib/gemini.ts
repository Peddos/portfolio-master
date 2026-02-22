'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

/**
 * Rewrite a raw bio using Gemini 1.5 Flash with a luxury brand strategist prompt.
 */
export async function rewriteBio(
    rawBio: string,
    profession: string
): Promise<string> {
    const model = genAI.getGenerativeModel(
        { model: 'gemini-2.5-flash' },
        { apiVersion: 'v1' }
    );

    const prompt = `Act as a luxury brand strategist and elite portfolio copywriter.

Rewrite the following raw bio into a professional, punchy portfolio summary suitable for a ${profession}.
The copy must:
- Sound high-end, editorial, and aspirational
- Be 2-3 sentences maximum
- Start with impact (no "I am a..." openers)  
- Use active, confident language
- Feel like it belongs in Vogue, Wired, or a top creative agency's website

Raw bio: "${rawBio}"

Return ONLY the rewritten bio, nothing else. No quotes, no labels.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
        throw new Error('Gemini returned an empty response. This might be due to safety filters.');
    }

    return text.trim();
}
