import type { SkillManifest } from "./manifest.js";

const skillRegistry = new Map<string, SkillManifest>();

export function registerSkill(skill: SkillManifest) {
  skillRegistry.set(skill.id, skill);
  return skill;
}

export function listSkills() {
  return Array.from(skillRegistry.values());
}
