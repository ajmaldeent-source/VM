"use server";

import { revalidatePath } from "next/cache";
import { createSlide, deleteSlide, getSlide, listAllSlides, moveSlide, saveSettings, updateSlide } from "@/lib/contentStore";
import { requireStaff } from "@/lib/guards";
import { deleteUpload, saveUpload, UploadError } from "@/lib/media";

const UUID = /^[0-9a-f-]{36}$/i;
const clean = (v: FormDataEntryValue | null, n = 200) => String(v ?? "").trim().slice(0, n);

function refresh() {
  revalidatePath("/admin/hero");
  revalidatePath("/[locale]", "page");
}

export type AddSlideState = { error?: string; ok?: boolean };

export async function addSlide(_prev: AddSlideState, form: FormData): Promise<AddSlideState> {
  await requireStaff("content:manage");
  const media = form.get("media");
  const poster = form.get("poster");
  const altEn = clean(form.get("alt_en"));
  const altAr = clean(form.get("alt_ar"));
  if (!(media instanceof File) || media.size === 0) return { error: "Choose a picture or video to upload." };
  if (!altEn) return { error: "English description (alt text) is required for accessibility." };

  const uploaded: string[] = [];
  try {
    const main = await saveUpload(media, ["image", "video"]);
    uploaded.push(main.url);
    let posterUrl: string | null = null;
    if (main.kind === "video" && poster instanceof File && poster.size > 0) {
      posterUrl = (await saveUpload(poster, ["image"])).url;
      uploaded.push(posterUrl);
    }
    const slides = await listAllSlides();
    const last = slides.reduce((m, s) => Math.max(m, s.sortOrder), 0);
    await createSlide({
      kind: main.kind,
      mediaUrl: main.url,
      posterUrl,
      alt: { en: altEn, ar: altAr },
      active: true,
      sortOrder: last + 10,
    });
  } catch (err) {
    await Promise.all(uploaded.map((u) => deleteUpload(u)));
    if (err instanceof UploadError) return { error: err.message };
    console.error("[admin] add slide failed", err);
    return { error: "Upload failed. Please try again." };
  }
  refresh();
  return { ok: true };
}

export async function updateSlideAction(form: FormData) {
  await requireStaff("content:manage");
  const id = String(form.get("id") ?? "");
  if (!UUID.test(id)) return;
  const slide = await getSlide(id);
  if (!slide) return;
  await updateSlide(id, {
    alt: { en: clean(form.get("alt_en")) || slide.alt.en, ar: clean(form.get("alt_ar")) },
    active: Boolean(form.get("active")),
    sortOrder: slide.sortOrder,
  });
  refresh();
}

export async function moveSlideAction(form: FormData) {
  await requireStaff("content:manage");
  const id = String(form.get("id") ?? "");
  const dir = form.get("dir") === "up" ? "up" : "down";
  if (!UUID.test(id)) return;
  await moveSlide(id, dir);
  refresh();
}

export async function deleteSlideAction(form: FormData) {
  await requireStaff("content:manage");
  const id = String(form.get("id") ?? "");
  if (!UUID.test(id)) return;
  const slide = await getSlide(id);
  if (!slide) return;
  await deleteSlide(id);
  await deleteUpload(slide.mediaUrl);
  await deleteUpload(slide.posterUrl);
  refresh();
}

export async function saveHeroSettings(form: FormData) {
  await requireStaff("content:manage");
  const seconds = Math.min(30, Math.max(3, Number(form.get("interval")) || 7));
  await saveSettings({ heroIntervalMs: Math.round(seconds * 1000), heroShowPlaceholderBadge: Boolean(form.get("badge")) });
  refresh();
}
