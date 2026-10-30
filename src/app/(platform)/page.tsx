import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Sparkles, Store, ShoppingBag, BarChart3, Truck, ArrowUpRight } from "lucide-react";
import { ALL_CATEGORIES, getCategoryConfig } from "@/config/categories";

export default function PlatformLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] font-sans selection:bg-zinc-900 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-white shadow-sm">
              <Store className="w-4 h-4" />
            </div>
            <span className="text-base font-bold tracking-tight text-zinc-900">
              Store<span className="text-blue-600">Swift</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-zinc-500">
            <a href="#features" className="hover:text-zinc-900 transition">Features</a>
            <a href="#categories" className="hover:text-zinc-900 transition">Categories</a>
            <a href="#pricing" className="hover:text-zinc-900 transition">Pricing</a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition"
            >
              Log in
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center space-x-1.5 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white px-3.5 py-2 rounded-xl shadow-sm transition btn-press"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-20 lg:pt-28 lg:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill Announcement */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-semibold mb-6 shadow-subtle">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>Turnkey eCommerce for Startups</span>
            <span className="text-zinc-400">•</span>
            <span className="text-zinc-500 font-normal">Ready in 3 minutes</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Launch your dream online store <br className="hidden sm:inline" />
            <span className="text-zinc-500 font-medium">without agency prices.</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-zinc-500 max-w-xl mx-auto leading-relaxed font-normal">
            Can’t afford thousands for custom web development? StoreSwift gives startups an instant category-ready online shop, variant inventory matrix, and high-conversion checkout for an affordable monthly fee.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3.5 rounded-xl shadow-sm transition btn-press"
            >
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/store/apex-fashion"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 text-xs font-semibold bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 px-5 py-3.5 rounded-xl shadow-subtle transition btn-press"
            >
              <span>Explore Demo Store</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-5 text-xs text-zinc-400">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-zinc-600 font-medium">No credit card required</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-zinc-600 font-medium">Cash on Delivery & Cards Ready</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-zinc-600 font-medium">Instant free subdomain</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Presets Showcase */}
      <section id="categories" className="py-16 bg-white border-y border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              Pre-Configured For Your Business Niche
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500">
              Pick your category to get starter products, custom schemas, and optimized store layouts out of the box.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ALL_CATEGORIES.map((catKey) => {
              const cat = getCategoryConfig(catKey);
              return (
                <div
                  key={cat.id}
                  className="bg-zinc-50/60 border border-zinc-200/80 rounded-2xl p-5 hover:border-zinc-300 transition duration-200 flex flex-col justify-between interactive-card"
                >
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 mb-3 shadow-subtle">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-zinc-900">{cat.name}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{cat.tagline}</p>
                    <div className="mt-3 pt-3 border-t border-zinc-200/60">
                      <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                        Tailored Options:
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {cat.defaultOptions.map((opt) => (
                          <span
                            key={opt}
                            className="text-[10px] bg-white border border-zinc-200 px-2 py-0.5 rounded text-zinc-600 font-medium"
                          >
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/onboarding?category=${cat.id}`}
                    className="mt-5 text-xs font-bold text-zinc-900 hover:text-blue-600 flex items-center space-x-1 transition"
                  >
                    <span>Launch {cat.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              Everything Your Store Needs to Make Sales
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500">
              Powerful enterprise capabilities packaged into an effortless, uncluttered interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-subtle interactive-card">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 mb-1.5">Variant Matrix Generator</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Add dimensions like Size and Color. The system calculates combinations and generates SKUs, prices, and stock counts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-subtle interactive-card">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 mb-1.5">Hybrid Checkout & COD</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Accept Cash on Delivery (COD) with 1 click, connect Stripe for credit cards, or provide local mobile money transfer instructions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-subtle interactive-card">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-900 mb-1.5">Atomic Inventory Lock</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Database-level atomic deduction prevents double-selling and overselling when multiple customers buy at the same instant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white border-t border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              Fair, Transparent Startup Pricing
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-500">
              Pay a minimal fraction of what an agency charges. No hidden surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Starter */}
            <div className="border border-zinc-200 rounded-2xl p-6 bg-zinc-50/50 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Starter</h3>
                <p className="text-xs text-zinc-500 mt-0.5">For new businesses launching.</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-black text-zinc-900">$9</span>
                  <span className="text-zinc-500 text-xs ml-1.5">/ month</span>
                </div>
                <ul className="mt-5 space-y-2.5 text-xs text-zinc-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Up to 50 active products</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Free .storeswift.com subdomain</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Cash on Delivery & Cards Ready</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/onboarding?plan=starter"
                className="mt-6 block text-center py-2.5 px-4 bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-800 text-xs font-semibold rounded-xl transition shadow-subtle btn-press"
              >
                Choose Starter
              </Link>
            </div>

            {/* Growth */}
            <div className="border border-zinc-900 rounded-2xl p-6 bg-zinc-900 text-white shadow-card flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <h3 className="text-sm font-bold">Growth</h3>
                <p className="text-xs text-zinc-400 mt-0.5">For growing stores scaling sales.</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-black">$29</span>
                  <span className="text-zinc-400 text-xs ml-1.5">/ month</span>
                </div>
                <ul className="mt-5 space-y-2.5 text-xs text-zinc-300">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span>Up to 500 active products</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span>Custom Domain Support (brand.com)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span>Printable invoices & packing slips</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/onboarding?plan=growth"
                className="mt-6 block text-center py-2.5 px-4 bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-bold rounded-xl shadow-sm transition btn-press"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Pro */}
            <div className="border border-zinc-200 rounded-2xl p-6 bg-zinc-50/50 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Pro</h3>
                <p className="text-xs text-zinc-500 mt-0.5">For high-volume retail brands.</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-black text-zinc-900">$79</span>
                  <span className="text-zinc-500 text-xs ml-1.5">/ month</span>
                </div>
                <ul className="mt-5 space-y-2.5 text-xs text-zinc-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Unlimited products & storage</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Multi-staff dashboard accounts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Priority 24/7 technical support</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/onboarding?plan=pro"
                className="mt-6 block text-center py-2.5 px-4 bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-800 text-xs font-semibold rounded-xl transition shadow-subtle btn-press"
              >
                Choose Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-zinc-200 py-10 text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-zinc-900 font-bold text-xs">
            <Store className="w-4 h-4 text-zinc-900" />
            <span>StoreSwift</span>
          </div>
          <p className="text-xs text-zinc-400">
            © 2026 StoreSwift Platform. Designed for startups and independent brands.
          </p>
        </div>
      </footer>
    </div>
  );
}
