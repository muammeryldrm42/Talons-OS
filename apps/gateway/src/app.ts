import { randomUUID } from "node:crypto";
import Fastify, { type FastifyRequest } from "fastify";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import { gatewayConfig } from "./config.js";
import { registerHealthRoutes } from "./routes/health.js";
import { registerInboundRoutes } from "./routes/inbound.js";

function readRequestIdHeader(request: FastifyRequest) {
  const header = request.headers["x-request-id"];
  return typeof header === "string" ? header : Array.isArray(header) ? header[0] : undefined;
}

function isCorsOriginAllowed(origin: string | undefined) {
  if (!origin) {
    return true;
  }

  return gatewayConfig.corsOrigins.includes("*") || gatewayConfig.corsOrigins.includes(origin);
}

export async function buildGatewayApp() {
  const requestStartedAt = new WeakMap<FastifyRequest, bigint>();
  const app = Fastify({
    logger: { level: gatewayConfig.logLevel },
    disableRequestLogging: true,
    bodyLimit: gatewayConfig.bodyLimitBytes,
    requestTimeout: gatewayConfig.requestTimeoutMs,
    trustProxy: gatewayConfig.trustProxy,
    genReqId(request) {
      return readRequestIdHeader(request) ?? randomUUID();
    }
  });

  await app.register(cors, {
    origin(origin, callback) {
      callback(null, isCorsOriginAllowed(origin));
    },
    credentials: true
  });
  await app.register(websocket);

  app.addHook("onRequest", async (request, reply) => {
    requestStartedAt.set(request, process.hrtime.bigint());
    reply.header("x-request-id", request.id);
  });

  app.addHook("onResponse", async (request, reply) => {
    const startedAt = requestStartedAt.get(request);
    const context: Record<string, unknown> = {
      requestId: request.id,
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode
    };

    if (startedAt !== undefined) {
      context.responseTimeMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      requestStartedAt.delete(request);
    }

    request.log.info(context, "request completed");
  });

  app.setNotFoundHandler(async (request, reply) => {
    return reply.status(404).send({
      ok: false,
      requestId: request.id,
      error: {
        code: "NOT_FOUND",
        message: `Route ${request.method} ${request.url} was not found`
      }
    });
  });

  app.setErrorHandler(async (error, request, reply) => {
    const statusCode =
      typeof error.statusCode === "number" && error.statusCode >= 400 && error.statusCode < 600
        ? error.statusCode
        : 500;

    request.log.error(
      {
        err: error,
        requestId: request.id,
        method: request.method,
        url: request.url,
        statusCode
      },
      "request failed"
    );

    return reply.status(statusCode).send({
      ok: false,
      requestId: request.id,
      error: {
        code: statusCode >= 500 ? "INTERNAL_ERROR" : "REQUEST_ERROR",
        message: statusCode >= 500 ? "Internal server error" : error.message
      }
    });
  });

  await registerHealthRoutes(app);
  await registerInboundRoutes(app);

  app.get("/ws", { websocket: true }, (socket, request) => {
    socket.send(
      JSON.stringify({
        type: "connected",
        service: "talonsos-gateway",
        requestId: request.id,
        timestamp: new Date().toISOString()
      })
    );
  });

  return app;
}
