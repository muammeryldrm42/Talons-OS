export type IncomingChannelEvent = {
  workspaceId: string;
  connector: string;
  userExternalId: string;
  channelExternalId: string;
  messageExternalId: string;
  text?: string;
  attachments?: Array<{
    type: string;
    url: string;
    mimeType?: string;
    name?: string;
  }>;
  raw: unknown;
};

export type SendMessageInput = {
  workspaceId: string;
  conversationId: string;
  targetExternalId: string;
  text: string;
  replyToExternalId?: string;
};

export interface ChannelConnector {
  id: string;
  name: string;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  health(): Promise<{ ok: boolean; message?: string }>;
  handleIncoming(event: IncomingChannelEvent): Promise<void>;
  sendMessage(input: SendMessageInput): Promise<{ ok: boolean; externalId?: string }>;
}
