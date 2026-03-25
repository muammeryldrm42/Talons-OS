export function formatCitation(source: string, locator?: string) {
  return locator ? `${source}#${locator}` : source;
}
