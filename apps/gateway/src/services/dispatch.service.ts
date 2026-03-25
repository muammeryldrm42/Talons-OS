import type { IncomingChannelEvent } from "@talonsos/connectors-sdk";

export async function dispatchInboundEvent(event: IncomingChannelEvent) {
  return {
    accepted: true,
    conversationId: `${event.connector}:${event.channelExternalId}`,
    summary: event.text?.slice(0, 120) ?? "No text payload"
  };
}
