import { getResume } from "@/lib/resume";
import { renderResumePdf } from "@/lib/resume-pdf";

/** The resume as a PDF, in English, built from the same content as /resume. Rendered once at build. */
export const dynamic = "force-static";

export async function GET() {
  const data = await getResume("en");
  const pdf = await renderResumePdf(data);
  const file = `${data.site.name.replace(/\s+/g, "-")}-Resume.pdf`;
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${file}"`,
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
