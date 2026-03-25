import { buildGatewayApp } from "./app.js";
import { gatewayConfig } from "./config.js";

async function main() {
  const app = await buildGatewayApp();
  await app.listen({ port: gatewayConfig.port, host: gatewayConfig.host });
  app.log.info(`gateway listening on http://${gatewayConfig.host}:${gatewayConfig.port}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
