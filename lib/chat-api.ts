/**
 * Chat API Client for RM Assistant
 * Base URL: http://127.0.0.1:8000/
 */

const BASE_URL = "http://127.0.0.1:8000";

export interface Session {
  session_id: string;
  client: {
    client_id: string;
    name: string;
    email?: string;
    portfolio_value?: number;
    risk_profile?: string;
  };
  status: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
}

export interface ChatMessage {
  role: "rm" | "client" | "assistant";
  content: string;
  timestamp: string;
  context_used?: boolean;
}

export interface SessionDetail extends Session {
  conversation_history: ChatMessage[];
  notes?: string;
  assistant_context?: {
    portfolio_summary?: string;
    recent_transactions?: string[];
    risk_profile?: string;
    investment_horizon?: string;
    active_sips?: number;
    pending_issues?: string[];
    relationship_tenure?: string;
    market_context?: string;
  };
}

export interface CreateSessionRequest {
  client_identifier: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  session_id: string;
  message_added: boolean;
  assistant_suggestion?: {
    suggested_response: string;
    key_points: string[];
    follow_up_questions?: string[];
    confidence: number;
  };
  conversation_history: ChatMessage[];
}

interface SessionsListResponse {
  sessions: Session[];
  total: number;
  active_count: number;
}

/**
 * Get all sessions
 * GET /rm-assistant/sessions
 */
export async function getSessions(): Promise<Session[]> {
  const response = await fetch(`${BASE_URL}/rm-assistant/sessions`);
  if (!response.ok) {
    throw new Error(`Failed to fetch sessions: ${response.statusText}`);
  }
  const data: SessionsListResponse = await response.json();
  return data.sessions || [];
}

/**
 * Create a new session
 * POST /rm-assistant/sessions
 */
export async function createSession(clientIdentifier: string): Promise<Session> {
  const response = await fetch(`${BASE_URL}/rm-assistant/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_identifier: clientIdentifier }),
  });
  if (!response.ok) {
    throw new Error(`Failed to create session: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Get a specific session with messages
 * GET /rm-assistant/sessions/{session_id}
 */
export async function getSession(sessionId: string): Promise<SessionDetail> {
  const response = await fetch(`${BASE_URL}/rm-assistant/sessions/${sessionId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch session: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Delete a session
 * DELETE /rm-assistant/sessions/{session_id}
 */
export async function deleteSession(sessionId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/rm-assistant/sessions/${sessionId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete session: ${response.statusText}`);
  }
}

/**
 * Send a chat message
 * POST /rm-assistant/sessions/{session_id}/chat
 */
export async function sendChatMessage(sessionId: string, message: string): Promise<ChatResponse> {
  const response = await fetch(`${BASE_URL}/rm-assistant/sessions/${sessionId}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }
  return response.json();
}
