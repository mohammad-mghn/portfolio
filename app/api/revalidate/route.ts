import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook → on-demand revalidation. Safety net for <SanityLive/>, which only refreshes
 * while someone has the site open. Configure in sanity.io/manage → API → Webhooks (POST, with secret).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ message: "Missing SANITY_REVALIDATE_SECRET" }, { status: 500 });

  const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret, true);
  if (!isValidSignature) return NextResponse.json({ message: "Invalid signature" }, { status: 401 });

  // Every page reads from the CMS, so refresh them all, plus the files built from the same content.
  revalidatePath("/", "layout");
  revalidatePath("/resume.pdf");
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ revalidated: true, type: body?._type ?? null, now: Date.now() });
}
