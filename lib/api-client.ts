/**
 * API Client for Messages
 * 
 * This file is a placeholder for future integration with the real API.
 * Currently uses mock data from message-data.ts, but can be updated to fetch from:
 * 
 * API Endpoint: https://fastapi-pyp.onrender.com/ticket
 * 
 * To integrate with real API, replace the mock data functions with actual fetch calls.
 * 
 * Example of future implementation:
 * 
 * export async function fetchMessages(page: number, limit: number) {
 *   const response = await fetch(
 *     `${process.env.NEXT_PUBLIC_API_BASE_URL}/ticket?skip=${(page - 1) * limit}&limit=${limit}`
 *   );
 *   return response.json();
 * }
 */

import { MessageRecord, FilterOptions } from "@/lib/message-types";

// Placeholder: Currently using mock data
// To switch to real API, uncomment the fetch implementations below

/**
 * Fetch messages from API with pagination and filtering
 * 
 * @param page - Current page number (1-indexed)
 * @param limit - Number of items per page
 * @param filters - Optional filter options
 * @returns Promise<MessageRecord[]>
 */
export async function fetchMessages(
  page: number,
  limit: number,
  filters?: FilterOptions
): Promise<MessageRecord[]> {
  // TODO: Implement real API call
  // const params = new URLSearchParams();
  // params.append("skip", ((page - 1) * limit).toString());
  // params.append("limit", limit.toString());
  //
  // const response = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/ticket?${params}`,
  //   { cache: "no-store" }
  // );
  //
  // if (!response.ok) {
  //   throw new Error(`API error: ${response.statusText}`);
  // }
  //
  // return response.json();

  // For now, returns mock data
  const { getAllMessages } = await import("@/lib/message-data");
  return getAllMessages();
}

/**
 * Fetch a single message by ID from API
 * 
 * @param id - Message ID
 * @returns Promise<MessageRecord>
 */
export async function fetchMessageById(id: number): Promise<MessageRecord | null> {
  // TODO: Implement real API call
  // const response = await fetch(
  //   `${process.env.NEXT_PUBLIC_API_BASE_URL}/ticket/${id}`,
  //   { cache: "no-store" }
  // );
  //
  // if (!response.ok) {
  //   return null;
  // }
  //
  // return response.json();

  // For now, uses mock data
  const { getMessageById } = await import("@/lib/message-data");
  return getMessageById(id) || null;
}

/**
 * Future: Create a new message
 * @param message - Message data
 * @returns Promise<MessageRecord>
 */
export async function createMessage(message: Omit<MessageRecord, "id" | "created_at">): Promise<MessageRecord> {
  // TODO: Implement POST request to API
  throw new Error("Not implemented yet");
}

/**
 * Future: Update an existing message
 * @param id - Message ID
 * @param updates - Partial message updates
 * @returns Promise<MessageRecord>
 */
export async function updateMessage(
  id: number,
  updates: Partial<MessageRecord>
): Promise<MessageRecord> {
  // TODO: Implement PATCH request to API
  throw new Error("Not implemented yet");
}

/**
 * Future: Delete a message
 * @param id - Message ID
 * @returns Promise<void>
 */
export async function deleteMessage(id: number): Promise<void> {
  // TODO: Implement DELETE request to API
  throw new Error("Not implemented yet");
}
