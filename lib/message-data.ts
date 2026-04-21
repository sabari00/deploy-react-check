import { MessageRecord, IntentType, DecisionType, ActionType, FilterOptions, SortField, SortOrder } from "./message-types";

export const sampleMessages: MessageRecord[] = [
  {
    id: 1,
    message:
      "SIP payment failed for the third time this month. I have sufficient balance but the debit is still not going through.",
    intent: "complaint",
    confidence: 94,
    decision: "approved",
    action: "auto-resolve",
    assigned_team: "Payments Team",
    response:
      "We've identified the issue: your bank has set a daily autopay limit. We've queued a retry for tomorrow morning and will notify you once it completes.",
    created_at: "2026-04-20T09:15:00Z",
  },
  {
    id: 2,
    message:
      "How long does it typically take for units to reflect after a purchase?",
    intent: "inquiry",
    confidence: 88,
    decision: "pending",
    action: "manual-review",
    assigned_team: "Operations Team",
    response:
      "Thank you for your inquiry. Units typically reflect within 2-3 business days after the payment is confirmed.",
    created_at: "2026-04-20T08:42:00Z",
  },
  {
    id: 3,
    message:
      "My mandate expired last month and I forgot to renew it. What should I do?",
    intent: "inquiry",
    confidence: 91,
    decision: "approved",
    action: "auto-resolve",
    assigned_team: "Mandate Management",
    response:
      "You can renew your mandate immediately through our app. Go to Settings > Mandates > Renew and complete the e-sign process. It takes just 2 minutes.",
    created_at: "2026-04-19T14:30:00Z",
  },
  {
    id: 4,
    message:
      "I received a rejection email but I cannot understand why my redemption was rejected.",
    intent: "complaint",
    confidence: 87,
    decision: "rejected",
    action: "escalate",
    assigned_team: "Redemption Team",
    response:
      "We're reviewing your redemption request. Rejections typically occur if there's a pending dividend payout. Please contact us directly for a detailed explanation.",
    created_at: "2026-04-19T11:22:00Z",
  },
  {
    id: 5,
    message:
      "Your system is great! I was able to set up my portfolio in 5 minutes. Excellent UX!",
    intent: "feedback",
    confidence: 92,
    decision: "approved",
    action: "auto-resolve",
    assigned_team: "Customer Success",
    response:
      "Thank you so much for the positive feedback! We're thrilled you had a great experience with our platform.",
    created_at: "2026-04-19T16:45:00Z",
  },
  {
    id: 6,
    message:
      "The app crashed when I tried to view my portfolio on mobile. This is the second time this week.",
    intent: "escalation",
    confidence: 85,
    decision: "approved",
    action: "escalate",
    assigned_team: "Technical Support",
    response:
      "We sincerely apologize for the crashes. Our engineering team is investigating this issue with priority. We've identified a memory leak in the mobile app and are releasing a fix tomorrow.",
    created_at: "2026-04-19T13:10:00Z",
  },
  {
    id: 7,
    message:
      "Why am I being charged twice for the same transaction? I see two debits from my account.",
    intent: "complaint",
    confidence: 89,
    decision: "approved",
    action: "auto-resolve",
    assigned_team: "Billing Team",
    response:
      "We've identified the duplicate charge. This was a system glitch on our end. We've immediately initiated a refund for the duplicate amount. You should see it in your account within 2-3 business days.",
    created_at: "2026-04-18T10:55:00Z",
  },
  {
    id: 8,
    message:
      "I want to switch my investment strategy from aggressive to conservative. How do I do this?",
    intent: "inquiry",
    confidence: 86,
    decision: "pending",
    action: "manual-review",
    assigned_team: "Advisory Team",
    response:
      "You can change your investment strategy anytime. However, we recommend reviewing the tax implications first. Would you like us to send you a personalized recommendation?",
    created_at: "2026-04-18T15:20:00Z",
  },
  {
    id: 9,
    message:
      "The tax statement I received has incorrect data. My dividend amount is shown as zero but I did earn dividends.",
    intent: "complaint",
    confidence: 90,
    decision: "approved",
    action: "escalate",
    assigned_team: "Compliance Team",
    response:
      "We've found an error in our tax reporting system. Your corrected tax statement is being regenerated and will be sent to you by email within 24 hours.",
    created_at: "2026-04-18T09:30:00Z",
  },
  {
    id: 10,
    message:
      "Can I set up automatic monthly investments from my savings account?",
    intent: "inquiry",
    confidence: 83,
    decision: "approved",
    action: "auto-resolve",
    assigned_team: "Payments Team",
    response:
      "Yes! You can set up recurring investments via our SIP (Systematic Investment Plan) feature. Navigate to 'Invest' > 'Set up SIP' to configure your monthly investment amount.",
    created_at: "2026-04-17T12:15:00Z",
  },
  {
    id: 11,
    message:
      "I had a great experience with your support team. They resolved my issue in under 10 minutes!",
    intent: "feedback",
    confidence: 95,
    decision: "approved",
    action: "auto-resolve",
    assigned_team: "Customer Success",
    response:
      "Thank you for taking the time to share this feedback! We'll make sure to recognize the team member who helped you.",
    created_at: "2026-04-17T14:45:00Z",
  },
  {
    id: 12,
    message:
      "I haven't received confirmation of my investment order even though the money was deducted. This is concerning.",
    intent: "escalation",
    confidence: 88,
    decision: "approved",
    action: "escalate",
    assigned_team: "Operations Team",
    response:
      "This appears to be a confirmation email delivery issue. We've found your investment order in our system and units are being allocated. A new confirmation email is being sent to you now.",
    created_at: "2026-04-17T11:00:00Z",
  },
  {
    id: 13,
    message:
      "Your fees are too high compared to competitors. I'm considering moving my investments elsewhere.",
    intent: "feedback",
    confidence: 81,
    decision: "pending",
    action: "manual-review",
    assigned_team: "Leadership",
    response:
      "We appreciate your feedback and would like to discuss this with you personally. Our fees include premium support and advanced portfolio analytics that competitors don't offer.",
    created_at: "2026-04-16T16:30:00Z",
  },
  {
    id: 14,
    message:
      "Can I link multiple bank accounts to my investment account?",
    intent: "inquiry",
    confidence: 84,
    decision: "approved",
    action: "auto-resolve",
    assigned_team: "Account Management",
    response:
      "Yes, you can link up to 5 bank accounts. Go to 'Settings' > 'Bank Accounts' to add additional accounts. Each account needs e-NACH verification.",
    created_at: "2026-04-16T13:20:00Z",
  },
  {
    id: 15,
    message:
      "My withdrawal has been pending for 5 days. I need this money urgently.",
    intent: "escalation",
    confidence: 89,
    decision: "approved",
    action: "escalate",
    assigned_team: "Redemption Team",
    response:
      "We sincerely apologize for the delay. We've expedited your withdrawal request with our settlement partner. Your funds should reach your account by end of business today.",
    created_at: "2026-04-16T09:45:00Z",
  },
  {
    id: 16,
    message:
      "The interest I earned was less than expected. Can you explain how this is calculated?",
    intent: "inquiry",
    confidence: 87,
    decision: "pending",
    action: "manual-review",
    assigned_team: "Advisory Team",
    response:
      "The interest calculation depends on fund performance and market conditions. We'd like to provide a personalized breakdown for your portfolio.",
    created_at: "2026-04-15T10:30:00Z",
  },
  {
    id: 17,
    message:
      "I received an unauthorized transaction alert but I don't recognize this charge.",
    intent: "complaint",
    confidence: 91,
    decision: "approved",
    action: "escalate",
    assigned_team: "Security Team",
    response:
      "We take security very seriously. We've frozen the related account and initiated a fraud investigation. We'll contact you within 2 hours for verification.",
    created_at: "2026-04-15T15:15:00Z",
  },
  {
    id: 18,
    message:
      "Your app update is fantastic! Love the new dashboard design.",
    intent: "feedback",
    confidence: 93,
    decision: "approved",
    action: "auto-resolve",
    assigned_team: "Product Team",
    response:
      "Thank you! Your feedback motivates us to keep building better experiences. More updates coming soon!",
    created_at: "2026-04-15T11:50:00Z",
  },
];

