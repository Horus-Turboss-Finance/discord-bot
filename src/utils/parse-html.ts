export function parseHtmlWithoutExternalAssets(document: Document): string {
  const cleanDoc = document.cloneNode(true) as Document;
  cleanDoc.querySelectorAll('script').forEach((el) => el.remove());
  cleanDoc.querySelectorAll('link[rel="stylesheet"]').forEach((el) => el.remove());

  return '<!DOCTYPE html>\n' + cleanDoc.documentElement.outerHTML;
}