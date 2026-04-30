import { LoginForm } from "@/components/admin/LoginForm";
import { Suspense } from "react";

export const metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

function LoginFormFallback() {
  return (
    <div
      className="h-40 animate-pulse rounded-xl bg-zinc-100"
      aria-hidden
    />
  );
}

export default function AdminLoginPage() {
  return (
    <div
      className="flex min-h-svh flex-col items-center justify-center px-4 py-12"
      style={{
        background:
          "radial-gradient(1000px 500px at 20% 0%, rgba(16, 185, 129, 0.12), transparent 50%), #f4f4f5",
      }}
    >
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Restaurant
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Use your staff account to open the control center.
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-lg shadow-zinc-900/5 ring-1 ring-zinc-950/5">
          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
