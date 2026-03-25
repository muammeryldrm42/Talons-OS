import type { ToolDefinition } from "./sdk.js";

const toolRegistry = new Map<string, ToolDefinition>();

export function defineTool<TInput, TOutput>(tool: ToolDefinition<TInput, TOutput>) {
  toolRegistry.set(tool.id, tool as ToolDefinition);
  return tool;
}

export function getTool(id: string) {
  return toolRegistry.get(id);
}

export function listTools() {
  return Array.from(toolRegistry.values());
}
