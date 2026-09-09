"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type DragEvent } from "react";
import { AlertCircle, Camera, ImagePlus, Loader2, RefreshCw, X } from "lucide-react";
import { uploadConfig } from "@/config/quote";
import { cn } from "@/lib/utils/cn";
import { track } from "@/lib/analytics";

export type UploadedPhoto = {
  id: string;
  name: string;
  previewUrl: string;
  path: string | null;
  status: "uploading" | "done" | "error";
  progress: number;
  error?: string;
  file?: File;
};

function uploadWithProgress(file: File, session: string, onProgress: (p: number) => void): Promise<{ path: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const form = new FormData();
    form.append("file", file);
    form.append("session", session);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && json.ok) resolve({ path: json.path });
        else reject(new Error(json.error ?? "Uploaden mislukt. Probeer het opnieuw."));
      } catch {
        reject(new Error("Uploaden mislukt. Probeer het opnieuw."));
      }
    };
    xhr.onerror = () => reject(new Error("Geen verbinding. Controleer uw internet en probeer het opnieuw."));
    xhr.open("POST", "/api/upload");
    xhr.send(form);
  });
}

export function PhotoUploader({
  session,
  photos,
  onChange,
}: {
  session: string;
  photos: UploadedPhoto[];
  onChange: (next: UploadedPhoto[] | ((prev: UploadedPhoto[]) => UploadedPhoto[])) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const startUpload = useCallback(
    (photo: UploadedPhoto) => {
      if (!photo.file) return;
      onChange((prev) => prev.map((p) => (p.id === photo.id ? { ...p, status: "uploading", progress: 0, error: undefined } : p)));
      uploadWithProgress(photo.file, session, (progress) => {
        onChange((prev) => prev.map((p) => (p.id === photo.id ? { ...p, progress } : p)));
      })
        .then(({ path }) => {
          onChange((prev) => prev.map((p) => (p.id === photo.id ? { ...p, status: "done", progress: 100, path } : p)));
          track({ name: "quote_photo_uploaded", count: 1 });
        })
        .catch((err: Error) => {
          onChange((prev) => prev.map((p) => (p.id === photo.id ? { ...p, status: "error", error: err.message } : p)));
        });
    },
    [onChange, session],
  );

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      setNotice(null);
      const list = Array.from(files);
      const room = uploadConfig.maxFiles - photos.length;
      if (room <= 0) {
        setNotice(`U kunt maximaal ${uploadConfig.maxFiles} foto's toevoegen.`);
        return;
      }
      const accepted: UploadedPhoto[] = [];
      const problems: string[] = [];

      for (const file of list.slice(0, room)) {
        const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
        const typeOk = (uploadConfig.acceptedMimeTypes as readonly string[]).includes(file.type) || (uploadConfig.acceptedExtensions as readonly string[]).includes(ext);
        if (!typeOk) {
          problems.push(`${file.name}: alleen JPG, PNG of WEBP.`);
          continue;
        }
        if (file.size > uploadConfig.maxFileSizeBytes) {
          problems.push(`${file.name}: te groot (max. ${Math.round(uploadConfig.maxFileSizeBytes / 1024 / 1024)} MB).`);
          continue;
        }
        accepted.push({
          id: crypto.randomUUID(),
          name: file.name,
          previewUrl: URL.createObjectURL(file),
          path: null,
          status: "uploading",
          progress: 0,
          file,
        });
      }
      if (list.length > room) problems.push(`Maximaal ${uploadConfig.maxFiles} foto's, de overige zijn niet toegevoegd.`);
      if (problems.length) setNotice(problems.join(" "));
      if (accepted.length === 0) return;

      onChange((prev) => [...prev, ...accepted]);
      accepted.forEach(startUpload);
    },
    [onChange, photos.length, startUpload],
  );

  const remove = useCallback(
    (photo: UploadedPhoto) => {
      URL.revokeObjectURL(photo.previewUrl);
      onChange((prev) => prev.filter((p) => p.id !== photo.id));
      if (photo.path) {
        fetch("/api/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: photo.path }) }).catch(() => {});
      }
    },
    [onChange],
  );

  useEffect(() => {
    return () => {
      // object URLs opruimen bij unmount
      photos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  const full = photos.length >= uploadConfig.maxFiles;

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200",
          dragOver ? "border-gold-500 bg-gold-50" : "border-navy-200 bg-navy-50/50 hover:border-gold-300 hover:bg-gold-50/40",
          full && "opacity-60",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={uploadConfig.acceptedExtensions.join(",") + ",image/jpeg,image/png,image/webp"}
          multiple
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
          disabled={full}
          aria-label="Foto's toevoegen"
        />
        <span className="flex size-16 items-center justify-center rounded-2xl bg-white text-gold-600 shadow-soft">
          <ImagePlus className="size-7" aria-hidden />
        </span>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={full}
          className="mt-5 inline-flex h-12 items-center gap-2 rounded-full bg-navy-900 px-6 font-semibold text-white transition-all hover:bg-navy-800 disabled:opacity-50"
        >
          <Camera className="size-4" aria-hidden />
          {full ? "Maximum bereikt" : "Foto's toevoegen"}
        </button>
        <p className="mt-3 text-sm text-navy-500">
          <span className="hidden sm:inline">Of sleep foto&apos;s hierheen. </span>
          JPG, PNG of WEBP · max. {Math.round(uploadConfig.maxFileSizeBytes / 1024 / 1024)} MB per foto · max. {uploadConfig.maxFiles} foto&apos;s
        </p>
      </div>

      {notice && (
        <p role="alert" className="flex items-start gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {notice}
        </p>
      )}

      {photos.length > 0 && (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4" aria-label="Toegevoegde foto's">
          {photos.map((photo) => (
            <li key={photo.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-navy-100 ring-1 ring-navy-100">
              <Image src={photo.previewUrl} alt={photo.name} fill unoptimized sizes="160px" className={cn("object-cover transition-opacity", photo.status !== "done" && "opacity-60")} />

              {photo.status === "uploading" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-950/40 text-white">
                  <Loader2 className="size-6 animate-spin" aria-hidden />
                  <span className="mt-1 text-xs font-semibold">{photo.progress}%</span>
                  <span className="absolute inset-x-0 bottom-0 h-1 bg-white/30">
                    <span className="block h-full bg-gold-400 transition-all" style={{ width: `${photo.progress}%` }} />
                  </span>
                </div>
              )}

              {photo.status === "error" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-red-900/60 p-2 text-center text-white">
                  <AlertCircle className="size-5" aria-hidden />
                  <span className="text-[11px] leading-tight">{photo.error ?? "Mislukt"}</span>
                  <button type="button" onClick={() => startUpload(photo)} className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-navy-900">
                    <RefreshCw className="size-3" aria-hidden />
                    Opnieuw
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => remove(photo)}
                aria-label={`${photo.name} verwijderen`}
                className="absolute right-1.5 top-1.5 flex size-8 items-center justify-center rounded-full bg-white/95 text-navy-900 shadow-soft transition-transform hover:scale-105 focus-visible:opacity-100"
              >
                <X className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
