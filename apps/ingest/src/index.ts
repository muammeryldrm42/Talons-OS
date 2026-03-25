import { createLogger } from "@talonsos/observability";

const logger = createLogger("ingest");

logger.info("ingest service ready", {
  nextStep: "Wire PDF, DOCX, HTML loaders, chunking, and vector upserts"
});
