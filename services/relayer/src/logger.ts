import { requestNamespace } from './middleware/requestId'; // Import the CLS namespace

// A simple logger implementation. In a real application, this would likely be Winston, Pino, etc.
// This example assumes a basic console logger that outputs JSON.
// For this to work, 'cls-hooked' must be installed (see services/relayer/src/middleware/requestId.ts for details).

interface LogEntry {
  level: string;
  timestamp: string;
  requestId?: string;
  message: string;
  [key: string]: any; // Allow arbitrary additional data
}

const formatLogEntry = (level: string, message: string, data?: Record<string, any>): LogEntry => {
  const entry: LogEntry = {
    level,
    timestamp: new Date().toISOString(),
    message,
    ...data,
  };

  // Get requestId from CLS context if available
  const requestId = requestNamespace.get('requestId');
  if (requestId) {
    entry.requestId = requestId;
  }

  return entry;
};

export const logger = {
  info: (message: string, data?: Record<string, any>) => {
    console.info(JSON.stringify(formatLogEntry('info', message, data)));
  },
  warn: (message: string, data?: Record<string, any>) => {
    console.warn(JSON.stringify(formatLogEntry('warn', message, data)));
  },
  error: (message: string, error?: Error, data?: Record<string, any>) => {
    const errorData = error ? { error: error.message, stack: error.stack } : {};
    console.error(JSON.stringify(formatLogEntry('error', message, { ...errorData, ...data })));
  },
  debug: (message: string, data?: Record<string, any>) => {
    // Only log debug messages if environment variable is set, for example
    if (process.env.NODE_ENV === 'development' || process.env.LOG_LEVEL === 'debug') {
      console.debug(JSON.stringify(formatLogEntry('debug', message, data)));
    }
  },
};
