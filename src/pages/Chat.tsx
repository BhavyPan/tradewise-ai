import { useRef, useState, useEffect, useCallback } from "react";
import { Send, Loader2, MessageSquare, Sparkles, AlertCircle, X } from "lucide-react";
import { Sidebar } from "@/components/trademind/Sidebar";
import { TopBar } from "@/components/trademind/TopBar";
import { createChatCompletion, generateId, ChatMessage } from "@/integrations/claude/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content: `Hi! I'm TradeWise AI. I can help you with:

• Understanding stock fundamentals and metrics
• Explaining trading strategies and concepts
• Analyzing market trends and patterns
• Learning about different asset classes
• Interpreting financial news

Note: I'm an educational assistant, not a financial advisor. Always do your own research before investing.

What would you like to know?`,
  timestamp: Date.now(),
};

const ChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Use a ref to always have the latest messages without stale closure issues
  const messagesRef = useRef<ChatMessage[]>([WELCOME_MESSAGE]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, error]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    const assistantMessage: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      // Use messagesRef to get the latest messages including the new ones
      const conversationMessages = [...messagesRef.current];
      const response = await createChatCompletion(conversationMessages);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id ? { ...m, content: response } : m
        )
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
      toast.error(msg);
      // Remove the failed assistant message, keep the user message
      setMessages((prev) => {
        const userExists = prev.some((m) => m.id === userMessage.id);
        return userExists
          ? prev.filter((m) => m.id !== assistantMessage.id)
          : prev;
      });
    } finally {
      setLoading(false);
    }
  }, [input, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    messagesRef.current = [WELCOME_MESSAGE];
    setError(null);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />

      <main className="flex-1 p-5 md:p-8 max-w-[1400px] mx-auto w-full flex flex-col">
        <TopBar
          title="Chat with TradeWise AI"
          subtitle="Ask questions about stocks, trading, and markets."
        />

        {/* Chat container */}
        <div className="flex-1 flex flex-col rounded-3xl bg-card border border-border shadow-sm mt-4 overflow-hidden">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" && "flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm",
                    msg.role === "assistant"
                      ? "bg-gradient-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {msg.role === "assistant" ? (
                    <Sparkles className="w-4 h-4" />
                  ) : (
                    <MessageSquare className="w-4 h-4" />
                  )}
                </div>

                <div
                  className={cn(
                    "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words",
                    msg.role === "assistant"
                      ? "bg-secondary/70 text-foreground"
                      : "bg-gradient-primary text-primary-foreground"
                  )}
                >
                  {msg.content ||
                    (msg.id === messages[messages.length - 1]?.id && loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    ) : null)}
                </div>
              </div>
            ))}

            {error && (
              <div className="flex gap-3 items-start bg-danger/10 border border-danger/20 rounded-2xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-danger flex-shrink-0 mt-0.5" />
                <p className="text-sm text-danger">{error}</p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-4 md:p-5 border-t border-border bg-secondary/20">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about stocks, trading, or markets…"
                  rows={1}
                  className="w-full resize-none bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 max-h-40 overflow-y-auto"
                  style={{ minHeight: "48px" }}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center transition-all flex-shrink-0",
                  input.trim() && !loading
                    ? "bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
                    : "bg-secondary text-muted-foreground cursor-not-allowed"
                )}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 px-1">
              <p className="text-[10px] text-muted-foreground">
                Press Enter to send · Shift+Enter for new line
              </p>
              {messages.length > 1 && (
                <button
                  onClick={clearChat}
                  className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  <X className="w-3 h-3" /> Clear chat
                </button>
              )}
            </div>
          </div>
        </div>

        <footer className="text-center text-xs text-muted-foreground py-4 mt-4">
          TradeMind AI · Educational assistant · Not financial advice ·{" "}
          <a
            href="https://anthropic.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Powered by Claude
          </a>
        </footer>
      </main>
    </div>
  );
};

export default ChatPage;
