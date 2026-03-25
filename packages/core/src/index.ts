export type ChannelKind = "webchat" | "telegram" | "discord" | "slack" | "webhook";

export interface AgentDefinition {
  id: string;
  name: string;
  description: string;
  tools: string[];
  channels: ChannelKind[];
}

export interface ConversationRef {
  id: string;
  workspaceId: string;
  channelId?: string;
  agentId?: string;
}
