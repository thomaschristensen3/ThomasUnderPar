import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";

export const metadata = {
  title: "Go Ad-Free — ThomasUnderPar",
};

export default function UpgradePage() {
  return (
    <>
      <Nav />
      <main className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-24">
        <span className="text-gold text-sm font-semibold uppercase tracking-widest mb-4">
          Coming Soon
        </span>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Go Ad-Free</h1>
        <p className="text-gray-500 text-lg max-w-md">
          Support ThomasUnderPar and browse with no ads for just{" "}
          <strong className="text-forest">$1/month</strong>. Launching soon.
        </p>
        <a
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-forest-dark transition-colors"
        >
          ← Back to home
        </a>
      </main>
      <Footer />
    </>
  );
}
