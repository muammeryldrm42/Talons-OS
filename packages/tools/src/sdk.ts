export interface ToolContext {
  workspaceId: string;
  userId?: string;
  agentId?: string;
  conversationId?: string;
  secrets: {
    get(key: string): Promise<string | null>;
  };
}

export interface ToolDefinition<TInput = unknown, TOutput = unknown> {
  id: string;
  description: string;
  inputSchema: unknown;
  execute(input: TInput, context: ToolContext): Promise<TOutput>;
}
