/**
 * Bunny CDN configuration
 */

export const BUNNY_CDN_BASE_URL = 'https://chromasmith-cdn.b-cdn.net/phleghm-website';

export const BUNNY_FOLDERS = {
  hero: `${BUNNY_CDN_BASE_URL}/hero`,
  shows: `${BUNNY_CDN_BASE_URL}/shows`,
} as const;

/**
 * Generate full CDN URL for an asset
 */
export function getBunnyCdnUrl(folder: 'hero' | 'shows', filename: string): string {
  return `${BUNNY_FOLDERS[folder]}/${filename}`;
}
