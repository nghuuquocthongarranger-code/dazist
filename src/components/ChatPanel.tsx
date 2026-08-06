import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sendChatMessage, type ChatMessage } from "../lib/chatClient";

interface Props {
  eyebrow: string;
  title: string;
  placeholder: string;
  /** Bối cảnh riêng (điểm ngày/lá bài vừa rút...) được gửi kèm mỗi lượt hỏi để AI trả lời đúng trọng tâm. */
  context: string;
  /** Vài câu hỏi gợi ý — bấm vào sẽ điền và gửi luôn. */
  suggestions?: string[];
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-gold-soft/70"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

export function ChatPanel({ eyebrow, title, placeholder, context, suggestions }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);
    try {
      const reply = await sendChatMessage(next, context);
      setMessages((cur) => [...cur, { role: "assistant", content: reply || "(Không có phản hồi)" }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl p-5 sm:p-6 bg-white/5 border border-white/10">
      <p className="text-xs uppercase tracking-wider text-gold/70 mb-1">{eyebrow}</p>
      <p className="font-display text-lg text-gradient-gold font-semibold mb-3">{title}</p>

      {messages.length === 0 && suggestions && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="text-xs rounded-full px-3 py-1.5 border border-gold/30 text-gold-soft/90 hover:border-gold/60 hover:bg-gold/5 transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {messages.length > 0 && (
        <div ref={scrollRef} className="no-scrollbar max-h-80 overflow-y-auto space-y-3 mb-4 pr-1">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-gold/15 border border-gold/30 text-gold-soft"
                      : "bg-black/25 border border-white/10 text-white/80"
                  }`}
                >
                  {m.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-2.5 bg-black/25 border border-white/10">
                <TypingDots />
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-hoa bg-hoa/10 border border-hoa/30 rounded-xl px-3 py-2.5 mb-3 leading-relaxed">
          {error}
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={loading}
          className="flex-1 bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-gold focus:ring-2 focus:ring-gold/40 transition min-h-[44px] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="shrink-0 min-h-[44px] rounded-xl px-4 py-3 text-sm border border-gold/40 text-gold-soft hover:bg-gold/10 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Gửi
        </button>
      </form>
    </div>
  );
}
