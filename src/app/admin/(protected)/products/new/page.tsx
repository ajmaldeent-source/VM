import type { Metadata } from "next";
import { requireStaff } from "@/lib/guards";
import ProductForm from "../ProductForm";

export const metadata: Metadata = { title: "New product" };

export default async function NewProductPage() {
  await requireStaff("content:manage");
  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Products</p>
        <h1 className="mt-2 text-3xl font-bold">New product</h1>
      </div>
      <ProductForm />
    </div>
  );
}
