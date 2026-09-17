"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UploadedFile } from "@/lib/types";

interface FileUploadProps {
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
}

export function FileUpload({ files, onChange }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = useCallback(
    async (selectedFiles: FileList | null) => {
      if (!selectedFiles?.length) return;

      setUploading(true);
      setError("");

      try {
        const uploaded: UploadedFile[] = [];

        for (const file of Array.from(selectedFiles)) {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error ?? "Upload failed");
          }

          const data = await response.json();
          uploaded.push(data.file);
        }

        onChange([...files, ...uploaded]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [files, onChange]
  );

  const removeFile = (id: string) => {
    onChange(files.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-3">
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 transition hover:border-brand-500 hover:bg-brand-50">
        <Upload className="mb-2 h-8 w-8 text-slate-400" />
        <span className="text-sm font-medium text-slate-700">
          {uploading ? "Uploading..." : "Click to upload print files"}
        </span>
        <span className="mt-1 text-xs text-slate-500">
          PDF, JPG, PNG up to 10 MB each
        </span>
        <input
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          multiple
          disabled={uploading}
          onChange={(e) => handleUpload(e.target.files)}
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2"
            >
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-brand-700" />
                <span className="font-medium">{file.name}</span>
                <span className="text-slate-400">
                  ({Math.round(file.size / 1024)} KB)
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(file.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
