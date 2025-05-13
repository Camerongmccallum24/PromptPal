import axios from 'axios';
import OpenAI from 'openai';

export interface OptimizeParams {
  prompt: string;
  temperature?: number;
  max_tokens?: number;
}

// Get API key from localStorage (set via settings modal)
const OPENAI_API_KEY = localStorage.getItem('openai_api_key') || '';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for demo purposes
});

export async function optimizePrompt(params: OptimizeParams): Promise<string> {
  try {
    const { prompt, temperature = 0.2, max_tokens } = params;
    
    // Re-fetch the API key in case it was just updated
    const freshApiKey = localStorage.getItem('openai_api_key') || '';
    
    if (!freshApiKey) {
      console.log('No API key found, using mock optimization');
      // Fallback to mock optimization if no API key is provided
      return enhancePromptMock(prompt);
    }
    
    const oai = new OpenAI({
      apiKey: freshApiKey,
      dangerouslyAllowBrowser: true
    });
    
    const messages = [
      {
        role: 'system',
        content: `
You are an expert prompt engineer.
• Improve clarity and specificity
• Expand context where needed
• Preserve original intent
Return only the rewritten prompt.
        `.trim(),
      },
      { role: 'user', content: prompt },
    ];
    
    const response = await oai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature,
      max_tokens: max_tokens ?? Math.min(1024, prompt.length * 2),
    });
    
    return response.choices[0].message?.content.trim() || '';
  } catch (error) {
    console.error('Optimization API error:', error);
    // Fallback to mock enhancement in case of error
    return enhancePromptMock(params.prompt);
  }
}

// Mock enhancement function for fallback when API is unavailable
function enhancePromptMock(prompt: string): string {
  // Add specificity if the prompt is too short
  if (prompt.length < 20) {
    return `${prompt} - Please provide a detailed response with examples, considerations, and step-by-step explanation where applicable. Format the response in a clear, structured manner with headings and bullet points.`;
  }
  
  // Add structure for longer prompts
  return `I need you to act as an expert in this field when responding to the following request:
  
${prompt}

Please structure your response with:
1. A brief introduction to the topic
2. Detailed analysis and explanation
3. Practical examples or applications
4. Considerations or limitations
5. A brief conclusion

Use markdown formatting for readability with headings, bullet points, and emphasis where appropriate.`;
}
