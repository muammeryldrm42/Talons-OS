export type ChannelKind = "webchat" | "telegram" | "discord" | "slack" | "webhook";

export interface AgentCapability {
  id: string;
  description: string;
}

export interface AgentDefinition {
  id: string;
  name: string;
  description: string;
  tools: string[];
  channels: ChannelKind[];
  tags?: string[];
  capabilities?: AgentCapability[];
  skillIds?: string[];
}

export interface ConversationRef {
  id: string;
  workspaceId: string;
  channelId?: string;
  agentId?: string;
}
