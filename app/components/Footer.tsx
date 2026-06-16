export default function Footer() {
  return (
    <footer className="bg-forest text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-bold text-lg tracking-tight">ThomasUnderPar</span>
          <nav className="flex items-center gap-6 text-sm text-white/70">
            <a href="/#destinations" className="hover:text-white transition-colors">
              Destinations
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </nav>
        </div>
        <div className="mt-6 pt-6 border-t border-white/10 text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} ThomasUnderPar. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
