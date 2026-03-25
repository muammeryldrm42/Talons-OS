import { z } from "zod";
import { defineTool } from "../registry.js";

export const webhookCallTool = defineTool({
  id: "webhook.call",
  description: "Call an external webhook.",
  inputSchema: z.object({
    url: z.string().url(),
    method: z.enum(["GET", "POST"]).default("POST"),
    body: z.unknown().optional()
  }),
  async execute(input: { url: string; method?: "GET" | "POST"; body?: unknown }) {
    return {
      ok: true,
      note: `Send ${input.method ?? "POST"} to ${input.url} in the real implementation`
    };
  }
});
