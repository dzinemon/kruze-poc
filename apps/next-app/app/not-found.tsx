import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-container-lg mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-black text-body mb-4">Page not found</h1>
      <p className="text-secondary mb-8">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="inline-block px-4 py-3 bg-primary text-white rounded-btn hover:bg-primary-dark transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}
