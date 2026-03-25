import type { ChannelConnector, IncomingChannelEvent, SendMessageInput } from "@talonsos/connectors-sdk";

export function createTelegramConnector(): ChannelConnector {
  return {
    id: "telegram",
    name: "Telegram",
    async connect() {
      console.log("[connector:telegram] connect");
    },
    async disconnect() {
      console.log("[connector:telegram] disconnect");
    },
    async health() {
      return { ok: true, message: "Telegram bot token required at runtime" };
    },
    async handleIncoming(event: IncomingChannelEvent) {
      console.log("[connector:telegram] inbound", event.messageExternalId);
    },
    async sendMessage(input: SendMessageInput) {
      console.log("[connector:telegram] send", input.targetExternalId);
      return { ok: true, externalId: `${input.targetExternalId}:sent` };
    }
  };
}
