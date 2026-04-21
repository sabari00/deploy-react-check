export type TicketEvent = {
  code: string;
  description: string;
  system: string;
  time: string;
  title: string;
};

export type TicketRecord = {
  channel: "Email" | "Phone" | "Chat";
  complaint: string;
  confidence: string;
  customerId: string;
  customerName: string;
  customerReply: string;
  diagnosisSummary: string;
  events: TicketEvent[];
  id: string;
  recommendedAction: {
    cta: string;
    details: string;
    kind: "Auto-resolve" | "Escalate" | "Manual follow-up";
    label: string;
  };
  rootCause: string;
  severity: "High" | "Medium" | "Low";
  status: "Needs review" | "Ready to resolve" | "Actioned";
};

export const evaluationSnapshot = {
  autoResolved: "18 / 26",
  diagnosisAccuracy: "68%",
  ticketsReviewed: 50,
};

export const complaintTemplates = [
  {
    label: "Failed SIP",
    value:
      "Customer says SIP installment did not go through even though balance was available. SIP ref SIP-78421 and UMRN 002991 are mentioned in the note.",
  },
  {
    label: "Mandate expired",
    value:
      "Investor called in because autopay stopped this month. ECS mandate seems inactive and the payment request was never honored.",
  },
  {
    label: "AMC delay",
    value:
      "Payment was debited yesterday but units are still not showing. Need to check whether the AMC acknowledged the order.",
  },
];

