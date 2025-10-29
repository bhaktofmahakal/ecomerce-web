'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container-custom py-20 text-center">
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Something Went Wrong</h1>
        <p className="text-gray-600 mb-8">{error.message || 'An unexpected error occurred.'}</p>
        <div className="space-y-2">
          <button onClick={() => reset()} className="btn-primary block w-full">
            Try Again
          </button>
          <a href="/" className="btn-secondary block w-full text-center">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}