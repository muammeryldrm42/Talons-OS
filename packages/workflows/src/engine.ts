export interface WorkflowTrigger {
  kind: "manual" | "cron" | "webhook";
  value?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  trigger: WorkflowTrigger;
  steps: string[];
}