export const sampleTickets: TicketRecord[] = [
  {
    id: "TKT-1034",
    customerName: "Aarav Mehta",
    customerId: "CUS-88314",
    channel: "Email",
    severity: "High",
    status: "Ready to resolve",
    complaint:
      "My SIP for Bluechip Fund failed again today. Money is in the bank account, mandate is active, but the installment was not processed.",
    rootCause: "Bank rejection due to daily debit limit exceeded",
    confidence: "92% confidence",
    diagnosisSummary:
      "The complaint matched SIP reference SIP-78421. The mandate is active, but the bank callback returned code R29 after the debit request crossed the account's daily UPI autopay limit.",
    recommendedAction: {
      kind: "Auto-resolve",
      label: "Retry debit for next banking window",
      cta: "Re-trigger collection",
      details:
        "Queue the debit retry for the next morning slot and notify the customer to keep the same account funded. No manual ops intervention is required.",
    },
    customerReply:
      "Hi Aarav,\n\nWe checked your SIP and found that the bank declined today's auto-debit because the account had already hit its daily autopay limit. Your mandate is still active, so we have queued an automatic retry for the next banking window.\n\nYou do not need to create a new SIP. Please keep sufficient balance in the same bank account and we will update you once the retry completes.\n\nRegards,\nCustomer Support",
    events: [
      {
        time: "08:02",
        system: "Complaint intake",
        title: "Ticket linked to customer and SIP",
        description:
          "Complaint parser extracted Bluechip Fund, SIP-78421, and mapped the customer to mandate UMRN-002991.",
        code: "MAP-101",
      },
      {
        time: "08:03",
        system: "Payments",
        title: "Debit request initiated",
        description:
          "Auto-pay debit request sent to sponsor bank for INR 5,000 under the active UPI mandate.",
        code: "PAY-204",
      },
      {
        time: "08:03",
        system: "Bank callback",
        title: "Bank declined request",
        description:
          "Callback code R29 received. Internal mapping classifies this as daily debit limit exceeded, not insufficient balance.",
        code: "BNK-R29",
      },
      {
        time: "08:04",
        system: "Resolution engine",
        title: "Retry allowed by policy",
        description:
          "Rulebook allows one deferred retry for daily-limit failures when the mandate remains valid.",
        code: "ACT-008",
      },
    ],
  },
  {
    id: "TKT-1041",
    customerName: "Priya Nair",
    customerId: "CUS-77201",
    channel: "Chat",
    severity: "High",
    status: "Ready to resolve",
    complaint:
      "Autopay for my SIP stopped this month and I received a failure message. Please fix this because I have not changed my bank account.",
    rootCause: "Mandate expired before debit date",
    confidence: "95% confidence",
    diagnosisSummary:
      "The UMRN linked to the SIP expired three days before the installment date. No debit hit the bank because the mandate status had already turned inactive in the mandate registry.",
    recommendedAction: {
      kind: "Manual follow-up",
      label: "Send fresh mandate link",
      cta: "Issue mandate refresh",
      details:
        "A new e-mandate link should be sent immediately and the SIP retry should be scheduled once the customer re-authorizes autopay.",
    },
    customerReply:
      "Hi Priya,\n\nWe traced the failed SIP and found that the auto-pay mandate attached to your bank account had expired before this month's installment date. Because of that, the bank never received a debit request.\n\nWe are sending you a fresh mandate setup link now. Once the mandate is approved, we will help you restart the SIP installment.\n\nRegards,\nCustomer Support",
    events: [
      {
        time: "10:11",
        system: "Complaint intake",
        title: "Customer mapped to active SIP",
        description:
          "Support note linked to SIP-80113 and mandate reference UMRN-112804.",
        code: "MAP-118",
      },
      {
        time: "10:12",
        system: "Mandate registry",
        title: "Mandate found inactive",
        description:
          "Registry status shows mandate expiry on 12 Apr, while installment date is 15 Apr.",
        code: "MDT-410",
      },
      {
        time: "10:12",
        system: "Payments",
        title: "No debit initiated",
        description:
          "Scheduler skipped debit creation because the linked mandate was no longer valid.",
        code: "PAY-000",
      },
      {
        time: "10:13",
        system: "Resolution engine",
        title: "Mandate refresh required",
        description:
          "Policy requires customer re-consent before any future debit attempt.",
        code: "ACT-041",
      },
    ],
  },
  {
    id: "TKT-1058",
    customerName: "Rohan Sharma",
    customerId: "CUS-66509",
    channel: "Phone",
    severity: "Medium",
    status: "Needs review",
    complaint:
      "Money got debited from my account yesterday but units are not visible in the app. Please confirm whether the purchase went through.",
    rootCause: "AMC acknowledgement delay after successful debit",
    confidence: "88% confidence",
    diagnosisSummary:
      "Payment succeeded and order was transmitted, but the AMC acknowledgement is still pending beyond the usual SLA. This is not a payment failure; it is a downstream processing lag.",
    recommendedAction: {
      kind: "Escalate",
      label: "Escalate to AMC operations queue",
      cta: "Escalate acknowledgement delay",
      details:
        "The debit is successful and should not be retried. Escalate the order to the AMC operations queue and keep the customer informed about allotment visibility.",
    },
    customerReply:
      "Hi Rohan,\n\nWe checked the transaction and confirmed that your payment was successfully debited and the mutual fund order was sent ahead. The delay is at the AMC acknowledgement stage, which is why units are not visible yet.\n\nWe have raised this with the operations team and will share an update as soon as the acknowledgement is posted.\n\nRegards,\nCustomer Support",
    events: [
      {
        time: "14:22",
        system: "Payments",
        title: "Debit confirmed",
        description:
          "Bank callback confirmed successful debit of INR 12,000 for order ORD-55811.",
        code: "BNK-200",
      },
      {
        time: "14:24",
        system: "Order manager",
        title: "Order forwarded to AMC",
        description:
          "Purchase payload sent to AMC gateway with transaction checksum and folio details.",
        code: "ORD-302",
      },
      {
        time: "18:40",
        system: "AMC gateway",
        title: "Acknowledgement pending",
        description:
          "No success or rejection callback received inside the standard 2-hour SLA window.",
        code: "AMC-102",
      },
      {
        time: "18:41",
        system: "Resolution engine",
        title: "Escalation path selected",
        description:
          "The agent marked the case as downstream delay and avoided any duplicate order or payment retry.",
        code: "ACT-073",
      },
    ],
  },
  {
    id: "TKT-1072",
    customerName: "Neha Verma",
    customerId: "CUS-90451",
    channel: "Email",
    severity: "Medium",
    status: "Ready to resolve",
    complaint:
      "The SIP failed with a bank decline even though I had enough funds. Could this be because I changed my debit card recently?",
    rootCause: "NPCI mandate pause after bank account credential change",
    confidence: "84% confidence",
    diagnosisSummary:
      "Event history shows the mandate moved to pause state after the customer updated bank credentials. The failure is recoverable once mandate status is reactivated by the bank.",
    recommendedAction: {
      kind: "Manual follow-up",
      label: "Prompt customer to re-approve mandate",
      cta: "Send mandate reactivation steps",
      details:
        "Send the customer reactivation instructions and queue a soft reminder in 24 hours if the mandate stays paused.",
    },
    customerReply:
      "Hi Neha,\n\nWe found that your SIP mandate moved to a paused state after the recent bank credential change. Because of that, the bank declined the auto-debit even though funds were available.\n\nWe are sending the steps to reactivate the mandate. Once that is done, your next SIP installment can proceed normally.\n\nRegards,\nCustomer Support",
    events: [
      {
        time: "09:10",
        system: "Complaint intake",
        title: "Customer linked through UMRN",
        description:
          "Complaint matched to paused UMRN-554201 using the bank reference in the support email.",
        code: "MAP-121",
      },
      {
        time: "09:12",
        system: "NPCI registry",
        title: "Mandate entered pause state",
        description:
          "Registry captured status transition to paused after customer profile update at the bank.",
        code: "NPCI-311",
      },
      {
        time: "09:13",
        system: "Bank callback",
        title: "Debit rejected",
        description:
          "Debit attempt returned callback reason 'authorization revoked or paused'.",
        code: "BNK-R17",
      },
      {
        time: "09:14",
        system: "Resolution engine",
        title: "Customer follow-up required",
        description:
          "The agent determined that reactivation requires customer consent and cannot be auto-retried immediately.",
        code: "ACT-056",
      },
    ],
  },
  {
    id: "TKT-1089",
    customerName: "Siddharth Iyer",
    customerId: "CUS-44588",
    channel: "Chat",
    severity: "Low",
    status: "Ready to resolve",
    complaint:
      "Payment failed once last week but succeeded later. I just want to know what happened and whether my SIP is safe.",
    rootCause: "Transient bank downtime during first debit attempt",
    confidence: "81% confidence",
    diagnosisSummary:
      "The first debit attempt failed during a brief sponsor bank outage, and the same SIP was successfully processed in the scheduled retry batch two hours later.",
    recommendedAction: {
      kind: "Auto-resolve",
      label: "Mark case informational and close",
      cta: "Close with explanation",
      details:
        "No corrective action is needed. The SIP is already successful, so the agent can close the issue with a clear explanation and reassurance.",
    },
    customerReply:
      "Hi Siddharth,\n\nWe reviewed your SIP and found that the first debit attempt failed because the sponsor bank was briefly unavailable. The good news is that the automatic retry went through successfully the same day, so your SIP is active and safe.\n\nNo action is needed from your side.\n\nRegards,\nCustomer Support",
    events: [
      {
        time: "07:35",
        system: "Payments",
        title: "Initial debit failed",
        description:
          "Network timeout occurred while the sponsor bank endpoint was unavailable.",
        code: "PAY-503",
      },
      {
        time: "09:42",
        system: "Retry scheduler",
        title: "Automatic retry executed",
        description:
          "Retry batch re-submitted the debit request once bank availability normalized.",
        code: "ACT-011",
      },
      {
        time: "09:43",
        system: "Bank callback",
        title: "Debit successful",
        description:
          "Successful debit callback posted and order was released to the transaction queue.",
        code: "BNK-200",
      },
      {
        time: "09:44",
        system: "Resolution engine",
        title: "Informational closure recommended",
        description:
          "Agent classified the case as resolved and recommended customer reassurance only.",
        code: "CLS-014",
      },
    ],
  },
  {
    id: "TKT-1106",
    customerName: "Kavya Rao",
    customerId: "CUS-99210",
    channel: "Phone",
    severity: "High",
    status: "Needs review",
    complaint:
      "Installment failed because the account was marked blocked. I recently changed my primary bank in the app and now the SIP has stopped.",
    rootCause: "SIP still pointing to old bank mandate after bank-switch request",
    confidence: "86% confidence",
    diagnosisSummary:
      "The customer updated the primary bank in the app, but the SIP instruction stayed mapped to the legacy mandate. The old account then returned a blocked-account rejection.",
    recommendedAction: {
      kind: "Escalate",
      label: "Correct bank mapping before retry",
      cta: "Escalate bank-switch mismatch",
      details:
        "Ops should remap the SIP to the newly approved mandate before any retry is attempted. A direct retry against the old account would fail again.",
    },
    customerReply:
      "Hi Kavya,\n\nWe found that your SIP is still linked to the older bank mandate even though you changed the primary bank on the app. That older account returned a blocked-account rejection, which caused the installment to fail.\n\nWe have escalated this for a mapping correction. Once the SIP is linked to the right mandate, we will help retry the installment.\n\nRegards,\nCustomer Support",
    events: [
      {
        time: "11:02",
        system: "Profile service",
        title: "Primary bank updated",
        description:
          "Customer switched the preferred bank and completed a fresh mandate approval for the new account.",
        code: "PRF-220",
      },
      {
        time: "11:04",
        system: "SIP scheduler",
        title: "Legacy mandate still referenced",
        description:
          "Installment scheduler continued to use old bank mapping due to pending sync lag.",
        code: "SIP-412",
      },
      {
        time: "11:05",
        system: "Bank callback",
        title: "Old bank rejected debit",
        description:
          "Debit failed with blocked-account response from the legacy bank account.",
        code: "BNK-R44",
      },
      {
        time: "11:06",
        system: "Resolution engine",
        title: "Mapping correction required",
        description:
          "Agent flagged the case as configuration mismatch and prevented an incorrect retry.",
        code: "ACT-067",
      },
    ],
  },
];

export function getTicketById(id: string) {
  return sampleTickets.find((ticket) => ticket.id === id);
}

export function inferTicketFromComplaint(complaint: string) {
  const normalizedComplaint = complaint.toLowerCase();

  let bestTicket: TicketRecord | undefined;
  let bestScore = -1;

  for (const ticket of sampleTickets) {
    let score = 0;
    const searchableTerms = [
      ticket.id,
      ticket.customerName,
      ticket.customerId,
      ticket.rootCause,
      ticket.complaint,
      ...ticket.events.map((event) => `${event.title} ${event.description} ${event.code}`),
    ];

    for (const term of searchableTerms) {
      const normalizedTerm = term.toLowerCase();

      if (normalizedComplaint.includes(normalizedTerm)) {
        score += 6;
      } else {
        const fragments = normalizedTerm
          .split(/[^a-z0-9]+/i)
          .filter((fragment) => fragment.length > 3);

        for (const fragment of fragments) {
          if (normalizedComplaint.includes(fragment)) {
            score += 1;
          }
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestTicket = ticket;
    }
  }

  return bestTicket;
}
