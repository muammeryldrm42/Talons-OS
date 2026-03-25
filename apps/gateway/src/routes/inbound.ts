import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { dispatchInboundEvent } from "../services/dispatch.service.js";

const inboundSchema = z.object({
  workspaceId: z.string(),
  connector: z.string(),
  userExternalId: z.string(),
  channelExternalId: z.string(),
  messageExternalId: z.string(),
  text: z.string().optional(),
  attachments: z.array(z.object({
    type: z.string(),
    url: z.string().url(),
    mimeType: z.string().optional(),
    name: z.string().optional()
  })).optional(),
  raw: z.unknown().optional().default({})
});

export async function registerInboundRoutes(app: FastifyInstance) {
  app.post("/inbound", async (request, reply) => {
    const parsed = inboundSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({
        ok: false,
        error: "Invalid inbound payload",
        issues: parsed.error.flatten()
      });
    }

    const result = await dispatchInboundEvent(parsed.data);
    return reply.send({ ok: true, result });
  });
}
