import Fastify from "fastify";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import { registerHealthRoutes } from "./routes/health.js";
import { registerInboundRoutes } from "./routes/inbound.js";

export async function buildGatewayApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });
  await app.register(websocket);

  await registerHealthRoutes(app);
  await registerInboundRoutes(app);

  app.get("/ws", { websocket: true }, (socket) => {
    socket.send(JSON.stringify({ type: "connected", service: "talonsos-gateway" }));
  });

  return app;
}
