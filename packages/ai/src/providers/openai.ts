export const openAIProvider = {
  id: "openai",
  ready: () => Boolean(process.env.OPENAI_API_KEY)
};
