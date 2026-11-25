'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0f] text-white flex min-h-screen items-center justify-center">
        <div className="text-center p-6">
          <h2 className="text-xl font-bold mb-2">Something went wrong!</h2>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-violet-600 rounded-lg text-sm font-semibold"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
