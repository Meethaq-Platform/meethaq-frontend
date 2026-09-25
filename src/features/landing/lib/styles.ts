// Pill-shaped link buttons used across the landing page. They're links, not
// <button>s, so they don't use the shared Button component.
export const pillBase =
  "inline-flex justify-center items-center px-5.5 py-2.75 rounded-full font-semibold whitespace-nowrap text-[15px] transition motion-reduce:transition-none";

export const pillPrimary = `${pillBase} bg-accent-value text-on-accent-value hover:opacity-90 motion-safe:hover:-translate-y-px`;

export const pillLarge = "px-7.5 py-3.75 text-base";

export const sectionTitle =
  "font-bold text-[clamp(1.6rem,1.8vw+1rem,2.1rem)] text-center leading-snug";
