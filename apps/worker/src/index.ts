import { createLogger } from "@talonsos/observability";
import { queueNames } from "@talonsos/queue";

const logger = createLogger("worker");

logger.info("worker booting", {
  queueCount: queueNames.length,
  queues: queueNames
});
logger.info("processors pending implementation", {
  nextStep: "Attach BullMQ processors, retry policies, and dead-letter handling"
});
