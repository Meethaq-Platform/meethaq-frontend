import Image from "next/image";
import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

interface FirstUseShellProps {
  eyebrow: string;
  title: string;
  subtitle: ReactNode;
  // Should read on both themes — there's no dark variant swap here.
  illustration: string;
  children: ReactNode;
}

// Shared frame for the first-use screens. It fills the visible content area
// (viewport minus the header, <main>'s padding and its bottom spacer) so a
// brand-new account lands on one deliberate page instead of a card floating
// at the top of an empty dashboard.
export default function FirstUseShell({
  eyebrow,
  title,
  subtitle,
  illustration,
  children,
}: FirstUseShellProps) {
  return (
    <section className="relative flex items-center bg-surface border border-border rounded-[28px] sm:min-h-[calc(100dvh-9.5rem)] lg:min-h-[calc(100dvh-11rem)] overflow-hidden">
      {/* Soft brand-colour glows behind the content — decorative only. */}
      <div
        aria-hidden
        className="-top-32 -inset-e-32 absolute bg-primary-muted opacity-80 blur-3xl rounded-full size-96 pointer-events-none"
      />
      <div
        aria-hidden
        className="-bottom-40 -inset-s-24 absolute bg-accent-value-muted opacity-80 blur-3xl rounded-full size-96 pointer-events-none"
      />

      <div className="z-10 relative items-center gap-10 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] mx-auto p-6 sm:p-10 lg:p-14 w-full max-w-295">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 bg-primary-muted px-3 py-1 rounded-full font-semibold text-primary text-xs">
            <Sparkles size={13} />
            {eyebrow}
          </span>
          <h1 className="mt-4 font-bold text-[clamp(1.6rem,1.6vw+1rem,2.4rem)] text-text-primary leading-tight tracking-tight">
            {title}
          </h1>
          <div className="mt-3 max-w-[52ch] text-text-secondary text-base leading-relaxed">
            {subtitle}
          </div>

          <div className="mt-8">{children}</div>
        </div>

        <div className="hidden lg:block min-w-0">
          <Image
            src={illustration}
            alt=""
            width={500}
            height={500}
            className="mx-auto w-full max-w-125 h-auto"
          />
        </div>
      </div>
    </section>
  );
}
