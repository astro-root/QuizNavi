"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, X, FileText, Image as ImageIcon } from "lucide-react";

type Props = {
  label: string;
  name: string;
  bucket: "tournament-logos" | "tournament-documents";
  accept: string;
  error?: string;
  kind: "image" | "document";
  defaultValue?: string | null;
};

function fileNameFromUrl(url: string): string {
  try {
    const decoded = decodeURIComponent(url.split("/").pop() ?? "");
    return decoded || "現在のファイル";
  } catch {
    return "現在のファイル";
  }
}

export function FileUploadField({
  label,
  name,
  bucket,
  accept,
  error,
  kind,
  defaultValue,
}: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(defaultValue ?? null);
  const [fileName, setFileName] = useState<string | null>(
    defaultValue ? fileNameFromUrl(defaultValue) : null
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const ext = file.name.split(".").pop();
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: false });

    if (uploadErr) {
      setUploadError("アップロードに失敗しました。もう一度お試しください。");
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    setUrl(data.publicUrl);
    setFileName(file.name);
    setUploading(false);
  };

  const handleClear = () => {
    setUrl(null);
    setFileName(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <input type="hidden" name={name} value={url ?? ""} />

      {!url ? (
        <label
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6 text-center transition-colors hover:bg-muted/50"
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <Upload className="h-6 w-6 text-muted-foreground" />
          )}
          <span className="text-sm text-muted-foreground">
            {uploading ? "アップロード中..." : "クリックしてファイルを選択"}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            disabled={uploading}
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="flex items-center justify-between rounded-lg border bg-muted/30 p-3 animate-in fade-in-0 zoom-in-95 duration-200">
          <div className="flex items-center gap-2 overflow-hidden">
            {kind === "image" ? (
              <ImageIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            ) : (
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <span className="truncate text-sm">{fileName}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {uploadError && (
        <p className="text-xs text-destructive">{uploadError}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
