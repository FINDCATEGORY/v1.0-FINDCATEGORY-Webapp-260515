import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT, getContents } from "@/lib/prompt";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("API 키가 설정되지 않았습니다.");
    }

    const { message } = await req.json();
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(getContents(message));
    const response = await result.response;
    const text = response.text();

    return Response.json({ reply: text });
    
  } catch (error: any) {
    console.error("서버 에러 상세:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}