import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

export const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function extractJobDetails(description: string) {
    if (!openai) {
        throw new Error('OpenAI API Key is missing. Please add OPENAI_API_KEY to your .env.local file.');
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o", // or gpt-3.5-turbo
            messages: [
                {
                    role: "system",
                    content: `You are a helpful assistant that extracts structured data from job descriptions. 
                    Return a JSON object with the following keys:
                    - title: A suitable short title for the project
                    - client_name: The client's name if mentioned, otherwise null
                    - budget: The budget amount if mentioned (number or string), otherwise null
                    - budget_type: 'fixed', 'hourly', or 'tbd'
                    - priority: 'low', 'medium', or 'high' (infer based on urgency words like 'ASAP', 'urgent', etc., default to 'medium')
                    - source: 'upwork', 'linkedin', 'email', 'direct', or 'other' (infer from context if possible, default to 'other')
                    - skills: array of strings (extracted skills)
                    `
                },
                {
                    role: "user",
                    content: description
                }
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
        });

        const content = completion.choices[0].message.content;
        return content ? JSON.parse(content) : null;
    } catch (error) {
        console.error('OpenAI Extraction Error:', error);
        throw error;
    }
}
