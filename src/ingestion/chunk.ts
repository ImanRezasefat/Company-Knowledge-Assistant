export function chunkText(
  text: string,
  chunkSize = 1000,
  overlap = 200,
): string[] {
  if (chunkSize <= 0 || overlap < 0 || overlap >= chunkSize) {
    throw new Error("Invalid chunk size or overlap");
  }

  const cleanText = text.replace(/\s+/g, " ").trim();
  const chunks: string[] = [];

  let start = 0;

  while (start < cleanText.length) {
    let end = Math.min(start + chunkSize, cleanText.length);

    if (end < cleanText.length) {
      const lastSpace = cleanText.lastIndexOf(" ", end);

      if (lastSpace > start) {
        end = lastSpace;
      }
    }

    chunks.push(cleanText.slice(start, end).trim());

    if (end === cleanText.length) {
      break;
    }

    start = end - overlap;
  }

  return chunks;
}
