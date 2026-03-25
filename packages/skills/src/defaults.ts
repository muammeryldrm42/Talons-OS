import { registerSkill } from "./registry.js";

registerSkill({
  id: "incident-triage",
  name: "Incident Triage",
  version: "1.0.0",
  description: "Normalize incident events and produce a priority-scored triage summary.",
  entry: "skills/incident-triage/index.ts",
  permissions: ["workspace.read", "tools.run"],
  tools: ["search.web", "webhook.call"],
  triggers: ["manual", "webhook"],
  tags: ["operations", "alerts"],
  agentHints: ["ops-agent"],
  config: [
    { key: "severity_threshold", type: "number", required: false, description: "Minimum severity to escalate" },
    { key: "escalation_webhook", type: "string", required: false, description: "Optional webhook for escalation notifications" }
  ]
});

registerSkill({
  id: "status-digest",
  name: "Status Digest",
  version: "1.0.0",
  description: "Build daily/weekly status digests from incidents and service health signals.",
  entry: "skills/status-digest/index.ts",
  permissions: ["workspace.read", "tools.run"],
  tools: ["search.web", "email.send"],
  triggers: ["cron", "manual"],
  tags: ["operations", "reporting"],
  agentHints: ["ops-agent"]
});

registerSkill({
  id: "deep-research",
  name: "Deep Research",
  version: "1.0.0",
  description: "Collect sources, rank trust, and produce citation-rich synthesis output.",
  entry: "skills/deep-research/index.ts",
  permissions: ["workspace.read", "tools.run"],
  tools: ["search.web", "documents.parsePdf", "browser.navigate"],
  triggers: ["manual"],
  tags: ["research", "knowledge"],
  agentHints: ["research-agent"]
});

registerSkill({
  id: "source-brief",
  name: "Source Brief",
  version: "1.0.0",
  description: "Turn source bundles into concise executive briefs with key citations.",
  entry: "skills/source-brief/index.ts",
  permissions: ["workspace.read", "tools.run"],
  tools: ["documents.parsePdf", "search.web"],
  triggers: ["manual"],
  tags: ["research", "briefing"],
  agentHints: ["research-agent"]
});

registerSkill({
  id: "workflow-runner",
  name: "Workflow Runner",
  version: "1.0.0",
  description: "Execute predefined workflow recipes and fan out notifications.",
  entry: "skills/workflow-runner/index.ts",
  permissions: ["workspace.read", "workspace.write", "tools.run"],
  tools: ["webhook.call", "email.send", "calendar.createEvent"],
  triggers: ["manual", "cron", "webhook"],
  tags: ["automation", "integration"],
  agentHints: ["automation-agent"],
  config: [
    { key: "recipe_id", type: "string", required: true, description: "Workflow recipe identifier" },
    { key: "notify_email", type: "boolean", required: false, description: "Send completion email" }
  ]
});

registerSkill({
  id: "notification-fanout",
  name: "Notification Fanout",
  version: "1.0.0",
  description: "Broadcast workflow outcomes to channel, email, and webhook targets.",
  entry: "skills/notification-fanout/index.ts",
  permissions: ["workspace.read", "workspace.write", "tools.run"],
  tools: ["webhook.call", "email.send"],
  triggers: ["manual", "webhook"],
  tags: ["automation", "notifications"],
  agentHints: ["automation-agent"]
});
