import Link from "next/link";
import { Boxes } from "lucide-react";

const NAV = [
  { href: "/", label: "Rangliste" },
  { href: "/prompts", label: "Prompts" },
  { href: "/arena", label: "Arena" },
  { href: "/finder", label: "AI Finder" },
];

/** Schlanke, sticky Kopfzeile – auf allen Seiten identisch. */
export function SiteHeader() {
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
              className="rounded-lg px-3 py-1.5 text-muted transition-colors hover:bg-elevate hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
