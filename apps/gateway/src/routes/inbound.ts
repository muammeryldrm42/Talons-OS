import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { gatewayConfig } from "../config.js";
import { dispatchInboundEvent } from "../services/dispatch.service.js";

const nonEmptyString = z.string().trim().min(1);

const inboundBodySchema = z.object({
  workspaceId: nonEmptyString,
  connector: nonEmptyString.optional(),
  userExternalId: nonEmptyString,
  channelExternalId: nonEmptyString,
  messageExternalId: nonEmptyString,
  text: z.string().trim().optional().transform((value) => value || undefined),
  attachments: z
    .array(
      z.object({
        type: nonEmptyString,
        url: z.string().url(),
        mimeType: nonEmptyString.optional(),
        name: nonEmptyString.optional()
      })
    )
    .default([]),
  raw: z.unknown().optional().default({})
});

const inboundEventSchema = inboundBodySchema.extend({
  connector: nonEmptyString
}).refine((value) => value.text !== undefined || value.attachments.length > 0, {
  message: "Provide text or at least one attachment",
  path: ["text"]
});

const connectorParamSchema = z.object({
  connector: nonEmptyString
});

function readInboundAuthToken(request: FastifyRequest) {
  const authorization = request.headers.authorization;
  if (typeof authorization === "string" && authorization.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }

  const tokenHeader = request.headers["x-talons-token"];
  return typeof tokenHeader === "string" ? tokenHeader.trim() : undefined;
}

function reject(reply: FastifyReply, statusCode: number, error: string, issues?: unknown) {
  return reply.status(statusCode).send({
    ok: false,
    error,
    issues
  });
}

async function handleInbound(
  request: FastifyRequest<{ Body: unknown; Params: { connector?: string } }>,
  reply: FastifyReply
) {
  if (gatewayConfig.inboundAuthToken) {
    const token = readInboundAuthToken(request);
    if (token !== gatewayConfig.inboundAuthToken) {
      return reject(reply, 401, "Unauthorized inbound request");
    }
  }

  const routeConnectorResult = connectorParamSchema.safeParse(request.params);
  const routeConnector = routeConnectorResult.success ? routeConnectorResult.data.connector : undefined;

  const parsedBody = inboundBodySchema.safeParse(request.body);
  if (!parsedBody.success) {
    return reject(reply, 400, "Invalid inbound payload", parsedBody.error.flatten());
  }

  if (routeConnector && parsedBody.data.connector && routeConnector !== parsedBody.data.connector) {
    return reject(reply, 409, "Connector in route does not match payload connector");
  }

  const parsedEvent = inboundEventSchema.safeParse({
    ...parsedBody.data,
    connector: routeConnector ?? parsedBody.data.connector
  });

  if (!parsedEvent.success) {
    return reject(reply, 400, "Invalid inbound payload", parsedEvent.error.flatten());
  }

  const result = await dispatchInboundEvent(parsedEvent.data, {
    dedupeWindowMs: gatewayConfig.inboundDedupeWindowMs
  });

  return reply.send({ ok: true, requestId: request.id, result });
}

export async function registerInboundRoutes(app: FastifyInstance) {
  app.post("/inbound", handleInbound);
  app.post("/inbound/:connector", handleInbound);
}
