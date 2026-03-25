import { buildGatewayApp } from "./app.js";
import { gatewayConfig } from "./config.js";
import { createLogger } from "@talonsos/observability";

const bootstrapLogger = createLogger("gateway.bootstrap");

async function main() {
  const app = await buildGatewayApp();
  await app.listen({ port: gatewayConfig.port, host: gatewayConfig.host });
  bootstrapLogger.info("gateway listening", {
    host: gatewayConfig.host,
    port: gatewayConfig.port,
    nodeEnv: gatewayConfig.nodeEnv,
    corsOrigins: gatewayConfig.corsOrigins
  });
}

main().catch((error) => {
  bootstrapLogger.error("gateway failed to start", error);
  process.exit(1);
});
