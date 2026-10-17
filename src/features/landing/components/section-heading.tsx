import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

type SectionHeadingProps = {
  title: string;
  /** Second line, rendered in a muted tone like the mockup. */
  accent: string;
  eyebrow?: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
};

export function SectionHeading({ title, accent, eyebrow, description, align = "center", className }: SectionHeadingProps) {
  return (
    <Reveal className={cn(align === "center" && "mx-auto text-center", "max-w-3xl", className)}>
      {eyebrow ? (
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
      ) : null}
      <h2 className="text-[clamp(32px,4.4vw,54px)] font-bold leading-[1.05] tracking-[-0.04em] text-balance">
        {title}
        <br />
        <span className="text-ink-muted">{accent}</span>
      </h2>
      {description ? (
        <p className={cn("mt-5 text-lg leading-relaxed text-ink-soft text-pretty", align === "center" && "mx-auto max-w-2xl")}>
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
