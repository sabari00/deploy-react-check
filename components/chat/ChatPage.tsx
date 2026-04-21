"use client";

import { useState, useRef, useEffect } from "react";
import {
  getSessions,
  createSession as apiCreateSession,
  getSession,
  deleteSession as apiDeleteSession,
  sendChatMessage,
  type Session as ApiSession,
  type ChatMessage,
} from "@/lib/chat-api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Session {
  id: string;
  userName: string;
  avatar: string;
  messages: Message[];
  createdAt: Date;
}

const PRESET_USERS = ["rajesh.kumar@email.com", "priya.mehta@email.com", "amit.sharma@email.com", "sunita.reddy@email.com", "vikram.patel@email.com", "m.sabarinathan@fundsindia.com"];

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#6366f1,#8b5cf6)",
  "linear-gradient(135deg,#06b6d4,#6366f1)",
  "linear-gradient(135deg,#10b981,#06b6d4)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
];

const MOCK_RESPONSES = [
  "Based on the client's portfolio, their equity allocation sits at 68% — above the recommended 60% for their risk profile. I'd suggest discussing rebalancing into debt instruments this quarter.",
  "The Nifty 50 gained 4.2% this quarter with strong momentum in IT and banking sectors. For clients with moderate risk appetite, this is a good entry point for index fund exposure.",
  "Given the client's monthly surplus, I'd recommend splitting across large-cap and hybrid funds for optimal diversification.",
  "The client's SIP has delivered strong CAGR over 3 years — above the category average. This is a strong talking point for the upcoming client review.",
  "For a 5-year horizon with moderate risk, Balanced Advantage Funds are well-suited — they auto-rebalance between equity and debt based on market valuation, reducing timing risk.",
];

function genId() { return Math.random().toString(36).slice(2, 9); }
function getGradient(avatar: string) { return AVATAR_GRADIENTS[avatar.charCodeAt(0) % AVATAR_GRADIENTS.length]; }
function fmtTime(d: Date) { return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }); }
function initials(name: string) { return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2); }

function TypingBubble() {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 12 }}>
      <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0, marginTop: 2 }}>🤖</div>
      <div style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "16px 16px 16px 4px", padding: "12px 16px", display: "flex", gap: 5, alignItems: "center" }}>
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  );
}

function mapApiMessageToMessage(msg: ChatMessage, index: number): Message {
  return {
    id: `msg-${index}`,
    role: msg.role === "assistant" ? "assistant" : "user",
    content: msg.content,
    timestamp: new Date(msg.timestamp),
  };
}

function mapApiSessionToSession(session: ApiSession, messages: Message[] = []): Session {
  const clientEmail = session.client?.email || "";
  const clientName = clientEmail.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  return {
    id: session.session_id,
    userName: clientName || session.client?.name || "Unknown",
    avatar: initials(clientName || session.client?.name || "UK"),
    messages,
    createdAt: new Date(session.created_at),
  };
}

