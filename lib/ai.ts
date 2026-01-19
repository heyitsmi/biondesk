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

export async function generateProposal(params: {
    description: string;
    tone: string;
    format: string;
    clientName?: string;
    userProfile?: string; // Optional context about the user/agency
}) {
    if (!openai) {
        throw new Error('OpenAI API Key is missing');
    }

    const { description, tone, format, clientName, userProfile } = params;

    const systemPrompt = `You are an expert proposal writer. Your task is to write a ${format} for a freelance/agency project.
    
    Context:
    - Tone: ${tone}
    - Client Name: ${clientName || 'Hiring Manager'}
    - User/Agency Profile: ${userProfile || 'A professional design and development agency'}
    
    Instructions:
    - Write a compelling, high-converting ${format}.
    - Focus on how you can solve their specific problems mentioned in the job description.
    - Use HTML formatting (<p>, <strong>, <ul>, <li>, <h3>, etc.) for structure.
    - Do NOT include markdown code blocks or backticks. Return raw HTML suitable for a WYSIWYG editor.
    - Keep it concise but persuasive.
    `;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Job Description:\n${description}` }
            ],
            temperature: 0.7,
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI Proposal Generation Error:', error);
        throw error;
    }
}
