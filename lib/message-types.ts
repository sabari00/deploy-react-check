export type IntentType = "complaint" | "inquiry" | "feedback" | "escalation";
export type DecisionType = "pending" | "approved" | "rejected";
export type ActionType = "auto-resolve" | "escalate" | "manual-review";

export type MessageRecord = {
  id: number;
  message: string;
  intent: IntentType;
  confidence: number; // 0-100
  decision: DecisionType;
  action: ActionType;
  assigned_team: string;
  response: string;
  created_at: string; // ISO 8601 date
};

// Color tone mapping helpers
export function intentTone(intent: IntentType): string {
  const tones: Record<IntentType, string> = {
    complaint: "bg-rose-100 text-rose-800 border-rose-300",
    inquiry: "bg-sky-100 text-sky-800 border-sky-300",
    feedback: "bg-slate-100 text-slate-800 border-slate-300",
    escalation: "bg-amber-100 text-amber-800 border-amber-300",
  };
  return tones[intent];
}

export function decisionTone(decision: DecisionType): string {
  const tones: Record<DecisionType, string> = {
    pending: "bg-slate-100 text-slate-800 border-slate-300",
    approved: "bg-emerald-100 text-emerald-800 border-emerald-300",
    rejected: "bg-rose-100 text-rose-800 border-rose-300",
  };
  return tones[decision];
}

export function actionTone(action: ActionType): string {
  const tones: Record<ActionType, string> = {
    "auto-resolve": "bg-emerald-100 text-emerald-800 border-emerald-300",
    escalate: "bg-rose-100 text-rose-800 border-rose-300",
    "manual-review": "bg-amber-100 text-amber-800 border-amber-300",
  };
  return tones[action];
}

export function confidenceTone(confidence: number): string {
  if (confidence >= 85) return "text-emerald-700";
  if (confidence >= 70) return "text-amber-700";
  return "text-rose-700";
}

// Sort and Filter types
export type SortField = keyof MessageRecord;
export type SortOrder = "asc" | "desc";

export interface FilterOptions {
  query?: string;
  intent?: IntentType | null;
  decision?: DecisionType | null;
  action?: ActionType | null;
  team?: string | null;
  dateFrom?: string;
  dateTo?: string;
}
