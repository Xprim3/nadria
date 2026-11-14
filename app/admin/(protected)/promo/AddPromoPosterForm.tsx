"use client";

import { createPromoPoster } from "@/app/admin/actions";
import { Field, inputClass } from "@/components/admin/AdminUi";
import {
  promoPosterSelectionErrors,
  promoPosterStoragePath,
  promoUploadProgressLabel,
} from "@/lib/promo-poster-upload";
import { createClient } from "@/lib/supabase/client";
import { unstable_rethrow, useRouter } from "next/navigation";
import { useRef, useState } from "react";

const submitClass =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-b from-zinc-800 to-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-md shadow-zinc-900/20 transition hover:from-zinc-700 hover:to-zinc-800 disabled:cursor-not-allowed disabled:opacity-60";

async function removeUploadedPaths(paths: string[]) {
  if (paths.length === 0) return;
  try {
    const supabase = createClient();
    await supabase.storage.from("gallery").remove(paths);
  } catch {
    // Best-effort. A failed delete must not hide the original error.
  }
}

export function AddPromoPosterForm() {
  const router = useRouter();
  const submitting = useRef(false);
  const [pending, setPending] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fileErrors, setFileErrors] = useState<string[]>([]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const files = formData
      .getAll("promo_image")
      .filter((entry): entry is File => entry instanceof File);
    const problems = promoPosterSelectionErrors(files);

    setFormError(null);
    setFileErrors(problems);
    if (problems.length > 0) return;

    const link = formData.get("link_url");
    const linkUrl = typeof link === "string" && link.trim() ? link.trim() : null;
    const isActive = formData.get("is_active") === "on";

    submitting.current = true;
    setPending(true);
    const uploaded: string[] = [];

    try {
      const supabase = createClient();
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index];
        setProgress(promoUploadProgressLabel(index + 1, files.length));
        const path = promoPosterStoragePath(file.name);
        const { error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(path, file, {
            cacheControl: "3600",
            contentType: file.type,
            upsert: false,
          });
        if (uploadError) {
          await removeUploadedPaths(uploaded);
          setFileErrors([`${file.name}: ${uploadError.message}`]);
          return;
        }
        uploaded.push(path);
      }

      setProgress("Saving…");
      const result = await createPromoPoster({
        storagePaths: uploaded,
        linkUrl,
        isActive,
      });
      if (!result.ok) {
        await removeUploadedPaths(uploaded);
        setFormError(result.error);
        return;
      }

      form.reset();
      router.refresh();
    } catch (error) {
      await removeUploadedPaths(uploaded);
      unstable_rethrow(error);
      setFormError(
        error instanceof Error ? error.message : "Could not save posters.",
      );
    } finally {
      submitting.current = false;
      setPending(false);
      setProgress(null);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field
        label="Upload posters"
        hint="Images only, up to 10 MB each. Select up to 10. Vertical or square photos work best."
      >
        <input
          className={inputClass}
          name="promo_image"
          type="file"
          accept="image/*"
          multiple
          required
          disabled={pending}
        />
      </Field>
      <Field
        label="Optional link"
        hint="If set, tapping these posters opens the URL in a new tab."
      >
        <input
          className={inputClass}
          name="link_url"
          type="url"
          placeholder="https://…"
          disabled={pending}
        />
      </Field>
      {fileErrors.length > 0 ? (
        <ul className="space-y-1" role="alert">
          {fileErrors.map((message, index) => (
            <li key={`${message}-${index}`} className="text-sm text-red-600">
              {message}
            </li>
          ))}
        </ul>
      ) : null}
      {formError ? (
        <p className="text-sm text-red-600" role="alert">
          {formError}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            name="is_active"
            type="checkbox"
            defaultChecked
            disabled={pending}
          />
          Active
        </label>
        <button
          type="submit"
          disabled={pending}
          aria-live="polite"
          className={submitClass}
        >
          {pending ? (progress ?? "Uploading…") : "Add posters"}
        </button>
      </div>
    </form>
  );
}
