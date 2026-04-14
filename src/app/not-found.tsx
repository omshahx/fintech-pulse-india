import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6">
        <span className="text-2xl font-bold text-zinc-400">404</span>
      </div>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
        Page not found
      </h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors shadow-sm"
      >
        Back to Home
      </Link>
    </div>
  );
}
