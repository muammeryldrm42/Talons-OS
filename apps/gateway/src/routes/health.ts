import type { FastifyInstance } from "fastify";
import { gatewayConfig } from "../config.js";

function createStatusPayload(status: "alive" | "ready") {
  return {
    ok: true,
    service: "gateway",
    status,
    environment: gatewayConfig.nodeEnv,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime())
  };
}

export async function registerHealthRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return {
      ...createStatusPayload("alive"),
      endpoints: ["/health", "/healthz", "/ready", "/readyz", "/inbound", "/inbound/:connector", "/ws"]
    };
  });

  app.get("/health", async () => {
    return createStatusPayload("alive");
  });

  app.get("/healthz", async () => {
    return createStatusPayload("alive");
  });

  app.get("/ready", async () => {
    return {
      ...createStatusPayload("ready"),
      checks: {
        configuration: true,
        inboundRoutes: true,
        websocket: true
      }
    };
  });

  app.get("/readyz", async () => {
    return createStatusPayload("ready");
  });
}
