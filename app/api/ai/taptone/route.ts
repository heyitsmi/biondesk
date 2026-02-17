import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/ai';
import { getCurrentUser } from '@/lib/auth';
import { recordUsage } from '@/lib/usage';

export async function POST(request: NextRequest) {
    if (!openai) {
        return NextResponse.json({ error: 'OpenAI API Key is missing' }, { status: 500 });
    }

    try {
        const body = await request.json();
        const { mode, goal, tone, context, riskLevel, position, length, type } = body;

        let systemPrompt = '';
        let userPrompt = '';

        // Legacy support
        const effectiveMode = mode || 'compose';

        // ─── MODE 1: UNDERSTAND ──────────────────────────────────
        if (effectiveMode === 'understand') {
            systemPrompt = `You are TapTone, an expert business communication analyst specializing in freelancer-client dynamics.

Analyze the client's message deeply. Look beyond surface meaning.

Return a JSON object with these EXACT keys:
{
  "intent": string, // Primary intent: "Negotiation", "Complaint", "Scope Creep", "Clarification", "Payment Delay", "Approval", "Dissatisfaction", "Casual Discussion", "Scope Change", "Deadline Extension"
  "summary": string, // 1-2 sentence summary of what client actually wants
  "urgency": "High" | "Medium" | "Low",
  "sentiment": string, // "Frustrated", "Happy", "Neutral", "Cautious", "Aggressive", "Passive-Aggressive", "Friendly", "Anxious"
  "hiddenSignals": {
    "scopeCreepRisk": "High" | "Medium" | "Low" | "None",
    "priceSensitivity": "High" | "Medium" | "Low" | "None",
    "emotionalTone": string, // The underlying emotional state
    "riskSignals": string[] // Array of specific risk phrases or patterns detected (3-5 items)
  },
  "suggestedStrategy": string, // 2-3 sentence strategic advice
  "actionableStrategies": [
    { "label": string, "description": string }
  ] // Array of 3-4 concrete next steps with short labels like "Reconfirm Scope", "Clarify First", "Be Firm", "Offer Options", "Delay Response", "Escalate"
}`;
            userPrompt = `Client Message:\n${body.clientMessage}\n\nAdditional Context:\n${context || 'None'}`;

        // ─── MODE 2: STRATEGIZE ──────────────────────────────────
        } else if (effectiveMode === 'strategize') {
            systemPrompt = `You are TapTone, a strategic communication advisor for freelancers and small business owners.

Plan a professional response based on these parameters:
- Goal: ${goal}
- Position: ${position || 'Professional'}
- Risk Level: ${riskLevel || 'low'}
- Channel: ${body.channel || 'Email'}

Return a JSON object with these EXACT keys:
{
  "strategyTitle": string, // Short title like "Firm but Fair Clarification"
  "keyPoints": string[], // 4-6 key points to include in the reply
  "avoidPoints": string[], // 3-4 things to definitely NOT mention
  "boundaryStatements": string[], // 2-3 ready-to-use boundary phrases (e.g. "As discussed in our original agreement...")
  "recommendedTone": string, // Best tone to use: "Professional", "Firm", "Diplomatic", etc.
  "riskAssessment": string // 1-sentence risk note about this approach
}`;
            userPrompt = `Situation/Client Message:\n${body.clientMessage || context}`;

        // ─── MODE 3: CONVERSATION ────────────────────────────────
        } else if (effectiveMode === 'conversation') {
            systemPrompt = `You are TapTone, a conversation intelligence analyst for business communication.

Analyze this full conversation thread between a freelancer/business owner and their client.

Return a JSON object with these EXACT keys:
{
  "threadSummary": string, // 3-4 sentence summary of the entire thread
  "commitments": string[], // All commitments/promises made by either party
  "unresolvedItems": string[], // Questions or issues still open
  "scopeChanges": string[], // Any scope modifications detected (even subtle ones)
  "suggestedNextAction": string, // What the user should do next
  "structuredReply": {
    "subject": string,
    "summary": string,
    "clarification": string,
    "nextSteps": string,
    "deadline": string
  }
}`;
            userPrompt = `Full Conversation Thread:\n${body.clientMessage}\n\nContext:\n${context || 'None'}`;

        // ─── MODE 4: COMPOSE ─────────────────────────────────────
        } else {
            const isPaymentReminder = goal === 'Payment Reminder';
            const lengthInstruction = length === 'Short' ? 'Keep each variant under 80 words.' :
                                     length === 'Detailed' ? 'Make each variant comprehensive, 200+ words.' :
                                     'Keep each variant balanced, around 100-150 words.';

            if (isPaymentReminder) {
                systemPrompt = `You are TapTone, a payment communication specialist.

Generate 4 escalation levels of payment reminder messages.
Tone: ${tone}
Language: ${body.language || 'English'}
Channel: ${body.channel || 'Email'}
${lengthInstruction}

Return a JSON object:
{
  "variants": string[], // Exactly 4 variants: [Soft Reminder, Medium Reminder, Firm Reminder, Final Notice]
  "escalationLabels": ["Soft", "Medium", "Firm", "Final"],
  "riskScores": number[] // Risk score 1-10 for each variant (how assertive)
}`;
            } else {
                systemPrompt = `You are TapTone, an expert business communication assistant.
Write a message based on the user's intent, context, and parameters.

Tone: ${tone}
Goal: ${goal}
Position: ${position || 'Professional'}
Language: ${body.language || 'English'}
Channel: ${body.channel || 'Email'}
${lengthInstruction}

IMPORTANT RULES:
1. Do not include "Subject:" unless channel is Email.
2. Keep the tone consistent with "${tone}".
3. For each variant, also check for:
   - Scope Guard: Does the message accidentally agree to scope changes? Does it use phrases like "sure, no problem" for extra work?
   - Confidence Check: Does it use weak language like "maybe", "I think", "if possible", "sorry for..."?

Return a JSON object:
{
  "variants": string[], // 3 distinct message variants
  "riskScores": number[], // Risk score 1-10 for each variant (1=very safe/diplomatic, 10=very direct/risky)
  "scopeGuardWarnings": string[], // Array of 0-3 warnings if any variant accidentally agrees to scope creep
  "confidenceBoosts": string[] // Array of 0-3 suggestions to strengthen weak language found
}`;
            }

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

        const usage = completion.usage;
        const currentUser = await getCurrentUser();
        if (currentUser && usage) {
            // Fire and forget usage recording
            recordUsage(currentUser.id, 'taptone', "gpt-4o", usage.prompt_tokens, usage.completion_tokens)
                .catch(err => console.error('Failed to log usage:', err));
        }

        const content = completion.choices[0].message.content;
        return NextResponse.json(JSON.parse(content || '{}'));

    } catch (error) {
        console.error('TapTone API Error:', error);
        return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
    }
}
