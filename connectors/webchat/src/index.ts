import type { ChannelConnector, IncomingChannelEvent, SendMessageInput } from "@talonsos/connectors-sdk";

export function createWebchatConnector(): ChannelConnector {
  return {
    id: "webchat",
    name: "Webchat",
    async connect() {
      console.log("[connector:webchat] connect");
    },
    async disconnect() {
      console.log("[connector:webchat] disconnect");
    },
    async health() {
      return { ok: true, message: "HTTP/SSE chat surface" };
    },
    async handleIncoming(event: IncomingChannelEvent) {
      console.log("[connector:webchat] inbound", event.messageExternalId);
    },
    async sendMessage(input: SendMessageInput) {
      console.log("[connector:webchat] send", input.targetExternalId);
      return { ok: true, externalId: `${input.targetExternalId}:sent` };
    }
  };
}
