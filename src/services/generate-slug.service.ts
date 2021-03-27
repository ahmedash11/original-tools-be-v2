/**
 * Get files and fields for the request
 * @param request - Http request
 */
export function generateSlug(title: string): string {
  return title.replace(/\s+/g, '-').toLowerCase();
}

export function concatSlug(titles: string[]): string {
  return titles.reduce(function (prevVal, currVal) {
    return prevVal + generateSlug(currVal);
  }, '');
}
