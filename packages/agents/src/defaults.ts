import { registerAgent } from "./registry.js";

registerAgent({
  id: "ops-agent",
  name: "Ops Agent",
  description: "Handles operational triage, incidents, and support workflows.",
  tools: ["search.web", "webhook.call", "terminal.exec"],
  channels: ["webchat", "telegram", "discord", "slack"],
  tags: ["operations", "support", "triage"],
  skillIds: ["incident-triage", "status-digest"],
  capabilities: [
    {
      id: "incident-triage",
      description: "Classify incoming operational issues and propose next actions"
    },
    {
      id: "status-page-summary",
      description: "Summarize recent service status and external dependency health"
    }
  ]
});

registerAgent({
  id: "research-agent",
  name: "Research Agent",
  description: "Performs retrieval-heavy research with citations.",
  tools: ["search.web", "documents.parsePdf", "browser.navigate"],
  channels: ["webchat", "slack"],
  tags: ["research", "analysis"],
  skillIds: ["deep-research", "source-brief"],
  capabilities: [
    {
      id: "source-grounded-answers",
      description: "Generate answer drafts with evidence and citation snippets"
    }
  ]
});

registerAgent({
  id: "automation-agent",
  name: "Automation Agent",
  description: "Coordinates workflows, integrations, and repetitive process automation.",
  tools: ["webhook.call", "email.send", "calendar.createEvent"],
  channels: ["webchat", "slack", "webhook"],
  tags: ["automation", "workflows", "integrations"],
  skillIds: ["workflow-runner", "notification-fanout"],
  capabilities: [
    {
      id: "workflow-orchestration",
      description: "Trigger and monitor multi-step workflow automations"
    }
  ]
});
