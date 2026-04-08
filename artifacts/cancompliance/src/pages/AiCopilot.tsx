import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import {
  useListAnthropicConversations,
  useCreateAnthropicConversation,
  useListAnthropicMessages,
  useDeleteAnthropicConversation,
  getListAnthropicConversationsQueryKey,
  getListAnthropicMessagesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Send, Bot, Globe, Shield } from "lucide-react";
import { Link } from "wouter";

const CONSENT_KEY = "cancompliance_ai_consent_v1";

const QUICK_PROMPTS = [
  "Is my CASL consent compliant if I use a pre-checked checkbox?",
  "What does PIPEDA say about sharing customer data with third parties?",
  "Do I need French labels in Quebec for online-only products?",
  "What are the WSIB reporting deadlines for new employers in Ontario?",
  "Explain the key Bill 96 requirements for e-commerce businesses",
  "What are the new Ontario employment standards for remote workers?",
];

interface Message {
  id: number;
  conversationId: number;
  role: string;
  content: string;
  createdAt: string;
}

function AiConsentGate({ onConsent }: { onConsent: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#c8f135" }}>
            <Bot className="w-4 h-4 text-[#09090a]" />
          </div>
          <div>
            <div className="font-semibold text-foreground text-sm">CanCompliance AI Copilot</div>
            <div className="text-xs text-muted-foreground font-mono">Powered by Anthropic Claude</div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <p className="text-sm text-foreground font-medium">Before using the AI Copilot, please review how your data is processed:</p>

          <div className="bg-muted rounded-lg p-4 space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Globe className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-foreground font-medium mb-0.5">Cross-border data transfer</div>
                <div className="text-muted-foreground text-xs">Your questions are sent to <span className="text-foreground">Anthropic PBC</span> in the United States to generate responses. This is a cross-border transfer under PIPEDA.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#c8f135" }} />
              <div>
                <div className="text-foreground font-medium mb-0.5">What we store</div>
                <div className="text-muted-foreground text-xs">Your conversation history is stored in our database, scoped to your account. You can delete it anytime from Account settings.</div>
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-2">
            Do not enter personal information about third parties (e.g., employee names, client data) in the AI Copilot.
          </div>
        </div>

        <button
          data-testid="btn-ai-consent"
          onClick={onConsent}
          className="w-full py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
          style={{ background: "#c8f135", color: "#09090a" }}
        >
          I understand — start asking compliance questions
        </button>

        <div className="text-center mt-3">
          <Link href="/privacy-policy">
            <span className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2">Read our Privacy Policy</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AiCopilot() {
  const [selectedConvId, setSelectedConvId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [hasConsented, setHasConsented] = useState(() => localStorage.getItem(CONSENT_KEY) === "true");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const handleConsent = () => {
    localStorage.setItem(CONSENT_KEY, "true");
    setHasConsented(true);
  };

  const { data: conversations = [] } = useListAnthropicConversations();
  const { data: messages = [] } = useListAnthropicMessages(selectedConvId ?? 0, {
    query: {
      enabled: !!selectedConvId,
      queryKey: getListAnthropicMessagesQueryKey(selectedConvId ?? 0),
    },
  });

  const createConv = useCreateAnthropicConversation({
    mutation: {
      onSuccess: (conv) => {
        queryClient.invalidateQueries({ queryKey: getListAnthropicConversationsQueryKey() });
        setSelectedConvId(conv.id);
      },
    },
  });

  const deleteConv = useDeleteAnthropicConversation({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAnthropicConversationsQueryKey() });
        setSelectedConvId(null);
      },
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  const startNewConversation = async (firstMessage?: string) => {
    const title = firstMessage ? firstMessage.slice(0, 50) + "..." : "New compliance question";
    createConv.mutate({ data: { title } });
    if (firstMessage) {
      setInput(firstMessage);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isStreaming) return;

    let convId = selectedConvId;
    if (!convId) {
      return;
    }

    setInput("");
    setIsStreaming(true);
    setStreamingContent("");

    await queryClient.setQueryData(
      getListAnthropicMessagesQueryKey(convId),
      [...(messages as Message[]), { id: Date.now(), conversationId: convId, role: "user", content, createdAt: new Date().toISOString() }]
    );

    try {
      const baseUrl = import.meta.env.BASE_URL || "/";
      const apiBase = baseUrl === "/" ? "" : baseUrl.replace(/\/$/, "");
      const response = await fetch(`${apiBase}/api/anthropic/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                fullContent += data.content;
                setStreamingContent(fullContent);
              }
              if (data.done) {
                setStreamingContent("");
                await queryClient.invalidateQueries({ queryKey: getListAnthropicMessagesQueryKey(convId!) });
              }
            } catch {
              // skip
            }
          }
        }
      }
    } catch (err) {
      setStreamingContent("Sorry, there was an error connecting to the AI. Please try again.");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSend = () => sendMessage(input);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickPrompt = async (prompt: string) => {
    if (!selectedConvId) {
      const title = prompt.slice(0, 50) + "...";
      createConv.mutate(
        { data: { title } },
        {
          onSuccess: async (conv) => {
            queryClient.invalidateQueries({ queryKey: getListAnthropicConversationsQueryKey() });
            setSelectedConvId(conv.id);
            setTimeout(() => {
              sendMessage(prompt);
            }, 300);
          },
        }
      );
    } else {
      sendMessage(prompt);
    }
  };

  const allMessages = selectedConvId
    ? [
        ...(messages as Message[]),
        ...(streamingContent ? [{ id: -1, conversationId: selectedConvId, role: "assistant", content: streamingContent, createdAt: new Date().toISOString() }] : []),
      ]
    : [];

  return (
    <AppLayout title="AI Copilot" subtitle="Claude-powered compliance expert">
      {!hasConsented ? (
        <AiConsentGate onConsent={handleConsent} />
      ) : (
      <div className="flex gap-6 h-[calc(100vh-10rem)]">
        {/* Sidebar */}
        <div className="w-56 flex-shrink-0 flex flex-col gap-3">
          <button
            data-testid="btn-new-conversation"
            onClick={() => startNewConversation()}
            disabled={createConv.isPending}
            className="w-full py-2.5 rounded-lg font-semibold text-[12px] hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            style={{ background: "#c8f135", color: "#09090a" }}
          >
            <Plus className="w-4 h-4" />
            New Conversation
          </button>

          <div className="flex-1 overflow-y-auto space-y-1">
            {(conversations as Array<{ id: number; title: string; createdAt: string }>).map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                data-testid={`conversation-${conv.id}`}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer group transition-colors ${
                  selectedConvId === conv.id ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                <Bot className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-[12px] flex-1 truncate">{conv.title}</span>
                <button
                  data-testid={`btn-delete-conv-${conv.id}`}
                  onClick={(e) => { e.stopPropagation(); deleteConv.mutate({ id: conv.id }); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-fail"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            {conversations.length === 0 && (
              <div className="text-center py-8 text-[12px] text-muted-foreground">
                No conversations yet
              </div>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
          {!selectedConvId ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <Bot className="w-12 h-12 text-primary mb-4" />
              <h2 className="font-serif italic text-2xl text-foreground mb-2">CanCompliance AI Copilot</h2>
              <p className="text-[13px] text-muted-foreground text-center max-w-md mb-8">
                Ask any question about Canadian compliance — CASL, PIPEDA, Bill 96, employment law, and more. Every answer cites the exact statute.
              </p>
              <div className="grid grid-cols-2 gap-2 w-full max-w-xl">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    data-testid={`quick-prompt-${prompt.slice(0, 20).toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="px-3 py-2.5 rounded-lg bg-muted border border-border text-[12px] text-muted-foreground hover:text-foreground hover:border-border/80 transition-all text-left leading-relaxed"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {allMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="grid grid-cols-2 gap-2 w-full max-w-xl">
                      {QUICK_PROMPTS.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => handleQuickPrompt(prompt)}
                          className="px-3 py-2.5 rounded-lg bg-muted border border-border text-[12px] text-muted-foreground hover:text-foreground hover:border-border/80 transition-all text-left leading-relaxed"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {allMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-xl px-4 py-3 text-[13px] leading-relaxed ${
                        msg.role === "user"
                          ? "text-[#09090a]"
                          : "bg-muted text-foreground"
                      }`}
                      style={msg.role === "user" ? { background: "#c8f135" } : undefined}
                    >
                      {msg.id === -1 && isStreaming && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                            ))}
                          </div>
                          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">Generating...</span>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-border p-4">
                <div className="text-[10px] text-muted-foreground font-mono mb-2 text-center">
                  Not legal advice. Always consult a qualified Canadian lawyer for your specific situation.
                </div>
                <div className="flex gap-3">
                  <textarea
                    data-testid="input-message"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a compliance question..."
                    rows={1}
                    className="flex-1 bg-muted border border-border rounded-lg px-4 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                  <button
                    data-testid="btn-send-message"
                    onClick={handleSend}
                    disabled={!input.trim() || isStreaming}
                    className="px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    style={{ background: "#c8f135", color: "#09090a" }}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      )}
    </AppLayout>
  );
}
