export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Gọi hàm serverless Netlify (netlify/functions/chat.ts) — API key AI được giữ ở server (biến môi trường),
 * không bao giờ lộ ra trình duyệt. Chỉ hoạt động khi chạy qua Netlify (netlify dev hoặc bản đã deploy);
 * chạy bằng "vite dev" thường sẽ không có route /.netlify/functions/* nên sẽ báo lỗi rõ ràng bên dưới.
 */
export async function sendChatMessage(messages: ChatMessage[], context: string): Promise<string> {
  let res: Response;
  try {
    res = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages, context }),
    });
  } catch {
    throw new Error("Không thể kết nối tới máy chủ. Kiểm tra lại kết nối mạng.");
  }

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(
        'Chatbot chưa hoạt động ở môi trường này — cần chạy qua Netlify ("netlify dev" hoặc bản đã deploy), không phải "npm run dev" thông thường.',
      );
    }
    let errMsg = "Không thể kết nối tới trợ lý AI.";
    try {
      const data = await res.json();
      if (data?.error) errMsg = data.error;
    } catch {
      // giữ nguyên thông báo mặc định nếu body không phải JSON
    }
    throw new Error(errMsg);
  }

  const data = (await res.json()) as { reply?: string };
  return data.reply ?? "";
}
