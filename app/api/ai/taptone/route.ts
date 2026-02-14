import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/ai';

export async function POST(request: NextRequest) {
    if (!openai) {
        return NextResponse.json({ error: 'OpenAI API Key is missing' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { mode, goal, tone, context, riskLevel, type } = body;

        let systemPrompt = '';
        let userPrompt = '';

        // Legacy support/fallback
        const effectiveMode = mode || (type === 'generate' ? 'compose' : type === 'rewrite' ? 'compose' : 'compose');

        if (effectiveMode === 'understand') {
             systemPrompt = `You are TapTone, an expert business communication analyst.
            Your goal is to analyze the client's message and provide strategic insights.
            
            Return a JSON object with:
            - intent: string (The core intent: Negotiation, Complaint, Scope Creep, Clarification, Approval, etc.)
            - summary: string (Brief summary of what they want, max 2 sentences)
            - urgency: "High" | "Medium" | "Low"
            - sentiment: string (e.g., Frustrated, Happy, Neutral, Cautious)
            - suggestedStrategy: string (Advice on how to handle this - be strategic)`;
            
            userPrompt = `Client Message:\n${body.clientMessage}\n\nContext:\n${context || 'None'}`;

        } else if (effectiveMode === 'strategize') {
            systemPrompt = `You are TapTone, a strategic communication advisor.
            Plan a response based on the user's goal and risk level.
            
            Goal: ${goal}
            Risk Level: ${riskLevel}
            Context: ${context}
            
            Return a JSON object with:
            - keyPoints: string[] (List of 3-5 key points to cover)
            - avoidPoints: string[] (List of 3 things to avoid mentioning)
            - recommendedTone: string (The best tone to use)`;
            
            userPrompt = `Situation/Client Message:\n${body.clientMessage || context}`;

        } else {
            // Compose Mode (Default)
            systemPrompt = `You are TapTone, an expert business communication assistant. 
            Write a message based on the user's intent, context, and parameters.
            
            Tone: ${tone}
            Goal: ${goal}
            Language: ${body.language || 'English'}
            Channel: ${body.channel || 'Email'}
            
            Return 3 distinct variations of the message in a JSON object with key "variants" (array of strings).
            Do not include "Subject:" unless it is an email.
            Keep the tone consistent with the requested "${tone}" style.
            `;
            
            userPrompt = `Context/Points to cover:\n${body.clientMessage || context}`;
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
            temperature: 0.7,
        });

        const content = completion.choices[0].message.content;
        return NextResponse.json(JSON.parse(content || '{}'));

    } catch (error) {
        console.error('TapTone API Error:', error);
        return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
    }
}
