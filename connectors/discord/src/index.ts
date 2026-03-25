import type { ChannelConnector, IncomingChannelEvent, SendMessageInput } from "@talonsos/connectors-sdk";

export function createDiscordConnector(): ChannelConnector {
  return {
    id: "discord",
    name: "Discord",
    async connect() {
      console.log("[connector:discord] connect");
    },
    async disconnect() {
      console.log("[connector:discord] disconnect");
    },
    async health() {
      return { ok: true, message: "Discord bot token required at runtime" };
    },
    async handleIncoming(event: IncomingChannelEvent) {
      console.log("[connector:discord] inbound", event.messageExternalId);
    },
    async sendMessage(input: SendMessageInput) {
      console.log("[connector:discord] send", input.targetExternalId);
      return { ok: true, externalId: `${input.targetExternalId}:sent` };
    }
  };
}
