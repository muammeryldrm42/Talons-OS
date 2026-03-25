import { z } from "zod";

const NodeEnv = z.enum(["development", "test", "production"]);

export function parseNodeEnv(value: string | undefined) {
  return NodeEnv.catch("development").parse(value);
}

export const appEnvSchema = z.object({
  NODE_ENV: NodeEnv.default("development"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  GATEWAY_URL: z.string().url().default("http://localhost:4000"),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  QDRANT_URL: z.string().url(),
  S3_ENDPOINT: z.string().url(),
  S3_ACCESS_KEY: z.string().min(1),
  S3_SECRET_KEY: z.string().min(1),
  S3_BUCKET: z.string().min(1),
  ENCRYPTION_KEY: z.string().min(16),
  SESSION_SECRET: z.string().min(16)
});

export type AppEnv = z.infer<typeof appEnvSchema>;

export function readAppEnv(source: Record<string, string | undefined> = process.env) {
  return appEnvSchema.parse(source);
}
