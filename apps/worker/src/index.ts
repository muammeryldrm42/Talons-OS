import { queueNames } from "@talonsos/queue";

console.log("[worker] booting");
console.log("[worker] registered queues:", queueNames.join(", "));
console.log("[worker] add BullMQ processors here");
