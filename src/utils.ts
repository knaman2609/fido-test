/**
 * Validates if a URL is a valid data URL for an image.
 * Used for validating stored image data before display.
 */
export function isValidImageUrl(url: string): boolean {
  return url.startsWith('data:image/');
}
