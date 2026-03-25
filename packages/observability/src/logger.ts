export type LogLevel = "debug" | "info" | "warn" | "error";
export type LogContext = Record<string, unknown>;
type MessageOrContext = string | LogContext;

export interface Logger {
  child(context: LogContext): Logger;
  debug(entry: MessageOrContext, context?: LogContext): void;
  info(entry: MessageOrContext, context?: LogContext): void;
  warn(entry: MessageOrContext, context?: LogContext): void;
  error(entry: MessageOrContext | Error, context?: LogContext): void;
}

const logLevelWeight: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40
};

function parseLogLevel(value: string | undefined): LogLevel {
  switch (value) {
    case "debug":
    case "info":
    case "warn":
    case "error":
      return value;
    default:
      return "info";
  }
}

function isPlainObject(value: unknown): value is LogContext {
  return typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof Error);
}

function serializeError(error: Error) {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack
  };
}

function writeLog(
  level: LogLevel,
  scope: string,
  baseContext: LogContext,
  minLevel: LogLevel,
  first?: unknown,
  second?: unknown
) {
  if (logLevelWeight[level] < logLevelWeight[minLevel]) {
    return;
  }

  const entry: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    level,
    scope,
    ...baseContext
  };

  if (typeof first === "string") {
    entry.message = first;
    if (isPlainObject(second)) {
      Object.assign(entry, second);
    } else if (second instanceof Error) {
      entry.error = serializeError(second);
    } else if (second !== undefined) {
      entry.data = second;
    }
  } else if (first instanceof Error) {
    entry.error = serializeError(first);
    if (isPlainObject(second)) {
      Object.assign(entry, second);
    } else if (second !== undefined) {
      entry.data = second;
    }
  } else if (isPlainObject(first)) {
    Object.assign(entry, first);
    if (second instanceof Error) {
      entry.error = serializeError(second);
    } else if (second !== undefined) {
      entry.data = second;
    }
  } else if (first !== undefined) {
    entry.data = first;
    if (second !== undefined) {
      entry.extra = second;
    }
  }

  const sink = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
  sink(JSON.stringify(entry));
}

export function createLogger(
  scope: string,
  baseContext: LogContext = {},
  minLevel: LogLevel = parseLogLevel(process.env.LOG_LEVEL)
): Logger {
  return {
    child(context) {
      return createLogger(scope, { ...baseContext, ...context }, minLevel);
    },
    debug(first: MessageOrContext, second?: LogContext) {
      writeLog("debug", scope, baseContext, minLevel, first, second);
    },
    info(first: MessageOrContext, second?: LogContext) {
      writeLog("info", scope, baseContext, minLevel, first, second);
    },
    warn(first: MessageOrContext, second?: LogContext) {
      writeLog("warn", scope, baseContext, minLevel, first, second);
    },
    error(first: MessageOrContext | Error, second?: LogContext) {
      writeLog("error", scope, baseContext, minLevel, first, second);
    }
  };
}

export const logger = createLogger("talonsos");
