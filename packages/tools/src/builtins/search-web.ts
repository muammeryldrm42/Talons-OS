import { z } from "zod";
import { defineTool } from "../registry.js";

export const searchWebTool = defineTool({
  id: "search.web",
  description: "Search the public web.",
  inputSchema: z.object({ query: z.string().min(1) }),
  async execute(input: { query: string }) {
    return {
      ok: true,
      note: `Hook your preferred search provider here for query: ${input.query}`
    };
  }
});
