export function DraftModeBanner() {
  // On Vercel preview deployments, Vercel owns draft mode — exit button won't work
  const isVercelPreview = process.env.VERCEL_ENV === "preview";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-4 px-4 py-2 bg-brand-800 text-white text-sm font-bold">
      <span>Draft preview active — content may differ from what is published.</span>
      {!isVercelPreview && (
        <a href="/api/draft-mode/disable" className="shrink-0 px-3 py-1 rounded-full ring-1 ring-white/30 hover:bg-white/10 transition-colors">
          Exit preview
        </a>
      )}
    </div>
  );
}
