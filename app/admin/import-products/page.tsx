// app/admin/import-products/page.tsx
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { BulkImportForm } from "@/components/admin/BulkImportForm";

export const metadata: Metadata = {
  title: "Bulk Product Import | GreenRoots Admin",
  description: "Import hundreds of products at once via Excel and a matching image archive.",
};

export default async function ImportProductsPage() {
  await requireAdmin();

  return (
    <main className="min-h-screen bg-[var(--cream)] px-4 py-10 dark:bg-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <BulkImportForm />
      </div>
    </main>
  );
}