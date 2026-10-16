"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addSlide, type AddSlideState } from "./actions";

export default function AddSlideForm() {
  const [state, action, pending] = useActionState(addSlide, {} as AddSlideState);
  const [isVideo, setIsVideo] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      form.current?.reset();
      setIsVideo(false);
    }
  }, [state]);

  return (
    <form ref={form} action={action} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label htmlFor="media" className="mb-1.5 block text-sm font-medium">Picture or video *</label>
        <input
          id="media"
          name="media"
          type="file"
          required
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
          onChange={(e) => setIsVideo(Boolean(e.target.files?.[0]?.type.startsWith("video/")))}
          className="block w-full text-sm file:me-3 file:rounded-full file:border-0 file:bg-safety-500 file:px-4 file:py-2 file:text-white"
        />
        <p className="mt-1 text-xs text-slate-500">
          Pictures: JPG/PNG/WebP, about 1920×1080, up to 5 MB. Videos: MP4 (H.264) or WebM, short and muted, up to 5.5 MB.
        </p>
      </div>
      {isVideo && (
        <div className="md:col-span-2">
          <label htmlFor="poster" className="mb-1.5 block text-sm font-medium">Poster picture (shown before the video loads)</label>
          <input id="poster" name="poster" type="file" accept="image/jpeg,image/png,image/webp" className="block w-full text-sm" />
        </div>
      )}
      <div>
        <label htmlFor="alt_en" className="mb-1.5 block text-sm font-medium">Description (English) *</label>
        <input id="alt_en" name="alt_en" required className="field" placeholder="e.g. Engineers inspecting a valve" />
      </div>
      <div>
        <label htmlFor="alt_ar" className="mb-1.5 block text-sm font-medium">Description (Arabic)</label>
        <input id="alt_ar" name="alt_ar" dir="rtl" lang="ar" className="field" />
      </div>
      {state.error && <p role="alert" className="text-sm text-red-600 dark:text-red-400 md:col-span-2">{state.error}</p>}
      {state.ok && <p role="status" className="text-sm text-emerald-600 dark:text-emerald-400 md:col-span-2">Slide added.</p>}
      <div className="md:col-span-2">
        <button disabled={pending} className="btn-primary disabled:opacity-60">{pending ? "Uploading…" : "Add slide"}</button>
      </div>
    </form>
  );
}
