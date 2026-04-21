"use client";

import { useState, ReactNode } from "react";

const BASE_URL = "https://fastapi-pyp.onrender.com";
// const BASE_URL = "http://127.0.0.1:8000";

interface LLMAnalysis {
  query_type?: string;
  data_needed?: string;
  customer_email?: string;
  transaction_id?: string | null;
  sip_id?: string | null;
  folio_number?: string | null;
  summary?: string;
}

interface RootCauseInfo {
  root_cause_found?: boolean;
  root_cause?: string;
  root_cause_code?: string;
  known_issue?: boolean;
  user_can_retry?: boolean;
  customer_message?: string;
  action_taken?: string;
  escalated?: boolean;
}

interface TicketResponseData {
  error?: string;
  customer_name?: string | null;
  reply_to?: string;
  query_type?: string;
  llm_analysis?: LLMAnalysis;
  [key: string]: unknown;
}

interface TicketResponse {
  intent?: string;
  action?: string;
  response?: string;
  root_cause?: string | RootCauseInfo | null;
  data?: TicketResponseData;
}

interface Props {
  onTicketCreated: () => void;
}

function RootCauseDisplay({ rc, label }: { rc: RootCauseInfo; label: (text: string) => React.ReactNode }) {
  return (
    <div style={{ 
      background: "#fef2f2", 
      border: "1px solid #fca5a5",
      borderRadius: 12,
      padding: "14px 16px",
    }}>
      {label("Root Cause Analysis")}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px 16px" }}>
        {rc.root_cause && (
          <div>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Root Cause</span>
            <p style={{ fontSize: 12, color: "#dc2626", margin: "2px 0 0", fontWeight: 600 }}>{rc.root_cause}</p>
          </div>
        )}
        {rc.root_cause_code && (
          <div>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Code</span>
            <p style={{ fontSize: 12, color: "#334155", margin: "2px 0 0" }}>{rc.root_cause_code}</p>
          </div>
        )}
        {rc.action_taken && (
          <div>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Action</span>
            <p style={{ fontSize: 12, color: "#334155", margin: "2px 0 0" }}>{rc.action_taken}</p>
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 10, paddingTop: 10, borderTop: "1px solid #fecaca" }}>
        <span style={{ fontSize: 11, color: rc.known_issue ? "#16a34a" : "#64748b" }}>
          {rc.known_issue ? "✓ Known Issue" : "⚪ Unknown Issue"}
        </span>
        <span style={{ fontSize: 11, color: rc.user_can_retry ? "#16a34a" : "#dc2626" }}>
          {rc.user_can_retry ? "✓ User Can Retry" : "✗ User Cannot Retry"}
        </span>
        <span style={{ fontSize: 11, color: rc.escalated ? "#dc2626" : "#64748b" }}>
          {rc.escalated ? "🚨 Escalated" : "⚪ Not Escalated"}
        </span>
      </div>
      {rc.customer_message && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #fecaca" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Customer Message</span>
          <pre style={{ fontSize: 12, color: "#475569", margin: "4px 0 0", whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
            {rc.customer_message}
          </pre>
        </div>
      )}
    </div>
  );
}

const INTENT_COLOR: Record<string, string> = {
  NAV: "#0891b2", SIP: "#7c3aed", PAYMENT: "#d97706", MANDATE: "#059669",
  SIP_FAILURE: "#dc2626", UNKNOWN: "#64748b", RCA_QUERY: "#4f46e5",
};

export default function TicketSubmitPanel({ onTicketCreated }: Props) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TicketResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!message.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch(`${BASE_URL}/ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), source: "CS" }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: TicketResponse = await res.json();
      setResult(json);
      onTicketCreated();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const label = (text: string) => (
    <p style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.7px", margin: "0 0 6px" }}>
      {text}
    </p>
  );

  const card = (children: React.ReactNode, extra?: React.CSSProperties) => (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: "14px 16px",
        ...extra,
      }}
    >
      {children}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div
            style={{
              width: 34, height: 34, borderRadius: 9,
              background: "#e0e7ff",
              border: "1px solid #c7d2fe",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            }}
          >🔍</div>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", margin: 0 }}>CS Query Analyzer</h2>
            <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>Submit a query for AI root-cause analysis</p>
          </div>
        </div>
        <div style={{ height: 1, background: "#e2e8f0", marginTop: 14 }} />
      </div>

      {/* Textarea */}
      <div>
        {label("Query Message")}
        <div style={{ position: "relative" }}>
          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. What is the total NAV for vikram.singh@example.com"
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
            style={{
              width: "100%",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: "13px 15px",
              color: "#1e293b",
              fontSize: 13,
              lineHeight: 1.6,
              resize: "vertical",
              outline: "none",
              fontFamily: "inherit",
              transition: "border-color 0.2s, box-shadow 0.2s",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#4f46e5";
              e.target.style.boxShadow = "0 0 0 3px rgba(79,70,229,0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e2e8f0";
              e.target.style.boxShadow = "none";
            }}
          />
          <span style={{ position: "absolute", bottom: 10, right: 12, fontSize: 10, color: "#64748b" }}>⌘↵ submit</span>
        </div>
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={loading || !message.trim()}
        style={{
          width: "100%",
          padding: "13px",
          borderRadius: 12,
          border: "none",
          background: loading || !message.trim()
            ? "rgba(99,102,241,0.3)"
            : "linear-gradient(135deg,#6366f1,#8b5cf6)",
          color: "#fff",
          fontSize: 14,
          fontWeight: 700,
          cursor: loading || !message.trim() ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          boxShadow: loading || !message.trim() ? "none" : "0 4px 20px rgba(99,102,241,0.4)",
          transition: "all 0.2s",
        }}
      >
        {loading
          ? (<><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="spin"><circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>Analyzing…</>)
          : (<><span>⚡</span>Analyze Query</>)}
      </button>

      {/* Error */}
      {error && (
        <div className="fade-in-up" style={{ padding: "12px 14px", borderRadius: 10, background: "#fee2e2", border: "1px solid #fca5a5" }}>
          <p style={{ color: "#dc2626", fontSize: 13, margin: 0 }}>⚠️ {error}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="fade-in-up" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Intent + Action chips */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {result.intent && (
              <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.3)", color: INTENT_COLOR[result.intent] ?? "#a5b4fc" }}>
                {result.intent}
              </span>
            )}
            {result.action && (
              <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)", color: "#fcd34d" }}>
                {result.action}
              </span>
            )}
          </div>

          {/* Response */}
          {result.response && card(
            <>{label("AI Response")}<pre style={{ fontSize: 13, color: "#334155", margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>{result.response}</pre></>
          )}

          {/* Root cause */}
          {typeof result.root_cause === "string" && result.root_cause && card(
            <>{label("Root Cause")}<p style={{ fontSize: 13, color: "#dc2626", margin: 0 }}>{result.root_cause}</p></>,
            { borderColor: "#fca5a5", background: "#fef2f2" }
          )}
          
          {/* Root cause object */}
          {typeof result.root_cause === "object" && result.root_cause && (
            <RootCauseDisplay rc={result.root_cause as RootCauseInfo} label={label} />
          )}

          {/* LLM Analysis */}
          {result.data?.llm_analysis && (
            <div style={{ 
              background: "#f0fdf4", 
              border: "1px solid #bbf7d0",
              borderRadius: 12,
              padding: "14px 16px",
            }}>
              {label("LLM Analysis")}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
                {Object.entries(result.data.llm_analysis)
                  .filter(([k, v]) => k !== "summary" && v !== null && v !== undefined)
                  .map(([k, v]) => (
                    <div key={k}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 2 }}>
                        {k.replace(/_/g, " ")}
                      </span>
                      <span style={{ fontSize: 12, color: "#334155" }}>{String(v)}</span>
                    </div>
                  ))}
              </div>
              {result.data.llm_analysis.summary && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #bbf7d0" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 4 }}>Summary</span>
                  <p style={{ fontSize: 12, color: "#166534", margin: 0, fontStyle: "italic" }}>
                    "{result.data.llm_analysis.summary}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
