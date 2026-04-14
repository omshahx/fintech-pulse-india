"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-md">
        We had trouble loading the latest fintech news. This is usually temporary.
      </p>
      <button
        onClick={reset}
        className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
      >
        Try Again
      </button>
    </div>
  );
}
