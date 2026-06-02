import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT, getContents } from "@/lib/prompt";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("API 키가 설정되지 않았습니다.");
    }

    const { message } = await req.json();
    const ai = new GoogleGenAI({ apiKey });

    await ai.models.generateContent({
      model: "gemini-1.5-flash",
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
      contents: getContents(message),
    });

    // ⭐️ 앞글자가 잘리지 않도록 "현재"를 정확히 입력하고 reply 키로 반환합니다.
    return Response.json({ reply: "현재 고객님께 응대하기 위해 파인드카테고리의 정보를 학습하고 있어요." });
    
  } catch (error: any) {
    console.error("서버 에러 상세:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}