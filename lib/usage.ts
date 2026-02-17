
import { createServerClient } from '@/lib/supabase';

// Cost per 1M tokens (as of Feb 2026 - using GPT-4o as baseline if not found)
const PRICING: Record<string, { input: number; output: number }> = {
  'gpt-4o': { input: 2.50, output: 10.00 }, // $2.50/1M input, $10.00/1M output
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
  'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
  // fallback
  'default': { input: 2.50, output: 10.00 }
};

export function calculateCost(model: string, inputTokens: number, outputTokens: number): number {
  const modelKey = Object.keys(PRICING).find(k => model.includes(k)) || 'default';
  const price = PRICING[modelKey] || PRICING['default'];
  
  const inputCost = (inputTokens / 1000000) * price.input;
  const outputCost = (outputTokens / 1000000) * price.output;
  
  return inputCost + outputCost;
}

export async function recordUsage(
  userId: string,
  feature: string,
  model: string,
  inputTokens: number,
  outputTokens: number
) {
  try {
    const supabase = createServerClient();
    const cost = calculateCost(model, inputTokens, outputTokens);
    
    // We don't await this to avoid blocking the response, unless necessary.
    // In serverless, we might need to await to ensure execution before freeze.
    // NEXT.js usually handles this fine, but let's await to be safe or use waitUntil if available (Next 15+).
    // biondesk-app uses Next 14/15? library versions say Next 14.1.0 or similar.
    // We'll await it for safety.
    
    const { error } = await supabase.from('ai_usage').insert({
      user_id: userId,
      feature,
      model,
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      total_tokens: inputTokens + outputTokens,
      estimated_cost: cost
    });

    if (error) {
      console.error('Failed to record AI usage:', error);
    }
  } catch (err) {
    console.error('Error recording AI usage:', err);
  }
}
