/**
 * Production-safe logger that prevents leaking sensitive tokens,
 * personal user data, and detailed stack traces in production environments.
 */

const isDev = Boolean(import.meta?.env?.DEV ?? (typeof process !== "undefined" && process.env?.NODE_ENV !== "production"));

export const logger = {
  log: (...args) => {
    if (isDev) {
      console.log(...args);
    }
  },

  warn: (...args) => {
    if (isDev) {
      console.warn(...args);
    }
  },

  error: (...args) => {
    if (isDev) {
      console.error(...args);
    }
    // In production, can optionally forward sanitized error to error telemetry (e.g. Sentry/datadog)
  },

  info: (...args) => {
    if (isDev) {
      console.info(...args);
    }
  },

  debug: (...args) => {
    if (isDev) {
      console.debug(...args);
    }
  },
};

export default logger;
