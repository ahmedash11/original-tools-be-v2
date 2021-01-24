/**
 * Get files and fields for the request
 * @param request - Http request
 */
export function generateSlug(title: string): string {
  return title.replace(/\s+/g, '-').toLowerCase();
}
