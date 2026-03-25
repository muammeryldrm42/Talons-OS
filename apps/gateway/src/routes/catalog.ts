import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { getAgentById, listAgents, listAgentsByChannel } from "@talonsos/agents";
import { getSkillById, listSkills, listSkillsByTool, listSkillsByTrigger } from "@talonsos/skills";
import type { ChannelKind } from "@talonsos/core";

const channelSchema = z.enum(["webchat", "telegram", "discord", "slack", "webhook"]);
const triggerSchema = z.enum(["manual", "cron", "webhook"]);

export async function registerCatalogRoutes(app: FastifyInstance) {
  app.get("/agents", async (request, reply) => {
    const querySchema = z.object({
      channel: channelSchema.optional(),
      tool: z.string().trim().min(1).optional()
    });

    const parsed = querySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.status(400).send({
        ok: false,
        error: "Invalid query",
        issues: parsed.error.flatten()
      });
    }

    let agents = listAgents();

    if (parsed.data.channel) {
      agents = listAgentsByChannel(parsed.data.channel as ChannelKind);
    }

    if (parsed.data.tool) {
      agents = agents.filter((agent) => agent.tools.includes(parsed.data.tool as string));
    }

    return { ok: true, total: agents.length, data: agents };
  });

  app.get("/agents/:agentId", async (request, reply) => {
    const paramsSchema = z.object({ agentId: z.string().trim().min(1) });
    const parsed = paramsSchema.safeParse(request.params);

    if (!parsed.success) {
      return reply.status(400).send({ ok: false, error: "Invalid agent id" });
    }

    const agent = getAgentById(parsed.data.agentId);
    if (!agent) {
      return reply.status(404).send({ ok: false, error: "Agent not found" });
    }

    return { ok: true, data: agent };
  });

  app.get("/skills", async (request, reply) => {
    const querySchema = z.object({
      trigger: triggerSchema.optional(),
      tool: z.string().trim().min(1).optional()
    });

    const parsed = querySchema.safeParse(request.query);
    if (!parsed.success) {
      return reply.status(400).send({
        ok: false,
        error: "Invalid query",
        issues: parsed.error.flatten()
      });
    }

    let skills = listSkills();

    if (parsed.data.trigger) {
      skills = listSkillsByTrigger(parsed.data.trigger);
    }

    if (parsed.data.tool) {
      skills = listSkillsByTool(parsed.data.tool);
    }

    return { ok: true, total: skills.length, data: skills };
  });

  app.get("/skills/:skillId", async (request, reply) => {
    const paramsSchema = z.object({ skillId: z.string().trim().min(1) });
    const parsed = paramsSchema.safeParse(request.params);

    if (!parsed.success) {
      return reply.status(400).send({ ok: false, error: "Invalid skill id" });
    }

    const skill = getSkillById(parsed.data.skillId);
    if (!skill) {
      return reply.status(404).send({ ok: false, error: "Skill not found" });
    }

    return { ok: true, data: skill };
  });
}