export default function ChatPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [customName, setCustomName] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const active = sessions.find(s => s.id === activeId) ?? null;

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [active?.messages, typing]);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    try {
      const apiSessions = await getSessions();
      if (apiSessions.length === 0) {
        setSessions([]);
        return;
      }
      const mappedSessions = await Promise.all(
        apiSessions.map(async (s: ApiSession) => {
          try {
            const detail = await getSession(s.session_id);
            return mapApiSessionToSession(s, detail.conversation_history?.map((m, i) => mapApiMessageToMessage(m, i)) || []);
          } catch {
            return mapApiSessionToSession(s, []);
          }
        })
      );
      setSessions(mappedSessions);
    } catch (error) {
      console.error("Failed to load sessions:", error);
      setSessions([]);
    }
  }

  async function handleCreateSession(email: string) {
    setLoading(true);
    const clientIdentifier = email.toLowerCase().trim();
    const displayName = clientIdentifier.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, c => c.toUpperCase());
    try {
      const apiSession = await apiCreateSession(clientIdentifier);
      const welcome: Message = {
        id: genId(),
        role: "assistant",
        timestamp: new Date(),
        content: `Hi! I'm your AI assistant for **${displayName}**'s review. Ask me about their portfolio performance, market updates, SIP recommendations, or talking points.`,
      };
      const session: Session = {
        id: apiSession.session_id,
        userName: displayName,
        avatar: initials(displayName),
        messages: [welcome],
        createdAt: new Date(apiSession.created_at),
      };
      setSessions(p => [session, ...p]);
      setActiveId(session.id);
    } catch (error) {
      console.log("API unavailable, creating local session", error);
      const welcome: Message = {
        id: genId(),
        role: "assistant",
        timestamp: new Date(),
        content: `Hi! I'm your AI assistant for **${displayName}**'s review. (Local mode - backend unavailable)`,
      };
      const session: Session = {
        id: "local-" + genId(),
        userName: displayName,
        avatar: initials(displayName),
        messages: [welcome],
        createdAt: new Date(),
      };
      setSessions(p => [session, ...p]);
      setActiveId(session.id);
    } finally {
      setShowPicker(false);
      setCustomName("");
      setLoading(false);
    }
  }

  async function handleDeleteSession(sessionId: string) {
    if (sessionId.startsWith("local-")) {
      setSessions(p => p.filter(s => s.id !== sessionId));
      if (activeId === sessionId) {
        setActiveId(null);
      }
      return;
    }
    try {
      await apiDeleteSession(sessionId);
      setSessions(p => p.filter(s => s.id !== sessionId));
      if (activeId === sessionId) {
        setActiveId(null);
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  }

  async function send() {
    console.log("send", input, activeId, typing);
    if (!input.trim() || !activeId || typing) return;
    const trimmedInput = input.trim();
    const msg: Message = { id: genId(), role: "user", content: trimmedInput, timestamp: new Date() };
    setSessions(p => p.map(s => s.id === activeId ? { ...s, messages: [...s.messages, msg] } : s));
    setInput("");
    if (textRef.current) textRef.current.style.height = "auto";
    setTyping(true);
    try {
      if (activeId.startsWith("local-")) {
        await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));
        const ai: Message = { id: genId(), role: "assistant", content: MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)], timestamp: new Date() };
        setSessions(p => p.map(s => s.id === activeId ? { ...s, messages: [...s.messages, ai] } : s));
      } else {
        const response = await sendChatMessage(activeId, trimmedInput);
        const aiContent = response.assistant_suggestion?.suggested_response || "No response available";
        const ai: Message = { id: genId(), role: "assistant", content: aiContent, timestamp: new Date() };
        setSessions(p => p.map(s => s.id === activeId ? { ...s, messages: [...s.messages, ai] } : s));
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMsg: Message = { id: genId(), role: "assistant", content: "Sorry, I couldn't process your request. Please try again.", timestamp: new Date() };
      setSessions(p => p.map(s => s.id === activeId ? { ...s, messages: [...s.messages, errorMsg] } : s));
    } finally {
      setTyping(false);
    }
  }

  const bg = "#f8fafc";
  const cardBg = "#ffffff";
  const border = "#e2e8f0";
  const text = "#1e293b";
  const muted = "#64748b";

  return (
    <div style={{ height: "calc(100vh - 64px)", display: "flex", backgroundColor: bg, overflow: "hidden" }}>

      {/* ──── Sidebar ──── */}
      <div style={{ width: 280, borderRight: `1px solid ${border}`, display: "flex", flexDirection: "column", background: "#ffffff", flexShrink: 0 }}>
        {/* Header */}
        <div style={{ padding: "20px 16px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "#e0e7ff", border: "1px solid #c7d2fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>💼</div>
            <div>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: text, margin: 0 }}>RM Sessions</h2>
              <p style={{ fontSize: 11, color: muted, margin: 0 }}>{sessions.length} active session{sessions.length !== 1 ? "s" : ""}</p>
            </div>
          </div>

          <button
            onClick={() => setShowPicker(v => !v)}
            disabled={loading}
            style={{ width: "100%", padding: "10px", borderRadius: 10, border: "none", background: loading ? "rgba(99,102,241,0.5)" : "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", boxShadow: loading ? "none" : "0 4px 16px rgba(99,102,241,0.35)", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
          >
            {loading ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin"><circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
            ) : <span style={{ fontSize: 16 }}>+</span>}
            {loading ? "Creating..." : "New Session"}
          </button>

          {/* Picker */}
          {showPicker && (
            <div className="slide-in-right" style={{ marginTop: 10, background: "#f8fafc", border: `1px solid ${border}`, borderRadius: 12, padding: 12 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: muted, textTransform: "uppercase", letterSpacing: 0.7, margin: "0 0 8px" }}>Select client or enter email</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
                {PRESET_USERS.map(email => {
                  const displayName = email.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, c => c.toUpperCase());
                  return (
                    <button
                      key={email}
                      onClick={() => handleCreateSession(email)}
                      disabled={loading}
                      style={{ background: "#f8fafc", border: `1px solid ${border}`, borderRadius: 8, padding: "8px 10px", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8, color: "#475569", fontSize: 12, textAlign: "left", transition: "background 0.2s", opacity: loading ? 0.5 : 1 }}
                      onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#e0e7ff"; }}
                      onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#f8fafc"; }}
                    >
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: getGradient(initials(displayName)), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{initials(displayName)}</div>
                      {displayName}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  style={{ flex: 1, background: "#f8fafc", border: `1px solid ${border}`, borderRadius: 8, padding: "7px 10px", color: text, fontSize: 12, outline: "none", fontFamily: "inherit", opacity: loading ? 0.5 : 1 }}
                  placeholder="Enter email (e.g. user@email.com)"
                  value={customName}
                  disabled={loading}
                  onChange={e => setCustomName(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && customName.trim() && !loading) handleCreateSession(customName.trim()); }}
                />
                <button
                  onClick={() => customName.trim() && handleCreateSession(customName.trim())}
                  disabled={loading || !customName.trim()}
                  style={{ flexShrink: 0, padding: "7px 12px", borderRadius: 8, border: "none", background: loading || !customName.trim() ? "rgba(99,102,241,0.25)" : "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontSize: 12, fontWeight: 700, cursor: loading || !customName.trim() ? "not-allowed" : "pointer" }}
                >
                  {loading ? "..." : "Go"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.4),transparent)" }} />

        {/* Session list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}>
          {sessions.length === 0 ? (
            <div key={"no_data"} style={{ padding: "28px 12px", textAlign: "center", color: muted, fontSize: 12 }}>
              <div style={{ fontSize: 28, opacity: 0.2, marginBottom: 8 }}>💬</div>
              No sessions yet
            </div>
          ) : sessions.map(s => {
            const isActive = s.id === activeId;
            const last = s.messages.length > 0 ? s.messages[s.messages.length - 1] : null;
            return (
              <div
                key={"data_foun"+s.id}
                onClick={() => setActiveId(s.id)}
                className="fade-in-up"
                style={{ padding: "10px 10px", borderRadius: 10, cursor: "pointer", background: isActive ? "#e0e7ff" : "transparent", border: isActive ? "1px solid #c7d2fe" : "1px solid transparent", marginBottom: 3, transition: "all 0.2s", position: "relative" }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f8fafc"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: getGradient(s.avatar), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0, boxShadow: isActive ? "0 0 12px rgba(99,102,241,0.4)" : "none" }}>
                    {s.avatar}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: isActive ? "#4f46e5" : text, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.userName}</p>
                    <p style={{ fontSize: 10, color: muted, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {s.messages.length} msgs{last ? ` · ${fmtTime(last.timestamp)}` : ""}
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteSession(s.id); }}
                    style={{ padding: "4px 6px", borderRadius: 4, border: "none", background: "transparent", color: muted, cursor: "pointer", fontSize: 12, opacity: 0.6 }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = "#ef4444"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "0.6"; e.currentTarget.style.color = muted; }}
                    title="Delete session"
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ──── Chat area ──── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, backgroundColor: bg }}>
        {active ? (
          <>
            {/* Chat header */}
            <div style={{ padding: "14px 22px", borderBottom: `1px solid ${border}`, background: "#ffffff", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: getGradient(active.avatar), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#fff", boxShadow: "0 4px 14px rgba(99,102,241,0.2)", flexShrink: 0 }}>
                {active.avatar}
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: text, margin: 0 }}>{active.userName}</h3>
                <p style={{ fontSize: 11, color: muted, margin: 0 }}>Client session · {fmtTime(active.createdAt)}</p>
              </div>
              <div style={{ marginLeft: "auto", padding: "5px 12px", borderRadius: 999, background: "#e0e7ff", border: "1px solid #c7d2fe", fontSize: 11, color: "#4f46e5", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
                🤖 RM AI Assistant
              </div>
            </div>

            {/* Context bar */}
            <div style={{ padding: "8px 22px", background: "#f5f3ff", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
              <span style={{ fontSize: 13 }}>💡</span>
              <p style={{ fontSize: 12, color: "#6d28d9", margin: 0, fontWeight: 500 }}>
                Ask about markets, portfolio performance, product suitability, or client talking points
              </p>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 22px", display: "flex", flexDirection: "column" }}>
              {active.messages.map((msg, i) => (
                <div
                  key={`msg-${msg.id}-${i}`}
                  className="fade-in-up"
                  style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 14, animationDelay: `${i * 0.03}s` }}
                >
                  {msg.role === "assistant" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>🤖</div>
                      <span style={{ fontSize: 11, color: muted, fontWeight: 600 }}>AI Assistant</span>
                    </div>
                  )}
                  <div style={
                    msg.role === "user"
                      ? { background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", borderRadius: "16px 16px 4px 16px", padding: "12px 16px", maxWidth: "72%", fontSize: 14, lineHeight: 1.55, boxShadow: "0 4px 16px rgba(99,102,241,0.3)" }
                      : { background: "#f1f5f9", border: `1px solid ${border}`, color: text, borderRadius: "16px 16px 16px 4px", padding: "12px 16px", maxWidth: "72%", fontSize: 14, lineHeight: 1.55 }
                  }>
                    {msg.content}
                  </div>
                  <span style={{ fontSize: 10, color: muted, marginTop: 4 }}>{fmtTime(msg.timestamp)}</span>
                </div>
              ))}
              {typing && <div key="typing"><TypingBubble /></div>}
              <div ref={endRef} />
            </div>

            {/* Input bar */}
            <div style={{ padding: "14px 22px", borderTop: `1px solid ${border}`, background: "#ffffff", display: "flex", gap: 10, alignItems: "flex-end", flexShrink: 0 }}>
              <textarea
                ref={textRef}
                rows={1}
                value={input}
                onChange={e => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`; }}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder={`Ask about ${active.userName}'s portfolio, markets, or products…`}
                style={{ flex: 1, background: "#f8fafc", border: `1px solid ${border}`, borderRadius: 12, padding: "11px 15px", color: text, fontSize: 14, lineHeight: 1.5, resize: "none", outline: "none", fontFamily: "inherit", maxHeight: 120, transition: "border-color 0.2s" }}
                onFocus={e => (e.target.style.borderColor = "#6366f1")}
                onBlur={e => (e.target.style.borderColor = border)}
              />
              <button
                onClick={() => send()}
                disabled={!input.trim() || typing}
                style={{ flexShrink: 0, padding: "11px 20px", borderRadius: 12, border: "none", background: !input.trim() || typing ? "rgba(99,102,241,0.25)" : "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: !input.trim() || typing ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: !input.trim() || typing ? "none" : "0 4px 16px rgba(99,102,241,0.35)", transition: "all 0.2s" }}
              >
                {typing
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin"><circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                  : "Send ↑"}
              </button>
            </div>
          </>
        ) : (
          /* Empty state */
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 40, textAlign: "center" }}>
            <div style={{ width: 80, height: 80, borderRadius: 22, background: "#e0e7ff", border: "1px solid #c7d2fe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, boxShadow: "0 8px 32px rgba(99,102,241,0.15)" }}>💬</div>
            <div style={{ maxWidth: 400 }}>
              <h2 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 10px", color: "#4f46e5" }}>RM AI Assistant</h2>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.7, margin: 0 }}>
                Relationship Managers often don&apos;t know what to discuss with clients or how to handle real-time questions about markets, portfolio performance, or product suitability.
                <br /><br />
                <span style={{ color: "#94a3b8" }}>Start a new client session to get AI-powered insights.</span>
              </p>
            </div>
            <button
              className="fade-in-up"
              onClick={() => setShowPicker(true)}
              style={{ padding: "13px 28px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 6px 24px rgba(99,102,241,0.4)" }}
            >
              <span style={{ fontSize: 18 }}>+</span> Start New Session
            </button>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              {["📈 Market Updates", "💼 Portfolio Analysis", "🎯 Product Suitability", "💡 Talking Points"].map(f => (
                <span key={f} style={{ padding: "6px 14px", borderRadius: 999, background: "#f1f5f9", border: `1px solid ${border}`, fontSize: 12, color: muted }}>{f}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
