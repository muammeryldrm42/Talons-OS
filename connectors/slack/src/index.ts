import type { ChannelConnector, IncomingChannelEvent, SendMessageInput } from "@talonsos/connectors-sdk";

export function createSlackConnector(): ChannelConnector {
  return {
    id: "slack",
    name: "Slack",
    async connect() {
      console.log("[connector:slack] connect");
    },
    async disconnect() {
      console.log("[connector:slack] disconnect");
    },
    async health() {
      return { ok: true, message: "Slack bot token required at runtime" };
    },
    async handleIncoming(event: IncomingChannelEvent) {
      console.log("[connector:slack] inbound", event.messageExternalId);
    },
    async sendMessage(input: SendMessageInput) {
      console.log("[connector:slack] send", input.targetExternalId);
      return { ok: true, externalId: `${input.targetExternalId}:sent` };
    }
  };
}
