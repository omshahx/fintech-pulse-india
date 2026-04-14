export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-600 text-white font-bold text-[10px]">
              FP
            </div>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              Fintech Pulse India
            </span>
          </div>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Aggregating Indian fintech news from Google News, Inc42 & RBI.
            Free and open source.
          </p>
        </div>
      </div>
    </footer>
  );
}
