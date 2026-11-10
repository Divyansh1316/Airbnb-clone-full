import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white py-5 dark:border-[#2b2e36] dark:bg-[#111318]">
      <div className="mx-auto flex max-w-[2520px] flex-col gap-6 px-4 text-sm text-neutral-600 dark:text-neutral-200 md:flex-row md:items-center md:justify-between md:px-10 xl:px-20">
        <div>
          <Link
            href="/"
            className="text-base font-semibold text-neutral-900 dark:text-white"
          >
            Airbnb
          </Link>
          <p className="mt-1">Find a place that feels like yours.</p>
        </div>
        <nav aria-label="Footer" className="flex items-center gap-5">
          <Link href="/" className="hover:underline">
            Explore stays
          </Link>
          <Link href="/trips" className="hover:underline">
            Your trips
          </Link>
          <Link href="/favorites" className="hover:underline">
            Favorites
          </Link>
        </nav>
        <p>© {new Date().getFullYear()} Airbnb</p>
      </div>
    </footer>
  );
}
