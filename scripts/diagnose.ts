import { GoogleGenerativeAI } from '@google/generative-ai';
import { v2 as cloudinary } from 'cloudinary';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: '.env.local' });

async function testGemini() {
    console.log('Testing Gemini...');
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Say "Gemini is online"');
        console.log('Gemini success:', result.response.text().trim());
    } catch (err: any) {
        console.error('Gemini failure:', err.message || err);
    }
}

async function testCloudinary() {
    console.log('\nTesting Cloudinary...');
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
        const result = await cloudinary.api.ping();
        console.log('Cloudinary success:', result);
    } catch (err: any) {
        console.error('Cloudinary failure:', err.message || err);
    }
}

async function testSupabase() {
    console.log('\nTesting Supabase...');
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
        if (error) throw error;
        console.log('Supabase success: Connected to profiles table.');
    } catch (err: any) {
        console.error('Supabase failure:', err.message || err);
    }
}

async function runTests() {
    await testGemini();
    await testCloudinary();
    await testSupabase();
}

runTests();
