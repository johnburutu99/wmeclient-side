import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#181818] via-[#222] to-[#2d2d2d] p-8">
      <main className="flex flex-col items-center gap-8 w-full max-w-2xl">
        <Image
          src="/wme-logo.svg"
          alt="WME Logo"
          width={180}
          height={40}
          priority
        />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gold drop-shadow-lg text-center mb-2 tracking-tight">
          Welcome to the WME Client Portal
        </h1>
        <p className="text-lg sm:text-xl text-gray-200 text-center max-w-xl mb-6">
          Secure. Modern. Beautiful. <br />
          Manage your bookings, documents, payments, and more—all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <a
            href="/login"
            className="rounded-full bg-gold text-black font-semibold px-8 py-3 text-lg shadow-lg hover:bg-yellow-400 transition"
          >
            Client Login
          </a>
          <a
            href="/dashboard"
            className="rounded-full border border-gold text-gold font-semibold px-8 py-3 text-lg shadow-lg hover:bg-gold hover:text-black transition"
          >
            Dashboard
          </a>
        </div>
      </main>
      <footer className="mt-16 text-gray-400 text-xs text-center w-full">
        &copy; {new Date().getFullYear()} William Morris Endeavor. All rights reserved.
      </footer>
    </div>
  );
}
