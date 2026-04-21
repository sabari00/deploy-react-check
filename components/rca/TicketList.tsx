"use client";

import { useState, useEffect, useCallback, Fragment } from "react";

// const BASE_URL = "https://fastapi-pyp.onrender.com";
const BASE_URL = "http://127.0.0.1:8000";

// API Response structure
interface LLMAnalysis {
  query_type?: string;
  data_needed?: string;
  customer_email?: string;
  transaction_id?: string | null;
  sip_id?: string | null;
  folio_number?: string | null;
  summary?: string;
}

interface RootCauseData {
  root_cause_found?: boolean;
  root_cause?: string;
  root_cause_code?: string;
  known_issue?: boolean;
  user_can_retry?: boolean;
  customer_message?: string;
  action_taken?: string;
  escalated?: boolean;
}

interface TicketData {
  reply_to?: string;
  customer_name?: string | null;
  query_type?: string;
  llm_analysis?: LLMAnalysis;
  error?: string;
}

interface Ticket {
  intent?: string;
  action?: string;
  response?: string;
  root_cause?: RootCauseData | string | null;
  data?: TicketData;
  created_at?: string;
  id?: number | string;
}

const FILTERS = [
  { key: "", label: "All" },
  { key: "SIP", label: "SIP" },
  { key: "NAV", label: "NAV" },
  { key: "PAYMENT", label: "Payment" },
  { key: "MANDATE", label: "Mandate" },
];

const STATUS_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  open: { bg: "#e0e7ff", color: "#4f46e5", border: "#c7d2fe" },
  closed: { bg: "#f1f5f9", color: "#64748b", border: "#e2e8f0" },
  on_hold: { bg: "#fef3c7", color: "#d97706", border: "#fcd34d" },
  auto_closed: { bg: "#dcfce7", color: "#16a34a", border: "#86efac" },
  dev_needed: { bg: "#fee2e2", color: "#dc2626", border: "#fca5a5" },
};

interface Props {
  refreshSignal: number;
}

function getStatusFromTicket(ticket: Ticket): string {
  if (typeof ticket.root_cause === "object" && ticket.root_cause?.escalated) {
    return "dev_needed";
  }
  if (ticket.action?.includes("AUTO") || ticket.action?.includes("RESOLVE")) {
    return "auto_closed";
  }
  if (ticket.action?.includes("INVESTIGATION") || ticket.action?.includes("ESCALATE")) {
    return "dev_needed";
  }
  return "open";
}

function formatResponse(text: string): string {
  if (!text) return "";
  // Truncate long responses for table view
  const lines = text.split("\n");
  const firstLine = lines[0] || "";
  return firstLine.length > 60 ? firstLine.substring(0, 60) + "..." : firstLine;
}

