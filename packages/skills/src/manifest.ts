export interface SkillManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  entry: string;
  permissions: string[];
  tools: string[];
  triggers: Array<"manual" | "cron" | "webhook">;
}
