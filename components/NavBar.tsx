"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "RCA Analyzer", icon: "🧠" },
  { href: "/chat", label: "RM Chatbot", icon: "💬" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              boxShadow: "0 4px 16px rgba(99,102,241,0.4)",
            }}
          >
            ⚡
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: 17,
              color: "#1e293b",
              letterSpacing: "-0.3px",
            }}
          >
            AI Ops Hub
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {NAV_LINKS.map(({ href, label, icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "8px 16px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.2s",
                  background: isActive
                    ? "#e0e7ff"
                    : "transparent",
                  color: isActive ? "#4f46e5" : "#64748b",
                  border: isActive
                    ? "1px solid #c7d2fe"
                    : "1px solid transparent",
                }}
              >
                <span style={{ fontSize: 15 }}>{icon}</span>
                {label}
                {isActive && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: "#6366f1",
                      boxShadow: "0 0 6px #6366f1",
                      display: "inline-block",
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right status pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "5px 12px",
            borderRadius: 999,
            background: "#dcfce7",
            border: "1px solid #86efac",
            fontSize: 12,
            fontWeight: 600,
            color: "#16a34a",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#22c55e",
              display: "inline-block",
              animation: "pulse-dot 1.4s ease-in-out infinite",
            }}
          />
          Live
        </div>
      </div>
    </nav>
  );
}
