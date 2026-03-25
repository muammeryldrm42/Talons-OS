import { parseNodeEnv } from "@talonsos/config";
import { z } from "zod";

const gatewayEnvSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  HOST: z.string().trim().min(1).default("0.0.0.0"),
  NODE_ENV: z.string().optional(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  CORS_ORIGINS: z.string().optional(),
  BODY_LIMIT_BYTES: z.coerce.number().int().min(1_024).max(10 * 1_024 * 1_024).default(1_048_576),
  REQUEST_TIMEOUT_MS: z.coerce.number().int().min(1_000).max(120_000).default(30_000),
  TRUST_PROXY: z.string().optional(),
  INBOUND_AUTH_TOKEN: z.string().optional(),
  INBOUND_DEDUPE_WINDOW_MS: z.coerce.number().int().min(0).max(86_400_000).default(60_000)
});

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (value === undefined) {
    return fallback;
  }

  return value.toLowerCase() === "true";
}

function parseCsv(value: string | undefined, fallback: string[]) {
  const parsed = value?.split(",").map((item) => item.trim()).filter(Boolean);
  return parsed && parsed.length > 0 ? parsed : fallback;
}

function parseOptionalSecret(value: string | undefined) {
  const normalized = value?.trim();
  if (!normalized) {
    return undefined;
  }

  if (normalized.length < 8) {
    throw new Error("INBOUND_AUTH_TOKEN must be at least 8 characters when provided");
  }

  return normalized;
}

export function readGatewayConfig(source: Record<string, string | undefined> = process.env) {
  const env = gatewayEnvSchema.parse(source);

  return {
    port: env.PORT,
    host: env.HOST,
    nodeEnv: parseNodeEnv(env.NODE_ENV),
    logLevel: env.LOG_LEVEL,
    corsOrigins: parseCsv(env.CORS_ORIGINS, ["http://localhost:3000"]),
    bodyLimitBytes: env.BODY_LIMIT_BYTES,
    requestTimeoutMs: env.REQUEST_TIMEOUT_MS,
    trustProxy: parseBoolean(env.TRUST_PROXY, false),
    inboundAuthToken: parseOptionalSecret(env.INBOUND_AUTH_TOKEN),
    inboundDedupeWindowMs: env.INBOUND_DEDUPE_WINDOW_MS
  };
}

export type GatewayConfig = ReturnType<typeof readGatewayConfig>;

export const gatewayConfig = readGatewayConfig();
