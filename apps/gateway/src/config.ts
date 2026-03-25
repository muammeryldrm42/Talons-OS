import { parseNodeEnv } from "@talonsos/config";

export const gatewayConfig = {
  port: Number(process.env.PORT ?? 4000),
  host: process.env.HOST ?? "0.0.0.0",
  nodeEnv: parseNodeEnv(process.env.NODE_ENV)
};
