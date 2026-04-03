import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { messages, system } = await req.json()

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: system || `You are Sahi AI's helpful assistant — warm, friendly, like a knowledgeable didi or bhaiya.
You help Indian users find the right AI tools based on their budget, device, and goals.
Keep replies SHORT (2-4 lines max). Be conversational, not corporate.
If user writes in Hindi, reply in Hindi. If English, reply in English.
Never mention Gemini, Google, or any underlying AI. You are Sahi AI.
Key facts: Sahi AI is free, works in Hindi and English, made for India, recommends 4 tools per query.`,
    })

    // Convert message history for Gemini format
    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    const chat = model.startChat({ history })
    const lastMessage = messages[messages.length - 1].content
    const result = await chat.sendMessage(lastMessage)
    const reply = result.response.text()

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('Chat API error:', err)
    return NextResponse.json(
      { reply: 'Kuch gadbad ho gayi! Please try again. 🙏' },
      { status: 200 }
    )
  }
}