export function getPublicEnv() {
  return {
    appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    gatewayUrl: process.env.NEXT_PUBLIC_GATEWAY_URL ?? "http://localhost:4000"
  };
}
