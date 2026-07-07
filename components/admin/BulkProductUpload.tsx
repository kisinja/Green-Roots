"use client";

import { useState } from "react";
import { Upload, Download, Loader2, CheckCircle, XCircle } from "lucide-react";
import { showToast } from "@/components/ui/Toaster";

export default function BulkProductUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  /* const downloadTemplate = () => {
    const headers =
      "name,description,long_description,price,stock,category_id,emoji,badge,featured,is_active,features,images,specifications\n";
    const example = `"Test Organic Honey","Pure natural honey","Long description for testing bulk upload",250.00,50,"cmohfpwhx000308muik59h6y9","🍯","Best Seller",true,true,"Natural|Pure|Organic","https://example.com/honey.jpg","{""origin"":""Kenya""}"`;

    const csvContent = headers + example;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = "products-bulk-template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }; */

  const handleUpload = async () => {
    if (!file) {
      showToast("Please select a file first", "error");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/products/bulk-upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);

      if (data.successes > 0) {
        showToast(
          `Successfully imported ${data.successes} products!`,
          "success",
        );
      } else if (data.errors > 0) {
        showToast(`Imported with ${data.errors} errors`, "error");
      }
    } catch (err) {
      showToast("Upload failed. Please check console.", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-green-100 p-8">

      <div className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-green-700 mb-2">
            Upload CSV File
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0] || null;
              setFile(selectedFile);
              console.log("File selected:", selectedFile?.name);
            }}
            className="block w-full text-sm text-green-700 file:mr-4 file:py-3 file:px-6 
                       file:rounded-lg file:border-0 file:text-sm file:font-medium
                       file:bg-green-100 file:text-green-700 hover:file:bg-green-200
                       border border-green-200 rounded-lg bg-cream py-3 px-4"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 
                       bg-green-600 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed
                       text-white rounded-xl font-medium transition-colors"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
            {loading ? "Processing..." : "Upload Products"}
          </button>
        </div>

        {result && (
          <div
            className={`p-6 rounded-2xl border ${result.errors > 0 ? "border-orange-300 bg-orange-50" : "border-green-300 bg-green-50"}`}
          >
            <div className="flex items-start gap-3">
              {result.errors === 0 ? (
                <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-orange-600 mt-0.5" />
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-green-800">
                  Upload Complete
                </h3>
                <p className="text-green-700 mt-1">
                  Successfully added: <strong>{result.successes}</strong> |
                  Failed:{" "}
                  <strong
                    className={result.errors > 0 ? "text-orange-600" : ""}
                  >
                    {result.errors}
                  </strong>
                </p>

                {result.errors > 0 && result.details?.errors && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-medium text-orange-700">
                      View Errors
                    </summary>
                    <pre className="mt-3 bg-white border border-orange-100 p-4 rounded-lg text-xs overflow-auto max-h-64">
                      {JSON.stringify(result.details.errors, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
