import Link from "next/link";
import { Boxes, LogOut } from "lucide-react";
import { getUser } from "@/lib/auth";

const NAV = [
  { href: "/", label: "Rangliste" },
  { href: "/prompts", label: "Prompts" },
  { href: "/arena", label: "Arena" },
  { href: "/finder", label: "AI Finder" },
];

/** Schlanke, sticky Kopfzeile – auf allen Seiten identisch. */
export async function SiteHeader() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-base/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent-dim text-accent-soft">
            <Boxes size={17} />
          </span>
          AI-Vergleich
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden rounded-lg px-3 py-1.5 text-muted transition-colors hover:bg-elevate hover:text-white sm:block"
            >
              {item.label}
            </Link>
          ))}

          {user ? (
            <div className="ml-2 flex items-center gap-2">
              <span className="hidden max-w-[10rem] truncate text-xs text-muted md:block">
                {user.email}
              </span>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-muted transition-colors hover:bg-elevate hover:text-white"
                  title="Abmelden"
                >
                  <LogOut size={15} />
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-subtle transition-colors hover:border-accent/40 hover:text-white"
            >
              Anmelden
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
