"use client";

import { useState } from "react";
import { X, UploadCloud, FileSpreadsheet, Download, AlertCircle, CheckCircle2 } from "lucide-react";

interface CsvImportModalProps {
  tenantSlug: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CsvImportModal({ tenantSlug, isOpen, onClose, onSuccess }: CsvImportModalProps) {
  const [csvContent, setCsvContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgradeRequired, setUpgradeRequired] = useState(false);
  const [successResult, setSuccessResult] = useState<{ importedCount: number } | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError(null);
    setUpgradeRequired(false);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text || "");
    };
    reader.readAsText(file);
  };

  const handleDownloadSample = () => {
    window.open(`/api/stores/${tenantSlug}/import?sample=true`, "_blank");
  };

  const handleSubmit = async () => {
    if (!csvContent.trim()) {
      setError("Please choose a valid CSV file or paste CSV content.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setUpgradeRequired(false);
    setSuccessResult(null);

    try {
      const res = await fetch(`/api/stores/${tenantSlug}/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv: csvContent }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to import CSV.");
        if (data.upgrade) setUpgradeRequired(true);
      } else {
        setSuccessResult({ importedCount: data.importedCount });
        onSuccess();
      }
    } catch {
      setError("Network error while importing CSV catalog.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden border border-zinc-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-sm">Bulk Import Products (CSV)</h3>
              <p className="text-xs text-zinc-500">Upload standard spreadsheet catalog with inventory</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-200 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{error}</p>
                {upgradeRequired && (
                  <p className="mt-1 text-red-600 font-medium">
                    Upgrade to Medium or Pro plan to unlock higher product catalog volume.
                  </p>
                )}
              </div>
            </div>
          )}

          {successResult && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <p className="font-bold">
                Successfully imported {successResult.importedCount} products into your store catalog!
              </p>
            </div>
          )}

          {/* Sample template download button */}
          <div className="flex items-center justify-between p-3.5 bg-zinc-50 rounded-xl border border-zinc-200/80">
            <div>
              <p className="text-xs font-bold text-zinc-900">Need the official template?</p>
              <p className="text-[11px] text-zinc-500">Download formatted sample with SKU, pricing, and tags</p>
            </div>
            <button
              onClick={handleDownloadSample}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5" /> Download Sample
            </button>
          </div>

          {/* File drop area */}
          <label className="border-2 border-dashed border-zinc-300 hover:border-violet-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition bg-zinc-50/50 hover:bg-violet-50/30">
            <UploadCloud className="w-8 h-8 text-zinc-400 mb-2" />
            <span className="text-xs font-bold text-zinc-800">
              {fileName ? fileName : "Click to select or drop a CSV file"}
            </span>
            <span className="text-[11px] text-zinc-400 mt-0.5">Supports UTF-8 CSV up to 10MB</span>
            <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
          </label>

          {/* Or text area */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-zinc-700">Or paste raw CSV text:</span>
              {csvContent && (
                <button onClick={() => { setCsvContent(""); setFileName(""); }} className="text-[11px] text-zinc-400 hover:text-zinc-600">
                  Clear
                </button>
              )}
            </div>
            <textarea
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              placeholder="title,price,stock,category,sku&#10;Oxford Shirt,1250,50,clothing,OX-001"
              rows={4}
              className="w-full text-xs font-mono p-3 border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-100 bg-zinc-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-200/60 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !csvContent.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95"
          >
            {isSubmitting ? "Importing Catalog..." : "Start Import"}
          </button>
        </div>
      </div>
    </div>
  );
}
