"use client";

import { showToast } from "@/components/ui/Toaster";
import { useState } from "react";

type ImportResult = {
  imported: number;
  failed: number;
  errors: string[];
};

const AdminImportProductsPage = () => {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleImport = async () => {
    if (!excelFile) {
      showToast("Please select both Excel and ZIP files.", "error");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const formData = new FormData();
      excelFile && formData.append("excel", excelFile);
      zipFile && formData.append("images", zipFile);

      const response = await fetch("/api/admin/products/bulk-import", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Import failed");
      }

      setResult(data);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Import failed");
      console.log(
        "Bulk Import failed",
        error instanceof Error ? error.message : error,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Bulk Product Import</h1>

        <p className="text-gray-600 mt-2">
          Import hundreds of products at once using an Excel spreadsheet and
          image ZIP file.
        </p>
      </div>

      <div className="bg-white rounded-2xl border p-6 shadow-sm">
        <div className="flex flex-wrap gap-4 mb-8">
          <a
            href="/api/admin/products/template"
            className="px-5 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
          >
            Download Template
          </a>
        </div>

        <div className="space-y-6">
          {/* Excel */}
          <div>
            <label className="block font-medium mb-2">Excel File</label>

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setExcelFile(e.target.files?.[0] || null)}
              className="block w-full border rounded-lg p-3"
            />
          </div>

          {/* ZIP */}
          <div>
            <label className="block font-medium mb-2">Images ZIP File</label>

            <input
              type="file"
              accept=".zip"
              onChange={(e) => setZipFile(e.target.files?.[0] || null)}
              className="block w-full border rounded-lg p-3"
            />
          </div>

          <button
            onClick={handleImport}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Importing Products..." : "Import Products"}
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-8 bg-white rounded-2xl border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Import Results</h2>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="border rounded-xl p-4">
              <div className="text-sm text-gray-500">Imported</div>

              <div className="text-3xl font-bold text-green-600">
                {result.imported}
              </div>
            </div>

            <div className="border rounded-xl p-4">
              <div className="text-sm text-gray-500">Failed</div>

              <div className="text-3xl font-bold text-red-600">
                {result.failed}
              </div>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Errors</h3>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-h-96 overflow-auto">
                {result.errors.map((error, index) => (
                  <div key={index} className="text-red-700 text-sm mb-2">
                    {error}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h2 className="font-semibold mb-3">Instructions</h2>

        <ol className="list-decimal ml-5 space-y-2 text-sm">
          <li>Download the Excel template.</li>
          <li>Fill in all product details.</li>
          <li>Add all product images into one folder.</li>
          <li>Compress the images folder into a ZIP file.</li>
          <li>Upload both the Excel file and ZIP file.</li>
          <li>Click Import Products and wait for the process to finish.</li>
        </ol>
      </div>
    </div>
  );
};

export default AdminImportProductsPage;
