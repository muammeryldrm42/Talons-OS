import type { ChannelConnector, IncomingChannelEvent, SendMessageInput } from "@talonsos/connectors-sdk";

export function createWebhookConnector(): ChannelConnector {
  return {
    id: "webhook",
    name: "Webhook",
    async connect() {
      console.log("[connector:webhook] connect");
    },
    async disconnect() {
      console.log("[connector:webhook] disconnect");
    },
    async health() {
      return { ok: true, message: "Generic inbound/outbound webhook" };
    },
    async handleIncoming(event: IncomingChannelEvent) {
      console.log("[connector:webhook] inbound", event.messageExternalId);
    },
    async sendMessage(input: SendMessageInput) {
      console.log("[connector:webhook] send", input.targetExternalId);
      return { ok: true, externalId: `${input.targetExternalId}:sent` };
    }
  };
}
