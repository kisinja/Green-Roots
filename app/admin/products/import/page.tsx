"use client";

import { showToast } from "@/components/ui/Toaster";
import { useState } from "react";
import BulkProductUpload from "@/components/admin/BulkProductUpload";

const AdminImportProductsPage = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800">
          Bulk Product Import
        </h1>
        <p className="text-green-700 mt-2">
          Import products quickly using a CSV file.
        </p>
      </div>

      {/* New CSV Bulk Upload Section */}
      <div className="mb-12">
        <BulkProductUpload />
      </div>

      {/* Optional: Keep old Excel + ZIP section for future / as alternative */}
      <div className="bg-white rounded-2xl border border-green-100 p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-green-800 mb-6">
          Alternative: Excel + Images ZIP (Coming Soon)
        </h2>

        <div className="bg-cream border border-green-100 rounded-xl p-6 text-center">
          <p className="text-green-600">
            Excel + ZIP import with automatic image handling will be available
            soon.
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-10 bg-green-50 border border-green-100 rounded-2xl p-8">
        <h2 className="font-semibold text-green-800 mb-4">
          How to Use CSV Import
        </h2>

        <ol className="list-decimal ml-5 space-y-3 text-green-700 text-[15px]">
          <li>
            Click <strong>"Download Template"</strong> to get the correct CSV
            format.
          </li>
          <li>
            Fill in your product data (use real <strong>category_id</strong>{" "}
            from your database).
          </li>
          <li>For images: Put full URLs separated by commas.</li>
          <li>
            For features: Separate with pipe <code>|</code> or new lines.
          </li>
          <li>
            Upload the CSV file and click <strong>"Upload Products"</strong>.
          </li>
        </ol>

        <div className="mt-6 text-xs text-green-600 bg-white p-4 rounded-xl border border-green-100">
          <strong>Note:</strong> Each row will be processed individually. Failed
          rows will be shown with details.
        </div>
      </div>
    </div>
  );
};

export default AdminImportProductsPage;
