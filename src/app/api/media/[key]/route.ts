import { KEY_PATTERN, readUpload } from "@/lib/media";

// Serves uploaded media. Keys are random and never reused, so responses are cached forever.
// Supports HTTP Range requests, which Safari needs to play video.
export async function GET(req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!KEY_PATTERN.test(key)) return new Response("Not found", { status: 404 });

  const blob = await readUpload(key).catch(() => null);
  if (!blob) return new Response("Not found", { status: 404 });

  const data = new Uint8Array(blob.data);
  const type = String(blob.metadata?.type ?? "application/octet-stream");
  const headers: Record<string, string> = {
    "Content-Type": type,
    "Cache-Control": "public, max-age=31536000, immutable",
    "Accept-Ranges": "bytes",
    "Content-Security-Policy": "default-src 'none'; sandbox",
  };

  const range = req.headers.get("range")?.match(/^bytes=(\d*)-(\d*)$/);
  if (range) {
    const size = data.length;
    const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
    const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    if (start >= size || start > end) {
      return new Response(null, { status: 416, headers: { ...headers, "Content-Range": `bytes */${size}` } });
    }
    return new Response(data.slice(start, end + 1), {
      status: 206,
      headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": String(end - start + 1) },
    });
  }

  return new Response(data, { headers: { ...headers, "Content-Length": String(data.length) } });
}
