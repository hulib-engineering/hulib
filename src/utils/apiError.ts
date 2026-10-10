/**
 * Shared extraction of a human-readable message out of an RTK Query
 * `.unwrap()` rejection.
 *
 * The rejection is one of three shapes depending on the status:
 *  - 422 returns the raw `FetchBaseQueryError` (`{ status, data }`), so the
 *    backend payload survives on `.data`.
 *  - every other status is re-thrown by `libs/services/api.ts` as
 *    `new Error('error_contact_admin')`, which carries no detail.
 *  - anything unmapped lands here as `undefined`.
 *
 * This module is intentionally pure: no React, no i18n, no store. The caller
 * owns the translated fallback string.
 */

/**
 * Sentinel thrown by `libs/services/api.ts` when the backend gave us nothing
 * usable. Matched by string equality because there is no shared import path
 * between the two modules that avoids a cycle — if that literal is ever
 * reworded there, this must be updated to match.
 */
export const GENERIC_ERROR_KEY = 'error_contact_admin';

type FieldErrorLike = {
  field?: unknown;
  fieldErrors?: unknown;
  errors?: unknown;
  message?: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const toText = (value: unknown): string | null => {
  if (typeof value === 'string') {
    return value.trim() || null;
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }
  return null;
};

/**
 * Flattens one `errors` value into lines. Handles the array form
 * (`['too short', 'invalid']`), the per-field wrapper form
 * (`{ fieldErrors: [...] }`), and plain strings. Anything else yields no line
 * rather than being stringified into `[object Object]`.
 */
const linesFromValue = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.flatMap(linesFromValue);
  }

  if (isRecord(value)) {
    const { fieldErrors, errors, message } = value as FieldErrorLike;
    const nested = fieldErrors ?? errors ?? message;
    return nested === undefined ? [] : linesFromValue(nested);
  }

  const text = toText(value);
  return text ? [text] : [];
};

const joinLines = (lines: string[]): string | null => {
  const unique = Array.from(new Set(lines));
  return unique.length ? unique.join('\n') : null;
};

/**
 * Returns the backend's own wording when there is any, or `null` when the
 * rejection carries no detail — in which case the caller should show its own
 * translated fallback. Field errors win over a generic `message`.
 */
export function getApiErrorMessage(error: unknown): string | null {
  if (!isRecord(error)) {
    return null;
  }

  const data = isRecord(error.data) ? error.data : undefined;

  if (data) {
    const fromErrors = joinLines(linesFromValue(data.errors));
    if (fromErrors) {
      return fromErrors;
    }

    const fromMessage = toText(data.message);
    if (fromMessage) {
      return fromMessage;
    }
  }

  const fromError = toText(error.message);
  if (!fromError || fromError === GENERIC_ERROR_KEY) {
    return null;
  }

  return fromError;
}
