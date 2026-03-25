export interface ModelChoiceInput {
  task: "chat" | "reasoning" | "embeddings";
  preferLocal?: boolean;
}

export function chooseModel(input: ModelChoiceInput) {
  if (input.preferLocal) return { provider: "ollama", model: "qwen2.5-coder:latest" };
  if (input.task === "embeddings") return { provider: "openai", model: "text-embedding-3-large" };
  return { provider: "openai", model: "gpt-5-mini" };
}
