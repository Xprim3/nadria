import Link from "next/link";

export function PublicSetupFallback() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b border-stone-200/80 bg-white/90 px-4 py-4 sm:px-6">
        <p className="font-serif text-xl text-stone-900">Restaurant</p>
      </header>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-16">
        <h1 className="font-serif text-3xl text-stone-900">Website nicht verbunden</h1>
        <p className="mt-3 text-stone-600">
          Verbinde dein Supabase-Projekt und führe die Datenbank-Migrationen aus, damit die Website
          Adresse, Menüs und Öffnungszeiten laden kann.
        </p>
        <ol className="mt-6 list-decimal space-y-2 pl-5 text-stone-700">
          <li>
            Erstelle <code className="rounded bg-stone-200/80 px-1">.env.local</code> (siehe
            <code className="mx-1 rounded bg-stone-200/80 px-1">.env.local.example</code>
            ).
          </li>
          <li>
            In Supabase: SQL-Editor → Migration aus
            <code className="mx-1 rounded bg-stone-200/80 px-1">supabase/migrations</code>
            .
          </li>
        </ol>
        <p className="mt-6">
          <Link
            href="/admin"
            className="inline-flex rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white"
          >
            Zum Adminbereich
          </Link>
        </p>
      </main>
    </div>
  );
}
