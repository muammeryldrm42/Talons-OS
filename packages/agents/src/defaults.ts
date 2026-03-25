import { registerAgent } from "./registry.js";

registerAgent({
  id: "ops-agent",
  name: "Ops Agent",
  description: "Handles operational and support tasks.",
  tools: ["search.web", "webhook.call"],
  channels: ["webchat", "telegram", "discord", "slack"]
});

registerAgent({
  id: "research-agent",
  name: "Research Agent",
  description: "Performs retrieval-heavy research with citations.",
  tools: ["search.web", "documents.parsePdf"],
  channels: ["webchat", "slack"]
});
