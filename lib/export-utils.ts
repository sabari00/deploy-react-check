import { MessageRecord } from "./message-types";

export function exportToCSV(messages: MessageRecord[], filename: string = "messages.csv"): void {
  if (messages.length === 0) {
    console.warn("No messages to export");
    return;
  }

  // Define CSV headers
  const headers = ["ID", "Message", "Intent", "Confidence", "Decision", "Action", "Team", "Response", "Created At"];

  // Convert messages to CSV rows
  const rows = messages.map((msg) => [
    msg.id.toString(),
    `"${msg.message.replace(/"/g, '""')}"`, // Escape quotes
    msg.intent,
    msg.confidence.toString(),
    msg.decision,
    msg.action,
    msg.assigned_team,
    `"${msg.response.replace(/"/g, '""')}"`, // Escape quotes
    msg.created_at,
  ]);

  // Combine headers and rows
  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  downloadFile(blob, filename);
}

export function exportToJSON(messages: MessageRecord[], filename: string = "messages.json"): void {
  const jsonContent = JSON.stringify(messages, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" });
  downloadFile(blob, filename);
}

function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
