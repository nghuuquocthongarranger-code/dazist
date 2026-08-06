import type { Handler } from "@netlify/functions";

/** Bối cảnh hệ thống dùng chung cho mọi cuộc hội thoại — đặt "vai" cho AI, kèm bối cảnh riêng của từng
 * trang (điểm ngày/tháng/năm hoặc lá bài Tarot vừa rút) được nối thêm phía sau khi gọi từ client. */
const BASE_SYSTEM_PROMPT = `Bạn là trợ lý huyền học của DaZiST — một web tổng hợp Bát Tự, Chiêm tinh học Tây phương, Thần số học và Tử Vi.
Trả lời bằng tiếng Việt, giọng điệu ấm áp, rõ ràng, không mê tín cực đoan — xem huyền học là công cụ tự soi chiếu, không phải lời tiên tri tuyệt đối.
Chỉ dựa vào dữ liệu lá số được cung cấp trong bối cảnh bên dưới để trả lời; nếu câu hỏi vượt ngoài dữ liệu đó, trả lời chung theo kiến thức huyền học phổ quát và nói rõ đây là tham khảo chung, không phải suy từ lá số của người dùng.
Không đưa lời khuyên y tế, pháp lý hay tài chính mang tính quyết định — chỉ định hướng tham khảo.
Trả lời ngắn gọn, súc tích (3-6 câu), trừ khi người dùng yêu cầu giải thích sâu hơn.`;

const GEMINI_MODEL = "gemini-2.0-flash";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server chưa cấu hình GEMINI_API_KEY. Vào Netlify → Site settings → Environment variables để thêm.",
      }),
    };
  }

  let payload: { messages?: ChatMessage[]; context?: string };
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Body không hợp lệ." }) };
  }

  const { messages, context } = payload;
  if (!Array.isArray(messages) || messages.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: "Thiếu messages." }) };
  }
  if (messages.length > 40) {
    return { statusCode: 400, body: JSON.stringify({ error: "Hội thoại quá dài." }) };
  }

  const systemInstructionText = context
    ? `${BASE_SYSTEM_PROMPT}\n\n--- Bối cảnh lá số / lượt xem hiện tại ---\n${context}`
    : BASE_SYSTEM_PROMPT;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstructionText }] },
          contents: messages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
          generationConfig: { maxOutputTokens: 700 },
        }),
      },
    );

    if (!res.ok) {
      const errText = await res.text();
      return { statusCode: res.status, body: JSON.stringify({ error: `Lỗi từ Gemini API: ${errText}` }) };
    }

    const data = (await res.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const reply = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
    return { statusCode: 200, body: JSON.stringify({ reply }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: `Lỗi khi gọi AI: ${String(err)}` }) };
  }
};
