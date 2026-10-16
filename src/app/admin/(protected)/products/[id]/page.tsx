import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/contentStore";
import { requireStaff } from "@/lib/guards";
import { deleteProductAction } from "../actions";
import ProductForm from "../ProductForm";
import ConfirmButton from "../../ConfirmButton";

export const metadata: Metadata = { title: "Edit product" };
export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff("content:manage");
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Products</p>
          <h1 className="mt-2 text-3xl font-bold">{product.name.en}</h1>
          <p className="font-mono text-sm text-slate-500">{product.slug}</p>
        </div>
        <form action={deleteProductAction}>
          <input type="hidden" name="id" value={product.id} />
          <ConfirmButton label="Delete product" confirmLabel="Click again to delete" />
        </form>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
