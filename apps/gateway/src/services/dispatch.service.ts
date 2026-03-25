import { createHash } from "node:crypto";
import type { IncomingChannelEvent } from "@talonsos/connectors-sdk";
import { createLogger } from "@talonsos/observability";

const dispatchLogger = createLogger("gateway.dispatch");
const recentEventCache = new Map<string, number>();

export interface DispatchInboundOptions {
  dedupeWindowMs?: number;
  now?: Date;
}

function normalizeText(text: string | undefined) {
  const trimmed = text?.trim();
  return trimmed ? trimmed.replace(/\s+/g, " ") : undefined;
}

function buildConversationId(event: IncomingChannelEvent) {
  return `${event.workspaceId}:${event.connector}:${event.channelExternalId}`;
}

function buildEventKey(event: IncomingChannelEvent) {
  return createHash("sha1")
    .update(
      [
        event.workspaceId,
        event.connector,
        event.channelExternalId,
        event.messageExternalId,
        event.userExternalId
      ].join(":")
    )
    .digest("hex");
}

function pruneExpiredEvents(nowMs: number) {
  for (const [eventKey, expiresAt] of recentEventCache) {
    if (expiresAt <= nowMs) {
      recentEventCache.delete(eventKey);
    }
  }
}

function buildSummary(text: string | undefined, attachmentCount: number) {
  if (text) {
    return text.slice(0, 160);
  }

  if (attachmentCount > 0) {
    return `${attachmentCount} attachment(s) received`;
  }

  return "No text payload";
}

export async function dispatchInboundEvent(event: IncomingChannelEvent, options: DispatchInboundOptions = {}) {
  const now = options.now ?? new Date();
  const dedupeWindowMs = options.dedupeWindowMs ?? 60_000;
  const nowMs = now.getTime();
  const normalizedText = normalizeText(event.text);
  const attachmentCount = event.attachments?.length ?? 0;
  const conversationId = buildConversationId(event);
  const eventKey = buildEventKey(event);

  pruneExpiredEvents(nowMs);

  const isDuplicate = dedupeWindowMs > 0 && recentEventCache.has(eventKey);
  if (!isDuplicate && dedupeWindowMs > 0) {
    recentEventCache.set(eventKey, nowMs + dedupeWindowMs);
  }

  const result = {
    accepted: true,
    duplicate: isDuplicate,
    eventKey,
    conversationId,
    receivedAt: now.toISOString(),
    attachmentCount,
    summary: buildSummary(normalizedText, attachmentCount)
  };

  if (isDuplicate) {
    dispatchLogger.warn("duplicate inbound event ignored", {
      connector: event.connector,
      conversationId,
      eventKey
    });

    return result;
  }

  dispatchLogger.info("inbound event accepted", {
    connector: event.connector,
    conversationId,
    eventKey,
    attachmentCount
  });

  return {
    ...result,
    summary: buildSummary(normalizedText, attachmentCount)
  };
}
