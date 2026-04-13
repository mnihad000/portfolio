import { readFile } from "node:fs/promises";
import path from "node:path";

const FILE_NAME = "Mohammed_Nihad_resume (1).pdf";

export async function GET() {
  const filePath = path.join(process.cwd(), "app", "resume", FILE_NAME);
  const file = await readFile(filePath);

  return new Response(file, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Mohammed_Nihad_resume.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
