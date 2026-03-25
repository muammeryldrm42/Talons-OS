import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { getAgentById, listAgents, listAgentsByChannel, listAgentsBySkillId } from "@talonsos/agents";
import {
  getSkillById,
  listSkills,
  listSkillsByAgentHint
} from "@talonsos/skills";
import type { AgentDefinition, ChannelKind } from "@talonsos/core";

const channelSchema = z.enum(["webchat", "telegram", "discord", "slack", "webhook"]);
const triggerSchema = z.enum(["manual", "cron", "webhook"]);

function uniqueById<T extends { id: string }>(items: T[]) {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
}

function resolveSkillsForAgent(agent: AgentDefinition) {
  const explicitSkills = (agent.skillIds ?? [])
    .map((skillId) => getSkillById(skillId))
    .filter((skill): skill is NonNullable<typeof skill> => Boolean(skill));

  const hintedSkills = listSkillsByAgentHint(agent.id);
  return uniqueById([...explicitSkills, ...hintedSkills]);
}

export async function registerCatalogRoutes(app: FastifyInstance) {
  app.get("/agents", async (request, reply) => {
    const querySchema = z.object({
      channel: channelSchema.optional(),
      tool: z.string().trim().min(1).optional(),
      skill: z.string().trim().min(1).optional()
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

    if (parsed.data.skill) {
      agents = agents.filter((agent) => agent.skillIds?.includes(parsed.data.skill as string));
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

    return {
      ok: true,
      data: {
        ...agent,
        resolvedSkills: resolveSkillsForAgent(agent)
      }
    };
  });

  app.get("/agents/:agentId/skills", async (request, reply) => {
    const paramsSchema = z.object({ agentId: z.string().trim().min(1) });
    const parsed = paramsSchema.safeParse(request.params);

    if (!parsed.success) {
      return reply.status(400).send({ ok: false, error: "Invalid agent id" });
    }

    const agent = getAgentById(parsed.data.agentId);
    if (!agent) {
      return reply.status(404).send({ ok: false, error: "Agent not found" });
    }

    const skills = resolveSkillsForAgent(agent);
    return { ok: true, total: skills.length, data: skills };
  });

  app.get("/skills", async (request, reply) => {
    const querySchema = z.object({
      trigger: triggerSchema.optional(),
      tool: z.string().trim().min(1).optional(),
      agent: z.string().trim().min(1).optional()
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
      skills = skills.filter((skill) => skill.triggers.includes(parsed.data.trigger));
    }

    if (parsed.data.tool) {
      skills = skills.filter((skill) => skill.tools.includes(parsed.data.tool as string));
    }

    if (parsed.data.agent) {
      skills = uniqueById([...skills.filter((skill) => skill.agentHints?.includes(parsed.data.agent as string)), ...listSkillsByAgentHint(parsed.data.agent)]);
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

  app.get("/skills/:skillId/agents", async (request, reply) => {
    const paramsSchema = z.object({ skillId: z.string().trim().min(1) });
    const parsed = paramsSchema.safeParse(request.params);

    if (!parsed.success) {
      return reply.status(400).send({ ok: false, error: "Invalid skill id" });
    }

    const skill = getSkillById(parsed.data.skillId);
    if (!skill) {
      return reply.status(404).send({ ok: false, error: "Skill not found" });
    }

    const referencedAgents = listAgentsBySkillId(skill.id);
    const hintedAgents = (skill.agentHints ?? []).map((agentId) => getAgentById(agentId)).filter(Boolean) as AgentDefinition[];
    const agents = uniqueById([...referencedAgents, ...hintedAgents]);

    return { ok: true, total: agents.length, data: agents };
  });

  app.get("/catalog/overview", async () => {
    const agents = listAgents();
    const skills = listSkills();

    const skillsByAgent = agents.map((agent) => ({
      agentId: agent.id,
      skills: resolveSkillsForAgent(agent).map((skill) => skill.id)
    }));

    const unassignedSkills = skills.filter((skill) => {
      const linkedByAgent = agents.some((agent) => agent.skillIds?.includes(skill.id));
      const linkedByHint = (skill.agentHints ?? []).length > 0;
      return !linkedByAgent && !linkedByHint;
    });

    return {
      ok: true,
      data: {
        totals: {
          agents: agents.length,
          skills: skills.length
        },
        skillsByAgent,
        unassignedSkills
      }
    };
  });
}
