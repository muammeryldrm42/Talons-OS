import type { AgentDefinition } from "@talonsos/core";

const registry = new Map<string, AgentDefinition>();

export function registerAgent(agent: AgentDefinition) {
  registry.set(agent.id, agent);
  return agent;
}

export function listAgents() {
  return Array.from(registry.values());
}
