"use client";

import { useState } from "react";
import TicketSubmitPanel from "@/components/rca/TicketSubmitPanel";
import TicketList from "@/components/rca/TicketList";

export default function Home() {
  const [refreshSignal, setRefreshSignal] = useState(0);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        backgroundColor: "#f8fafc",
        padding: "32px 28px",
        maxWidth: 1440,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}
    >
      {/* Page header */}
      <div className="fade-in-up">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <span
            style={{
              padding: "4px 12px",
              borderRadius: 999,
              background: "#e0e7ff",
              border: "1px solid #c7d2fe",
              fontSize: 11,
              fontWeight: 700,
              color: "#4f46e5",
              letterSpacing: 0.8,
              textTransform: "uppercase",
            }}
          >
            ⚡ AI-Powered
          </span>
        </div>
        <h1
          style={{
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: "-0.6px",
            margin: "0 0 6px",
            color: "#1e293b",
          }}
        >
          RCA Analyzer
        </h1>
        <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
          AI root-cause analysis for customer support queries · Ticket management &amp; routing
        </p>
      </div>

      {/* Content — stacked on small, side-by-side on large */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "400px 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* Left — Submit panel */}
        <div
          className="fade-in-up"
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 18,
            padding: 24,
            animationDelay: "0.1s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <TicketSubmitPanel onTicketCreated={() => setRefreshSignal((n) => n + 1)} />
        </div>

        {/* Right — Ticket table */}
        <div
          className="fade-in-up"
          style={{
            animationDelay: "0.2s",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: 18,
            overflow: "hidden",
            minHeight: 400,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <TicketList refreshSignal={refreshSignal} />
        </div>
      </div>
    </div>
  );
}
