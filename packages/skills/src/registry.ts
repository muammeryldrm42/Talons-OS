import type { SkillManifest, SkillTrigger } from "./manifest.js";

const skillRegistry = new Map<string, SkillManifest>();

export function registerSkill(skill: SkillManifest) {
  if (!skill.id.trim()) {
    throw new Error("Skill id is required");
  }

  skillRegistry.set(skill.id, {
    ...skill,
    tags: skill.tags?.map((tag) => tag.trim()).filter(Boolean) ?? [],
    agentHints: skill.agentHints?.map((agentId) => agentId.trim()).filter(Boolean) ?? []
  });

  return skill;
}

export function listSkills() {
  return Array.from(skillRegistry.values());
}

export function getSkillById(skillId: string) {
  return skillRegistry.get(skillId);
}

export function listSkillsByTrigger(trigger: SkillTrigger) {
  return listSkills().filter((skill) => skill.triggers.includes(trigger));
}

export function listSkillsByTool(toolId: string) {
  return listSkills().filter((skill) => skill.tools.includes(toolId));
}
