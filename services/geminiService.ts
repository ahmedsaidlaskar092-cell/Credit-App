import { GoogleGenAI } from '@google/genai';
import { SaleEntry, CreditEntry } from '../types';

if (!process.env.API_KEY) {
  // A check to ensure the API key is available.
  // In a real deployed environment, this would be set.
  // For local development, this might be undefined.
  console.warn("Gemini API key not found in process.env.API_KEY. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const analyzeBusinessData = async (sales: SaleEntry[], credits: CreditEntry[]): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key is not configured. Please set up your environment variables.";
  }
  
  const model = 'gemini-2.5-pro';

  const salesDataSummary = sales.map(s => `- Sale: ${s.item} (${s.qty} units) for ₹${s.totalAmount.toFixed(2)} (Profit: ₹${s.profit.toFixed(2)}) via ${s.paymentType} on ${new Date(s.dateTime).toLocaleDateString()}`).join('\n');
  const creditDataSummary = credits.map(c => `- Credit: ₹${c.amount} given, status: ${c.status}, due on ${new Date(c.dueDate).toLocaleDateString()}`).join('\n');

  const prompt = `
    As a business analyst for a small Indian shopkeeper, analyze the following sales and credit (udhar) data. 
    Provide actionable insights and a summary in a simple, easy-to-understand language (like Hindi/Hinglish mixed with English terms is okay).

    The analysis should be structured with the following sections using markdown:
    1.  **Overall Summary:** A brief overview of sales, profitability, and credit health.
    2.  **Sales & Profit Insights:** Identify top-selling items, most profitable sales, popular payment methods, and sales trends.
    3.  **Credit (Udhar) Analysis:** Comment on the total outstanding credit, and the ratio of paid vs. unpaid credits.
    4.  **Recommendations:** Suggest 2-3 practical steps the shopkeeper can take to increase profits or manage credit better.

    Here is the data:

    **Sales Data:**
    ${salesDataSummary.length > 0 ? salesDataSummary : "No sales data available."}

    **Credit (Udhar) Data:**
    ${creditDataSummary.length > 0 ? creditDataSummary : "No credit data available."}

    Please be concise and focus on what matters most to a small business owner.
  `;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: 32768 }
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I couldn't analyze the data. There was an error connecting to the AI service.";
  }
};