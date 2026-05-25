import { useState, useRef, useEffect } from "react";
import { Upload, MessageSquare, Trash2, FileText, Send, X, ChevronDown, ChevronUp, Database, BookOpen, Loader2, Plus, AlertTriangle } from "lucide-react";

/* ── types ─────────────────────────────────────────── */
interface UserDocument { id: number; title: string; content: string; chunkCount: string; createdAt: string; }
interface ChatMessage { role: "user" | "assistant"; content: string; sources?: Source[]; streaming?: boolean; }
interface Source { type: "document" | "knowledge"; label: string; }

/* ── api helpers ────────────────────────────────────── */
const API = "/api";
async function apiFetch(path: string, opts?: RequestInit) {
  const r = await fetch(`${API}${path}`, { credentials: "include", ...opts });
  if (!r.ok) throw new Error(await r.text());
  return r;
}

/* ── upload modal ────────────────────────────────────── */
function UploadModal({ onClose, onUploaded }: { onClose: () => void; onUploaded: (doc: UserDocument) => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const upload = async () => {
    if (!title.trim() || !content.trim()) { setError("Both title and content are required."); return; }
    setLoading(true); setError("");
    try {
      const r = await apiFetch("/rag/documents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: title.trim(), content: content.trim() }) });
      const doc = await r.json();
      onUploaded(doc);
    } catch (e: any) { setError(e.message || "Upload failed"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
      <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, width: "min(640px, 95vw)", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text1)" }}>Upload Document</div>
            <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)" }}>Paste text content — contracts, policies, agreements, filings</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)" }}><X className="w-4 h-4" /></button>
        </div>
        <div style={{ padding: 20, flex: 1, overflowY: "auto" }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 6 }}>Document Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Supplier NDA — Acme Corp"
              style={{ width: "100%", boxSizing: "border-box", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "var(--text1)", outline: "none", fontFamily: "var(--mono)" }} />
          </div>
          <div>
            <label style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", display: "block", marginBottom: 6 }}>Document Content</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Paste your contract, policy, procedure, or regulatory filing text here…" rows={14}
              style={{ width: "100%", boxSizing: "border-box", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", fontSize: 11, color: "var(--text1)", resize: "vertical", outline: "none", lineHeight: 1.7, fontFamily: "var(--mono)" }} />
            <div style={{ fontSize: 9, color: "var(--text3)", fontFamily: "var(--mono)", marginTop: 4 }}>{content.length.toLocaleString()} chars · ~{Math.ceil(content.length / 600)} chunks</div>
          </div>
          {error && <div style={{ marginTop: 10, padding: "8px 12px", background: "rgba(240,68,56,0.08)", border: "1px solid rgba(240,68,56,0.2)", borderRadius: 7, fontSize: 10, color: "var(--red)" }}>{error}</div>}
        </div>
        <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: 7, border: "1px solid var(--border)", background: "transparent", cursor: "pointer", fontSize: 11, color: "var(--text2)" }}>Cancel</button>
          <button onClick={upload} disabled={loading || !title.trim() || !content.trim()}
            style={{ padding: "8px 20px", borderRadius: 7, border: "none", cursor: loading ? "not-allowed" : "pointer", fontSize: 11, fontWeight: 700, background: "#c8f135", color: "#09090a", display: "flex", alignItems: "center", gap: 6, opacity: loading ? 0.7 : 1 }}>
            {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Uploading…</> : <><Upload className="w-3.5 h-3.5" />Upload & Index</>}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── source badge ──────────────────────────────────── */
function SourceBadge({ source }: { source: Source }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 8, fontFamily: "var(--mono)", padding: "2px 7px", borderRadius: 4, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px",
      background: source.type === "document" ? "rgba(200,241,53,0.1)" : "rgba(0,188,242,0.1)",
      color: source.type === "document" ? "#c8f135" : "#00BCF2",
      border: `1px solid ${source.type === "document" ? "rgba(200,241,53,0.2)" : "rgba(0,188,242,0.2)"}`,
    }}>
      {source.type === "document" ? <FileText className="w-2.5 h-2.5" /> : <Database className="w-2.5 h-2.5" />}
      {source.label.length > 40 ? source.label.slice(0, 40) + "…" : source.label}
    </span>
  );
}

