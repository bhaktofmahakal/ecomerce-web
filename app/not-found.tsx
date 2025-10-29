import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-custom py-20 text-center">
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-4"></div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-8">Sorry, the page you're looking for doesn't exist.</p>
        <Link href="/" className="btn-primary inline-block">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}