export default function TicketList({ refreshSignal }: Props) {
  const [activeFilter, setActiveFilter] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ limit: "100" });
      
      const res = await fetch(`${BASE_URL}/ticket?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      // Handle both array response and single object
      const ticketsArray = Array.isArray(data) ? data : data ? [data] : [];
      setTickets(ticketsArray);
      setLastRefresh(new Date());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load tickets");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets, refreshSignal]);

  const filteredTickets = activeFilter 
    ? tickets.filter(t => t.intent?.includes(activeFilter))
    : tickets;

  const thStyle: React.CSSProperties = {
    padding: "12px 16px",
    fontSize: 11,
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.7px",
    textAlign: "left",
    whiteSpace: "nowrap",
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#f8fafc",
  };

  const tdStyle: React.CSSProperties = {
    padding: "12px 16px",
    fontSize: 13,
    color: "#334155",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "top",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ padding: "18px 20px 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: "#e0e7ff",
                border: "1px solid #c7d2fe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 17,
              }}
            >
              🎫
            </div>

            <div>
              <h2
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                RCA Results
              </h2>

              <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>
                {filteredTickets.length} result{filteredTickets.length !== 1 ? "s" : ""} ·{" "}
                refreshed{" "}
                {isMounted && lastRefresh
                  ? lastRefresh.toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : "--:--:--"}
              </p>
            </div>
          </div>

          <button
            onClick={fetchTickets}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "#f1f5f9",
              border: "1px solid #e2e8f0",
              cursor: "pointer",
              color: "#64748b",
              fontSize: 16,
            }}
          >
            ↻
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key === activeFilter ? "" : f.key)}
                style={{
                  padding: "5px 13px",
                  borderRadius: 7,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: isActive
                    ? "1px solid #4f46e5"
                    : "1px solid #e2e8f0",
                  background: isActive
                    ? "#e0e7ff"
                    : "#ffffff",
                  color: isActive ? "#4f46e5" : "#64748b",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: "auto", padding: "0 20px 20px" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
            <div className="skeleton" style={{ height: 20, width: 200, margin: "0 auto 16px" }} />
            <p>Loading results...</p>
          </div>
        ) : error ? (
          <div style={{ padding: 20, background: "#fee2e2", borderRadius: 8, marginTop: 16 }}>
            <p style={{ color: "#dc2626", margin: 0 }}>⚠️ {error}</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#64748b" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
            <p>No results found</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
            <thead>
              <tr>
                <th style={thStyle}>Intent</th>
                <th style={thStyle}>Action</th>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((t, idx) => {
                const status = getStatusFromTicket(t);
                const statusStyle = STATUS_STYLE[status] || STATUS_STYLE.open;
                const isExpanded = expandedRow === idx;
                const customerEmail = t.data?.reply_to || t.data?.llm_analysis?.customer_email || "-";
                
                return (
                  <Fragment key={idx}>
                    <tr 
                      onClick={() => setExpandedRow(isExpanded ? null : idx)}
                      style={{ 
                        cursor: "pointer",
                        backgroundColor: isExpanded ? "#f8fafc" : "transparent",
                      }}
                    >
                      <td style={tdStyle}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 700,
                            background: "#e0e7ff",
                            color: "#4f46e5",
                            textTransform: "uppercase",
                          }}
                        >
                          {t.intent || "UNKNOWN"}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ fontSize: 12, color: "#475569" }}>
                          {t.action || "-"}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ fontSize: 12, color: "#334155" }}>
                          {customerEmail}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            padding: "4px 10px",
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 600,
                            background: statusStyle.bg,
                            color: statusStyle.color,
                            border: `1px solid ${statusStyle.border}`,
                          }}
                        >
                          {status.replace("_", " ").toUpperCase()}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        <span style={{ 
                          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                          display: "inline-block",
                          transition: "transform 0.2s",
                          color: "#64748b",
                        }}>
                          ▼
                        </span>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={5} style={{ padding: 0, borderBottom: "1px solid #e2e8f0" }}>
                          <div style={{ 
                            background: "#f8fafc", 
                            padding: "16px 20px",
                            borderLeft: "3px solid #4f46e5",
                          }}>
                            {/* Response */}
                            {t.response && (
                              <div style={{ marginBottom: 16 }}>
                                <p style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
                                  AI Response
                                </p>
                                <pre style={{ 
                                  fontSize: 12, 
                                  color: "#334155", 
                                  margin: 0, 
                                  whiteSpace: "pre-wrap",
                                  fontFamily: "inherit",
                                  lineHeight: 1.6,
                                  background: "#ffffff",
                                  padding: 12,
                                  borderRadius: 8,
                                  border: "1px solid #e2e8f0",
                                }}>
                                  {t.response}
                                </pre>
                              </div>
                            )}
                            
                            {/* Root Cause Details */}
                            {typeof t.root_cause === "object" && t.root_cause && (
                              <div style={{ 
                                background: "#ffffff", 
                                padding: 12, 
                                borderRadius: 8,
                                border: "1px solid #e2e8f0",
                                marginBottom: 16,
                              }}>
                                <p style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
                                  Root Cause Analysis
                                </p>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                                  <div>
                                    <span style={{ fontSize: 10, color: "#94a3b8" }}>Root Cause</span>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: "#334155", margin: "4px 0 0" }}>
                                      {t.root_cause.root_cause || "-"}
                                    </p>
                                  </div>
                                  <div>
                                    <span style={{ fontSize: 10, color: "#94a3b8" }}>Code</span>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: "#334155", margin: "4px 0 0" }}>
                                      {t.root_cause.root_cause_code || "-"}
                                    </p>
                                  </div>
                                  <div>
                                    <span style={{ fontSize: 10, color: "#94a3b8" }}>Action Taken</span>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: "#334155", margin: "4px 0 0" }}>
                                      {t.root_cause.action_taken || "-"}
                                    </p>
                                  </div>
                                </div>
                                <div style={{ display: "flex", gap: 16, marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                                  <span style={{ fontSize: 11, color: t.root_cause.known_issue ? "#16a34a" : "#64748b" }}>
                                    {t.root_cause.known_issue ? "✓ Known Issue" : "⚪ Unknown Issue"}
                                  </span>
                                  <span style={{ fontSize: 11, color: t.root_cause.user_can_retry ? "#16a34a" : "#dc2626" }}>
                                    {t.root_cause.user_can_retry ? "✓ User Can Retry" : "✗ User Cannot Retry"}
                                  </span>
                                  <span style={{ fontSize: 11, color: t.root_cause.escalated ? "#dc2626" : "#64748b" }}>
                                    {t.root_cause.escalated ? "🚨 Escalated" : "⚪ Not Escalated"}
                                  </span>
                                </div>
                                {t.root_cause.customer_message && (
                                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                                    <span style={{ fontSize: 10, color: "#94a3b8" }}>Customer Message</span>
                                    <p style={{ fontSize: 12, color: "#475569", margin: "4px 0 0", whiteSpace: "pre-wrap" }}>
                                      {t.root_cause.customer_message}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* LLM Analysis */}
                            {t.data?.llm_analysis && (
                              <div style={{ 
                                background: "#f0fdf4", 
                                padding: 12, 
                                borderRadius: 8,
                                border: "1px solid #bbf7d0",
                              }}>
                                <p style={{ fontSize: 10, fontWeight: 700, color: "#166534", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
                                  LLM Analysis
                                </p>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px 16px" }}>
                                  {Object.entries(t.data.llm_analysis)
                                    .filter(([k, v]) => v !== null && v !== undefined && k !== "summary")
                                    .map(([k, v]) => (
                                      <div key={k}>
                                        <span style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase" }}>
                                          {k.replace(/_/g, " ")}
                                        </span>
                                        <p style={{ fontSize: 12, color: "#334155", margin: "2px 0 0" }}>
                                          {String(v)}
                                        </p>
                                      </div>
                                    ))}
                                </div>
                                {t.data.llm_analysis.summary && (
                                  <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #bbf7d0" }}>
                                    <span style={{ fontSize: 10, color: "#64748b" }}>Summary</span>
                                    <p style={{ fontSize: 12, color: "#166534", margin: "2px 0 0", fontStyle: "italic" }}>
                                      "{t.data.llm_analysis.summary}"
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}