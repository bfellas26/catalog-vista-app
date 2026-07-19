import { ImagePlus } from "lucide-react";

export function ImageUpload({
  label = "Upload image",
  hint = "PNG, JPG up to 5MB",
}: {
  label?: string;
  hint?: string;
}) {
  // Frontend only — no upload handler wired.
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-accent/40 px-6 py-10 text-center transition hover:border-primary/40 hover:bg-accent/60">
      <div className="rounded-full bg-card p-3 shadow-sm">
        <ImagePlus className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <input type="file" accept="image/*" className="hidden" />
    </label>
  );
}
