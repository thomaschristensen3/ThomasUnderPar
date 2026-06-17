import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

export default async function Nav() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="text-forest font-bold text-xl tracking-tight shrink-0"
          >
            ThomasUnderPar
          </Link>

          {/* Center nav links — hidden on mobile */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/#destinations"
              className="text-sm font-medium text-gray-600 hover:text-forest transition-colors"
            >
              Destinations
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-gray-600 hover:text-forest transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <span className="hidden sm:inline text-sm text-gray-600 max-w-[160px] truncate">
                  {session.user?.name ?? session.user?.email}
                </span>
                <SignOutButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex text-sm font-medium text-forest hover:text-forest-dark transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-4 py-2 rounded-md bg-forest text-white text-sm font-semibold hover:bg-forest-dark transition-colors"
                >
                  Join Free
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
