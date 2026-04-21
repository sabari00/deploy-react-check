"use client";

interface Ticket {
  id: number;
  message: string;
  intent: string;
  confidence: number;
  decision: string;
  action: string;
  assigned_team: string;
  response: string;
  created_at: string;
  status?: string;
}

interface Props {
  ticket: Ticket;
  index: number;
}

const STATUS_META: Record<string, { label: string; cls: string; dot: string }> = {
  open:        { label: "Open",        cls: "badge-open",        dot: "#6366f1" },
  closed:      { label: "Closed",      cls: "badge-closed",      dot: "#475569" },
  on_hold:     { label: "On Hold",     cls: "badge-on_hold",     dot: "#f59e0b" },
  auto_closed: { label: "Auto Closed", cls: "badge-auto_closed", dot: "#10b981" },
  dev_needed:  { label: "Dev Needed",  cls: "badge-dev_needed",  dot: "#ef4444" },
};

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

export default function TicketCard({ ticket, index }: Props) {
  const status = ticket.status ?? "open";
  const meta = STATUS_META[status] ?? STATUS_META.open;
  const confidence = Math.round((ticket.confidence ?? 0) * 100);

  return (
    <div
      className="glass-card fade-in-up"
      style={{
        padding: "16px 18px",
        animationDelay: `${index * 0.05}s`,
        animationFillMode: "both",
        cursor: "default",
      }}
    >
      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {/* ID */}
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#334155",
              fontFamily: "monospace",
            }}
          >
            #{ticket.id}
          </span>

          {/* Intent chip */}
          {ticket.intent && (
            <span
              style={{
                padding: "2px 9px",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.25)",
                color: "#a5b4fc",
                letterSpacing: 0.4,
              }}
            >
              {ticket.intent}
            </span>
          )}

          {/* Status badge */}
          <span className={`badge ${meta.cls}`}>
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: meta.dot,
                display: "inline-block",
              }}
            />
            {meta.label}
          </span>
        </div>

        <span style={{ fontSize: 11, color: "#334155", whiteSpace: "nowrap", flexShrink: 0 }}>
          {fmt(ticket.created_at)}
        </span>
      </div>

      {/* Message */}
      <p
        style={{
          fontSize: 13,
          color: "#cbd5e1",
          margin: "0 0 8px",
          lineHeight: 1.5,
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {ticket.message}
      </p>

      {/* Response */}
      {ticket.response && (
        <p
          style={{
            fontSize: 12,
            color: "#64748b",
            margin: "0 0 10px",
            lineHeight: 1.4,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
          }}
        >
          ↳ {ticket.response}
        </p>
      )}

      {/* Bottom row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* Assigned team */}
        {ticket.assigned_team && (
          <span
            style={{
              fontSize: 11,
              color: "#475569",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            👥 {ticket.assigned_team}
          </span>
        )}

        {/* Confidence */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
          <span style={{ fontSize: 11, color: "#334155" }}>
            {confidence}%
          </span>
          <div className="confidence-bar" style={{ width: 60 }}>
            <div
              className="confidence-fill"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
