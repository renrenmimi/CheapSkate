import { DATA_AS_OF } from "@/lib/data/meta";

export function SourceTag({
  url,
  confidence,
  label,
}: {
  url?: string;
  confidence?: "verified" | "approximate";
  /** Override the default snapshot-date label (e.g. "live · just now"). */
  label?: string;
}) {
  const text =
    label ??
    (confidence === "approximate"
      ? `≈ as of ${DATA_AS_OF}`
      : `verified ${DATA_AS_OF}`);
  if (!url) {
    return <span className="text-[10px] text-ink-soft/70">{text}</span>;
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="text-[10px] text-ink-soft/70 underline decoration-dotted underline-offset-2 hover:text-green"
      title={url}
    >
      {text} ↗
    </a>
  );
}
