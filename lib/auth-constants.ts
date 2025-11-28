/**
 * Centralized authentication constants
 * Single source of truth for session values across the application
 * 
 * CRITICAL: All auth code must import from this file.
 * Never use hardcoded strings for session values.
 */

export const ADMIN_SESSION_COOKIE_NAME = 'admin_session';
export const ADMIN_SESSION_VALUE = 'authenticated';