/* ── chat bubble ─────────────────────────────────────── */
function ChatBubble({ msg }: { msg: ChatMessage }) {
  const [showSources, setShowSources] = useState(false);
  const isUser = msg.role === "user";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: isUser ? "flex-end" : "flex-start", gap: 4, marginBottom: 12 }}>
      <div style={{ maxWidth: "85%", padding: "10px 14px", borderRadius: isUser ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
        background: isUser ? "#c8f135" : "var(--bg3)",
        color: isUser ? "#09090a" : "var(--text1)",
        fontSize: 12, lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
        {msg.content}
        {msg.streaming && <span style={{ display: "inline-block", width: 6, height: 12, background: "currentColor", animation: "blink 1s step-end infinite", marginLeft: 2, opacity: 0.7, borderRadius: 1 }} />}
      </div>
      {msg.sources && msg.sources.length > 0 && (
        <div style={{ maxWidth: "85%" }}>
          <button onClick={() => setShowSources(s => !s)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 9, color: "var(--text3)", fontFamily: "var(--mono)", display: "flex", alignItems: "center", gap: 3, padding: "2px 4px" }}>
            {showSources ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
            {msg.sources.length} source{msg.sources.length > 1 ? "s" : ""}
          </button>
          {showSources && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
              {msg.sources.map((s, i) => <SourceBadge key={i} source={s} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── main component ─────────────────────────────────── */
export default function DocumentQA() {
  const [docs, setDocs] = useState<UserDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<UserDocument | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    apiFetch("/rag/documents")
      .then(r => r.json())
      .then(setDocs)
      .catch(() => {})
      .finally(() => setLoadingDocs(false));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectDoc = (doc: UserDocument) => {
    setSelectedDoc(doc);
    setMessages([{
      role: "assistant",
      content: `Document loaded: **${doc.title}**\n\nI've indexed this document into ${doc.chunkCount} searchable chunks. Ask me anything about it — I'll retrieve the most relevant sections and answer using both this document and my Canadian compliance knowledge base.`,
    }]);
  };

  const deleteDoc = async (doc: UserDocument) => {
    setDeleting(doc.id);
    try {
      await apiFetch(`/rag/documents/${doc.id}`, { method: "DELETE" });
      setDocs(d => d.filter(x => x.id !== doc.id));
      if (selectedDoc?.id === doc.id) { setSelectedDoc(null); setMessages([]); }
    } catch (_) {}
    setDeleting(null);
  };

  const send = async () => {
    const q = input.trim();
    if (!q || sending) return;
    setInput("");
    setSending(true);

    setMessages(m => [...m, { role: "user", content: q }]);
    setMessages(m => [...m, { role: "assistant", content: "", streaming: true, sources: [] }]);

    try {
      const endpoint = selectedDoc
        ? `/rag/documents/${selectedDoc.id}/chat`
        : `/rag/search`;

      if (!selectedDoc) {
        // Knowledge-base only search
        const r = await apiFetch("/rag/search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: q }) });
        const { results } = await r.json();
        const answer = results.length
          ? `Here are the most relevant sections from the CanCompliance knowledge base:\n\n${results.map((c: any, i: number) => `**${i + 1}. ${c.title}** (${c.source})\n${c.content}`).join("\n\n")}`
          : "No matching content found in the knowledge base for that query. Try a more specific compliance question.";
        setMessages(m => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: answer, sources: results.map((c: any) => ({ type: "knowledge" as const, label: c.title })) };
          return copy;
        });
        setSending(false);
        return;
      }

      const response = await fetch(`/api${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });

      if (!response.ok) throw new Error("Request failed");
      if (!response.body) throw new Error("No stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let sources: Source[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.sources) { sources = data.sources; }
            if (data.content) {
              setMessages(m => {
                const copy = [...m];
                const last = copy[copy.length - 1];
                copy[copy.length - 1] = { ...last, content: (last.content || "") + data.content, sources };
                return copy;
              });
            }
            if (data.done) {
              setMessages(m => {
                const copy = [...m];
                copy[copy.length - 1] = { ...copy[copy.length - 1], streaming: false };
                return copy;
              });
            }
          } catch (_) {}
        }
      }
    } catch (e: any) {
      setMessages(m => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: "Something went wrong. Please try again.", streaming: false };
        return copy;
      });
    }
    setSending(false);
  };

  return (
    <div className="page-content" style={{ padding: 0, height: "calc(100vh - 56px)", display: "flex", overflow: "hidden" }}>

      {/* ── left panel: document library ─────────────── */}
      <div style={{ width: 260, flexShrink: 0, borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", background: "var(--bg2)" }}>
        {/* Header */}
        <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text1)" }}>Document Library</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px", marginTop: 2 }}>RAG-indexed</div>
            </div>
            <button onClick={() => setShowUpload(true)} data-testid="upload-doc-btn"
              style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid var(--border)", background: "var(--bg3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plus className="w-3.5 h-3.5" style={{ color: "var(--text2)" }} />
            </button>
          </div>
          {/* Knowledge base badge */}
          <button onClick={() => { setSelectedDoc(null); setMessages([]); }}
            style={{ width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 7, border: `1px solid ${!selectedDoc ? "rgba(0,188,242,0.4)" : "var(--border)"}`, background: !selectedDoc ? "rgba(0,188,242,0.08)" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <Database className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#00BCF2" }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: !selectedDoc ? "#00BCF2" : "var(--text2)" }}>Compliance Knowledge Base</div>
              <div style={{ fontSize: 9, color: "var(--text3)", fontFamily: "var(--mono)" }}>CASL · PIPEDA · AODA · 40+ chunks</div>
            </div>
          </button>
        </div>

        {/* Document list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px" }}>
          {loadingDocs ? (
            <div style={{ textAlign: "center", padding: 20 }}><Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--text3)", margin: "0 auto" }} /></div>
          ) : docs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 8px" }}>
              <FileText className="w-6 h-6" style={{ color: "var(--text3)", margin: "0 auto 8px" }} />
              <div style={{ fontSize: 10, color: "var(--text3)", lineHeight: 1.6 }}>No documents yet. Upload a contract, policy, or agreement to get started.</div>
            </div>
          ) : (
            <div className="space-y-2">
              {docs.map(doc => (
                <div key={doc.id}
                  style={{ borderRadius: 8, border: `1px solid ${selectedDoc?.id === doc.id ? "rgba(200,241,53,0.3)" : "var(--border)"}`, background: selectedDoc?.id === doc.id ? "rgba(200,241,53,0.05)" : "transparent", overflow: "hidden" }}>
                  <button onClick={() => selectDoc(doc)} style={{ width: "100%", textAlign: "left", padding: "9px 10px", background: "none", border: "none", cursor: "pointer" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: selectedDoc?.id === doc.id ? "#c8f135" : "var(--text1)", lineHeight: 1.3, marginBottom: 3, wordBreak: "break-word" }}>{doc.title}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text3)" }}>{doc.chunkCount} chunks</span>
                      <span style={{ fontSize: 8, color: "var(--text3)" }}>·</span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text3)" }}>{new Date(doc.createdAt).toLocaleDateString("en-CA")}</span>
                    </div>
                  </button>
                  <div style={{ padding: "0 8px 8px", display: "flex", justifyContent: "flex-end" }}>
                    <button onClick={() => deleteDoc(doc)} disabled={deleting === doc.id}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                      {deleting === doc.id ? <Loader2 className="w-3 h-3 animate-spin" style={{ color: "var(--text3)" }} /> : <Trash2 className="w-3 h-3" style={{ color: "var(--text3)" }} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
          <div style={{ fontSize: 9, color: "var(--text3)", lineHeight: 1.6 }}>
            Documents are chunked into ~600-char segments and indexed with PostgreSQL full-text search. RAG retrieves the most relevant chunks per query.
          </div>
        </div>
      </div>

      {/* ── right panel: chat ──────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Chat header */}
        <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", background: "var(--bg2)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {selectedDoc
              ? <><FileText className="w-4 h-4 flex-shrink-0" style={{ color: "#c8f135" }} /><div><div style={{ fontSize: 12, fontWeight: 700, color: "var(--text1)" }}>{selectedDoc.title}</div><div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text3)" }}>{selectedDoc.chunkCount} chunks · RAG + compliance knowledge</div></div></>
              : <><Database className="w-4 h-4 flex-shrink-0" style={{ color: "#00BCF2" }} /><div><div style={{ fontSize: 12, fontWeight: 700, color: "var(--text1)" }}>Compliance Knowledge Base</div><div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text3)" }}>CASL · PIPEDA · AODA · Law 25 · Employment · FINTRAC + more</div></div></>
            }
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 20, border: "1px solid rgba(0,188,242,0.2)", background: "rgba(0,188,242,0.05)" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#00BCF2", animation: "pulse 2s infinite" }} />
              <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "#00BCF2", textTransform: "uppercase", letterSpacing: "1px" }}>RAG Active</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 40px" }}>
              <MessageSquare className="w-10 h-10" style={{ color: "var(--text3)", margin: "0 auto 16px" }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text2)", marginBottom: 8 }}>
                {selectedDoc ? `Ask anything about "${selectedDoc.title}"` : "Ask the Compliance Knowledge Base"}
              </div>
              <div style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.7, maxWidth: 400, margin: "0 auto" }}>
                {selectedDoc
                  ? "I'll retrieve the most relevant sections from this document and the compliance knowledge base to ground my answer."
                  : "Select a document from the library to query it, or ask a general Canadian compliance question to search the knowledge base."}
              </div>
              {!selectedDoc && (
                <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                  {["What are the CASL consent requirements?", "PIPEDA breach notification timeline", "AODA penalties for non-compliance", "What is Bill C-27 CPPA?"].map(q => (
                    <button key={q} onClick={() => { setInput(q); setTimeout(send, 50); }}
                      style={{ padding: "6px 12px", borderRadius: 20, border: "1px solid var(--border)", background: "var(--bg2)", cursor: "pointer", fontSize: 10, color: "var(--text2)" }}>
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {messages.map((m, i) => <ChatBubble key={i} msg={m} />)}
          <div ref={chatEndRef} />
        </div>

        {/* Input bar */}
        <div style={{ padding: "12px 20px 16px", borderTop: "1px solid var(--border)", background: "var(--bg2)", flexShrink: 0 }}>
          {!selectedDoc && (
            <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.15)", borderRadius: 6 }}>
              <AlertTriangle className="w-3 h-3 flex-shrink-0" style={{ color: "var(--amber)" }} />
              <span style={{ fontSize: 9, color: "var(--text3)", fontFamily: "var(--mono)" }}>Knowledge base search mode — upload a document for document-specific Q&A</span>
            </div>
          )}
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={selectedDoc ? `Ask about "${selectedDoc.title}"…` : "Search the compliance knowledge base…"}
              rows={2} data-testid="chat-input"
              style={{ flex: 1, background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "var(--text1)", resize: "none", outline: "none", lineHeight: 1.6, fontFamily: "inherit" }} />
            <button onClick={send} disabled={sending || !input.trim()} data-testid="send-btn"
              style={{ width: 40, height: 40, borderRadius: 10, border: "none", cursor: sending || !input.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: sending || !input.trim() ? "var(--bg3)" : "#c8f135", color: sending || !input.trim() ? "var(--text3)" : "#09090a" }}>
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <div style={{ marginTop: 6, fontSize: 9, color: "var(--text3)", textAlign: "center", fontFamily: "var(--mono)" }}>
            RAG retrieves relevant chunks · Claude Sonnet generates answer · Sources attributed per response
          </div>
        </div>
      </div>

      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} onUploaded={doc => { setDocs(d => [doc, ...d]); selectDoc(doc); setShowUpload(false); }} />
      )}

      <style>{`
        @keyframes blink { 0%,100% { opacity: 1 } 50% { opacity: 0 } }
        @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.4 } }
      `}</style>
    </div>
  );
}