export function getAllMessages(): MessageRecord[] {
  return sampleMessages;
}

export function getMessageById(id: number): MessageRecord | undefined {
  return sampleMessages.find((msg) => msg.id === id);
}

export function filterAndSearch(messages: MessageRecord[], filters: FilterOptions): MessageRecord[] {
  return messages.filter((msg) => {
    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      const matchesText =
        msg.message.toLowerCase().includes(query) ||
        msg.response.toLowerCase().includes(query) ||
        msg.assigned_team.toLowerCase().includes(query);
      if (!matchesText) return false;
    }

    // Intent filter
    if (filters.intent && msg.intent !== filters.intent) {
      return false;
    }

    // Decision filter
    if (filters.decision && msg.decision !== filters.decision) {
      return false;
    }

    // Action filter
    if (filters.action && msg.action !== filters.action) {
      return false;
    }

    // Team filter
    if (filters.team && msg.assigned_team !== filters.team) {
      return false;
    }

    // Date range filter
    if (filters.dateFrom) {
      const msgDate = new Date(msg.created_at);
      const fromDate = new Date(filters.dateFrom);
      if (msgDate < fromDate) return false;
    }

    if (filters.dateTo) {
      const msgDate = new Date(msg.created_at);
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      if (msgDate > toDate) return false;
    }

    return true;
  });
}

export function sortMessages(
  messages: MessageRecord[],
  field: SortField,
  order: SortOrder = "asc"
): MessageRecord[] {
  return [...messages].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return order === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return order === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });
}

export function getUniqueValues<T extends keyof MessageRecord>(field: T): (MessageRecord[T] | string)[] {
  const values = sampleMessages.map((msg) => msg[field]);
  return Array.from(new Set(values));
}
