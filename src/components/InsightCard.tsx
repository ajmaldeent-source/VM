import type { Insight } from "@/content/site";

export default function InsightCard({ post }: { post: Insight }) {
  return (
    <article className="glass flex h-full flex-col p-6">
      <div className="flex items-center gap-3 text-xs">
        <span className="rounded-full bg-safety-500/10 px-3 py-1 font-semibold text-safety-600 dark:text-safety-400">
          {post.category}
        </span>
        <time dateTime={post.date} className="text-slate-500">
          {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </time>
      </div>
      <h3 className="mt-4 text-xl font-semibold">{post.title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{post.excerpt}</p>
    </article>
  );
}
