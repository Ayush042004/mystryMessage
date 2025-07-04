import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'edge';
export const maxDuration = 30;

// Initialize OpenAI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
  try {
    const prompt = `
Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. 
These questions are for an anonymous social messaging platform like Qooh.me and should be suitable for a diverse audience. 
Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. 
Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment. 
Example format: "What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?"
`;
    const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"});


    const result = await model.generateContent(prompt);
    const response =  result.response;
    const text = response.text();

    return new Response(text, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}