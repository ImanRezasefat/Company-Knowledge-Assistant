import fs from "fs";
import { PDFParse } from "pdf-parse";

export async function extractText(filePath: string) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const buffer = new Uint8Array(fs.readFileSync(filePath));
  const parser = new PDFParse({ data: buffer });

  try {
    const data = await parser.getText();

    return {
      text: data.text,
      pages: data.total,
    };
  } finally {
    await parser.destroy();
  }
}
