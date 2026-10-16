import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getProductBySlug, setProductImage } from "@/lib/contentStore";
import { currentUser } from "@/lib/guards";
import { deleteUpload, saveUpload, UploadError } from "@/lib/media";
import { can } from "@/lib/roles";

// POST one picture at a time (multipart: file, slug). Used by the bulk picture uploader,
// which sends files one by one to stay under the hosting request-size limit.
export async function POST(req: Request) {
  const user = await currentUser();
  if (!can(user?.role ?? null, "content:manage")) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const slug = String(form?.get("slug") ?? "").toLowerCase();
  if (!(file instanceof File) || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return NextResponse.json({ ok: false, error: "Missing file or invalid file name." }, { status: 400 });
  }

  const product = await getProductBySlug(slug);
  if (!product) return NextResponse.json({ ok: false, error: `No product with slug “${slug}”.` }, { status: 422 });

  try {
    const { url } = await saveUpload(file, ["image"]);
    await setProductImage(product.id, url);
    await deleteUpload(product.imageUrl);
    revalidatePath("/[locale]", "layout");
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    if (err instanceof UploadError) return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
    console.error("[admin] bulk image failed", slug, err);
    return NextResponse.json({ ok: false, error: "Upload failed." }, { status: 500 });
  }
}
