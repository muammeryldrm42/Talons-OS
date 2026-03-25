export type SkillTrigger = "manual" | "cron" | "webhook";

export interface SkillConfigField {
  key: string;
  type: "string" | "number" | "boolean";
  required?: boolean;
  description?: string;
}

export interface SkillManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  entry: string;
  permissions: string[];
  tools: string[];
  triggers: SkillTrigger[];
  tags?: string[];
  config?: SkillConfigField[];
  agentHints?: string[];
}
