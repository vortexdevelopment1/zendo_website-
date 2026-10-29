import { requireUser } from "@/lib/auth";
import { storeTokenImage } from "@/lib/launchpad-media";
import { fail, ZendoError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    await requireUser();
    const form = await req.formData();
    const file = form.get("image");
    if (!(file instanceof File)) throw new ZendoError("Choose an image file.");
    return Response.json({ url: await storeTokenImage(file) });
  } catch (error) {
    return fail(error);
  }
}
