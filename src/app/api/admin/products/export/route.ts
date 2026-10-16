import { currentUser } from "@/lib/guards";
import { listAllProducts } from "@/lib/contentStore";
import { toCsv } from "@/lib/csv";
import { CSV_COLUMNS, featuresToText, specsToText } from "@/lib/productInput";
import { can } from "@/lib/roles";

// GET /api/admin/products/export            -> all products as CSV
// GET /api/admin/products/export?template=1 -> empty template with one example row
export async function GET(req: Request) {
  const user = await currentUser();
  if (!can(user?.role ?? null, "content:manage")) return new Response("Forbidden", { status: 403 });

  const template = new URL(req.url).searchParams.has("template");
  const rows = template
    ? [[
        "example-ball-valve", "valves", "Example Ball Valve", "صمام كروي مثال", "Short summary", "ملخص قصير",
        "Longer description", "وصف أطول", "Feature one; Feature two", "ميزة أولى; ميزة ثانية",
        "Size | 2-12 in; Class | ASME 150", "المقاس | 2-12 إنش; الفئة | ASME 150", "", "true", "100",
      ]]
    : (await listAllProducts()).map((p) => [
        p.slug, p.category, p.name.en, p.name.ar, p.summary.en, p.summary.ar, p.description.en, p.description.ar,
        featuresToText(p.features.en, "; "), featuresToText(p.features.ar, "; "),
        specsToText(p.specs.en, "; "), specsToText(p.specs.ar, "; "),
        p.imageUrl ?? "", String(p.published), String(p.sortOrder),
      ]);

  const name = template ? "products-template.csv" : `products-${new Date().toISOString().slice(0, 10)}.csv`;
  return new Response(toCsv([...CSV_COLUMNS], rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name}"`,
      "Cache-Control": "no-store",
    },
  });
}
