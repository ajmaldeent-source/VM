import { getStore } from "@netlify/blobs";

// Uploaded images and videos, stored in Netlify Blobs and served by /api/media/[key].
//
// Netlify functions accept request bodies up to ~6 MB, so uploads are capped below that.
// SVG is deliberately not accepted for uploads: it can carry scripts.

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 5.5 * 1024 * 1024;

type Kind = "image" | "video";
const signatures: { type: string; ext: string; kind: Kind; test: (b: Uint8Array) => boolean }[] = [
  { type: "image/jpeg", ext: "jpg", kind: "image", test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { type: "image/png", ext: "png", kind: "image", test: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  { type: "image/gif", ext: "gif", kind: "image", test: (b) => b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 },
  {
    type: "image/webp", ext: "webp", kind: "image",
    test: (b) => ascii(b, 0, 4) === "RIFF" && ascii(b, 8, 12) === "WEBP",
  },
  { type: "video/mp4", ext: "mp4", kind: "video", test: (b) => ascii(b, 4, 8) === "ftyp" },
  { type: "video/webm", ext: "webm", kind: "video", test: (b) => b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3 },
];

function ascii(b: Uint8Array, start: number, end: number) {
  return String.fromCharCode(...b.slice(start, end));
}

export class UploadError extends Error {}

/** Checks the file's real type from its first bytes (never trusts the browser-supplied type). */
export async function inspectUpload(file: File, allowed: Kind[]) {
  if (!file || file.size === 0) throw new UploadError("No file was selected.");
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const sig = signatures.find((s) => s.test(head));
  if (!sig || !allowed.includes(sig.kind)) {
    throw new UploadError(`Unsupported file type. Allowed: ${allowed.includes("image") ? "JPG, PNG, WebP, GIF" : ""}${allowed.length > 1 ? ", " : ""}${allowed.includes("video") ? "MP4, WebM" : ""}.`);
  }
  const max = sig.kind === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > max) throw new UploadError(`File is too large (max ${(max / 1024 / 1024).toFixed(1)} MB).`);
  return sig;
}

const store = () => getStore({ name: "media", consistency: "strong" });

/** Stores the file under a new random key and returns its public URL. */
export async function saveUpload(file: File, allowed: Kind[]): Promise<{ url: string; kind: Kind }> {
  const sig = await inspectUpload(file, allowed);
  const key = `${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}.${sig.ext}`;
  await store().set(key, await file.arrayBuffer(), { metadata: { type: sig.type, size: file.size } });
  return { url: `/api/media/${key}`, kind: sig.kind };
}

export async function readUpload(key: string) {
  return store().getWithMetadata(key, { type: "arrayBuffer" });
}

/** Deletes a previously uploaded file. Static placeholder files (/media/...) are left alone. */
export async function deleteUpload(url: string | null | undefined) {
  const key = url?.startsWith("/api/media/") ? url.slice("/api/media/".length) : null;
  if (!key) return;
  try {
    await store().delete(key);
  } catch (err) {
    console.error("[media] delete failed", key, err);
  }
}

export const KEY_PATTERN = /^[a-z0-9]+-[a-f0-9]{8}\.(jpg|png|gif|webp|mp4|webm)$/;
