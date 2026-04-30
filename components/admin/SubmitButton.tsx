"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingLabel = "Saving…",
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}) {
  const { pending } = useFormStatus();
  const styles = {
    primary:
      "bg-gradient-to-b from-zinc-800 to-zinc-900 text-white shadow-md shadow-zinc-900/20 hover:from-zinc-700 hover:to-zinc-800",
    secondary:
      "border border-zinc-200 bg-white text-zinc-800 shadow-sm hover:border-zinc-300 hover:bg-zinc-50",
    danger: "bg-red-600 text-white shadow-sm hover:bg-red-700",
  };

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
