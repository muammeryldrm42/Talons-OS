import type { AgentDefinition, ChannelKind } from "@talonsos/core";

const registry = new Map<string, AgentDefinition>();

export function registerAgent(agent: AgentDefinition) {
  if (!agent.id.trim()) {
    throw new Error("Agent id is required");
  }

  registry.set(agent.id, {
    ...agent,
    tags: agent.tags?.map((tag) => tag.trim()).filter(Boolean) ?? [],
    skillIds: agent.skillIds?.map((skillId) => skillId.trim()).filter(Boolean) ?? []
  });

  return agent;
}

export function listAgents() {
  return Array.from(registry.values());
}

export function getAgentById(agentId: string) {
  return registry.get(agentId);
}

export function listAgentsByChannel(channel: ChannelKind) {
  return listAgents().filter((agent) => agent.channels.includes(channel));
}

export function listAgentsByTool(toolId: string) {
  return listAgents().filter((agent) => agent.tools.includes(toolId));
}

export function listAgentsBySkillId(skillId: string) {
  return listAgents().filter((agent) => agent.skillIds?.includes(skillId));
}
