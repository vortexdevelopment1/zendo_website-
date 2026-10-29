import { readTokenImage, tokenImageType } from "@/lib/launchpad-media";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const body = await readTokenImage(id);
    return new Response(body, { headers: { "Content-Type": tokenImageType(id), "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
