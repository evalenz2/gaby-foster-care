import Image from "next/image";
import Link from "next/link";  // Import Link from Next.js

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-5xl text-blue-500">Welcome to Gaby Foster Care</h1>
        <Link
          href="/login"
          className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded text-lg"
        >
          Admin Login
        </Link>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        {/* your footer links */}
      </footer>
    </div>
  );
}
