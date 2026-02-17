import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

export const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function extractJobDetails(description: string, userId?: string) {
    if (!openai) {
        throw new Error('OpenAI API Key is missing. Please add OPENAI_API_KEY to your .env.local file.');
    }

    try {
        const model = "gpt-4o";
        const completion = await openai.chat.completions.create({
            model: model, // or gpt-3.5-turbo
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

        const usage = completion.usage;
        if (userId && usage) {
             const { recordUsage } = await import('@/lib/usage');
             // Fire and forget
             recordUsage(userId, 'job-extractor', model, usage.prompt_tokens, usage.completion_tokens).catch(err => console.error(err));
        }

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
    userId?: string;
}) {
    if (!openai) {
        throw new Error('OpenAI API Key is missing');
    }

    const { description, tone, format, clientName, userProfile, userId } = params;

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
        const model = "gpt-4o";
        const completion = await openai.chat.completions.create({
            model: model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Job Description:\n${description}` }
            ],
            temperature: 0.7,
        });

        const usage = completion.usage;
        if (userId && usage) {
             const { recordUsage } = await import('@/lib/usage');
             recordUsage(userId, 'proposal-generator', model, usage.prompt_tokens, usage.completion_tokens).catch(err => console.error(err));
        }

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('OpenAI Proposal Generation Error:', error);
        throw error;
    }
}

export async function generateProjectEstimate(params: {
    description: string;
    userContext?: string;
    hourlyRate?: number;
    userId?: string;
}) {
    if (!openai) {
        throw new Error('OpenAI API Key is missing');
    }

    const { description, userContext, hourlyRate, userId } = params;

    const systemPrompt = `You are an expert project manager and estimator. 
    Analyze the project description and user context to provide a detailed cost and timeline estimate.
    
    Context:
    - User Expertise: ${userContext || 'General Professional'}
    ${hourlyRate ? `- User Defined Hourly Rate: $${hourlyRate}/hr` : ''}
    
    Return a valid JSON object with the following fields:
    - estimated_hours: number (total estimated hours)
    - suggested_timeline: string (e.g., "2-3 weeks")
    - hourly_rate_range: string (e.g., "$40 - $60") ${hourlyRate ? '(Use the provided User Defined Hourly Rate)' : ''}
    - fixed_price_range: string (e.g., "$3000 - $5000") ${hourlyRate ? '(Calculate based on estimated hours * provided rate)' : ''}
    - rationale: string (brief explanation of the estimate difficulty and scope)
    - breakdown: array of objects { phase: string, hours: number } (key phases of the project)
    
    Be realistic. Account for planning, development, testing, and revisions.`;

    try {
        const model = "gpt-4o";
        const completion = await openai.chat.completions.create({
            model: model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Project Description:\n${description}` }
            ],
            response_format: { type: "json_object" },
            temperature: 0.4,
        });

        const usage = completion.usage;
        if (userId && usage) {
             const { recordUsage } = await import('@/lib/usage');
             recordUsage(userId, 'project-estimator', model, usage.prompt_tokens, usage.completion_tokens).catch(err => console.error(err));
        }

        const content = completion.choices[0].message.content;
        return content ? JSON.parse(content) : null;
    } catch (error) {
        console.error('OpenAI Estimate Generation Error:', error);
        throw error;
    }
}
