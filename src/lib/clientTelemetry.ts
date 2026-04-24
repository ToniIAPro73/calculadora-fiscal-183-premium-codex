type ClientTelemetryMetadata = Record<string, string | number | boolean | null | undefined>;

const SENSITIVE_KEY_PATTERN = /(name|tax|document|passport|nie|id|date|range)/i;

export function recordClientEvent(eventName: string, metadata: ClientTelemetryMetadata = {}) {
  const sanitizedMetadata = Object.fromEntries(
    Object.entries(metadata).filter(([key, value]) => !SENSITIVE_KEY_PATTERN.test(key) && value !== undefined),
  );

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('fiscal183:client-event', {
        detail: {
          eventName,
          metadata: sanitizedMetadata,
        },
      }),
    );
  }

  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.warn(`[fiscal183] ${eventName}`, sanitizedMetadata);
  }
}

export function recordClientError(eventName: string, error: unknown, metadata: ClientTelemetryMetadata = {}) {
  recordClientEvent(eventName, {
    ...metadata,
    errorType: error instanceof Error ? error.name : typeof error,
  });
}
