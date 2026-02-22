require('dotenv').config({ path: '.env.local' });

async function checkRest() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.models) {
            console.log('Available models:', data.models.map(m => m.name));
        } else {
            console.log('No models or error:', data);
        }
    } catch (e) {
        console.error('Fetch failed:', e.message);
    }
}

checkRest();
