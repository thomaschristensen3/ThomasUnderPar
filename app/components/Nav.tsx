export default function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <a
            href="/"
            className="text-forest font-bold text-xl tracking-tight shrink-0"
          >
            ThomasUnderPar
          </a>

          {/* Center nav links — hidden on mobile */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#destinations"
              className="text-sm font-medium text-gray-600 hover:text-forest transition-colors"
            >
              Destinations
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-gray-600 hover:text-forest transition-colors"
            >
              About
            </a>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="hidden sm:inline-flex text-sm font-medium text-forest hover:text-forest-dark transition-colors"
            >
              Sign In
            </a>
            <a
              href="#"
              className="inline-flex items-center px-4 py-2 rounded-md bg-forest text-white text-sm font-semibold hover:bg-forest-dark transition-colors"
            >
              Join Free
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
