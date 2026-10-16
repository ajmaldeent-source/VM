import type { Metadata } from "next";
import type { HeroSlideRecord, SiteSettings } from "@/content/model";
import { getSettings, listAllSlides } from "@/lib/contentStore";
import { requireStaff } from "@/lib/guards";
import ConfirmButton from "../ConfirmButton";
import { deleteSlideAction, moveSlideAction, saveHeroSettings, updateSlideAction } from "./actions";
import AddSlideForm from "./AddSlideForm";

export const metadata: Metadata = { title: "Hero banner" };
export const dynamic = "force-dynamic";

export default async function HeroAdminPage() {
  await requireStaff("content:manage");
  let slides: HeroSlideRecord[] = [];
  let settings: SiteSettings | null = null;
  let dbError = false;
  try {
    [slides, settings] = await Promise.all([listAllSlides(), getSettings()]);
  } catch (err) {
    console.error("[admin] hero unavailable", err);
    dbError = true;
  }
  const active = slides.filter((s) => s.active).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Content</p>
          <h1 className="mt-2 text-3xl font-bold">Hero banner</h1>
          <p className="mt-1 text-sm text-slate-500">{slides.length} slides · {active} shown on the home page</p>
        </div>
        <a href="/en" target="_blank" rel="noopener" className="btn-ghost">Preview home page</a>
      </div>

      {dbError && <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">The database is not reachable.</p>}
      {!dbError && active === 0 && (
        <p role="alert" className="rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
          No active slides — the home page hero will show only the background colour.
        </p>
      )}

      <ol className="space-y-3">
        {slides.map((s, i) => (
          <li key={s.id} className={`glass grid gap-4 p-4 md:grid-cols-[12rem_1fr_auto] ${s.active ? "" : "opacity-60"}`}>
            <div className="relative aspect-video overflow-hidden rounded-lg bg-ink-900">
              {s.kind === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={s.mediaUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <video src={s.mediaUrl} poster={s.posterUrl ?? undefined} muted playsInline preload="metadata" className="h-full w-full object-cover" />
              )}
              <span className="absolute start-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
                {i + 1} · {s.kind}
              </span>
            </div>

            <form action={updateSlideAction} className="grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={s.id} />
              <div>
                <label htmlFor={`en-${s.id}`} className="mb-1 block text-xs text-slate-500">Description (English)</label>
                <input id={`en-${s.id}`} name="alt_en" defaultValue={s.alt.en} className="field !py-2 text-sm" />
              </div>
              <div>
                <label htmlFor={`ar-${s.id}`} className="mb-1 block text-xs text-slate-500">Description (Arabic)</label>
                <input id={`ar-${s.id}`} name="alt_ar" defaultValue={s.alt.ar} dir="rtl" lang="ar" className="field !py-2 text-sm" />
              </div>
              <div className="flex items-center gap-4 sm:col-span-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="active" defaultChecked={s.active} className="h-4 w-4 accent-safety-500" /> Show on website
                </label>
                <button className="btn-ghost !px-4 !py-1.5 text-sm">Save</button>
              </div>
            </form>

            <div className="flex items-start gap-2 md:flex-col md:items-end">
              <div className="flex gap-1">
                {(["up", "down"] as const).map((dir) => (
                  <form key={dir} action={moveSlideAction}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="dir" value={dir} />
                    <button
                      disabled={(dir === "up" && i === 0) || (dir === "down" && i === slides.length - 1)}
                      aria-label={`Move slide ${i + 1} ${dir}`}
                      className="grid h-9 w-9 place-items-center rounded-full border border-slate-300 disabled:opacity-30 dark:border-white/15"
                    >
                      {dir === "up" ? "↑" : "↓"}
                    </button>
                  </form>
                ))}
              </div>
              <form action={deleteSlideAction}>
                <input type="hidden" name="id" value={s.id} />
                <ConfirmButton label="Delete" confirmLabel="Confirm delete" />
              </form>
            </div>
          </li>
        ))}
      </ol>

      <section className="glass space-y-4 p-6">
        <h2 className="text-lg font-semibold">Add a slide</h2>
        <AddSlideForm />
      </section>

      {settings && (
        <section className="glass p-6">
          <h2 className="text-lg font-semibold">Banner settings</h2>
          <form action={saveHeroSettings} className="mt-4 flex flex-wrap items-end gap-6">
            <div>
              <label htmlFor="interval" className="mb-1 block text-sm">Seconds per slide</label>
              <input id="interval" name="interval" type="number" min={3} max={30} defaultValue={settings.heroIntervalMs / 1000} className="field !w-28" />
            </div>
            <label className="flex items-center gap-2 pb-3 text-sm">
              <input type="checkbox" name="badge" defaultChecked={settings.heroShowPlaceholderBadge} className="h-4 w-4 accent-safety-500" />
              Show &ldquo;Placeholder media&rdquo; badge
            </label>
            <button className="btn-primary">Save settings</button>
          </form>
        </section>
      )}
    </div>
  );
}
