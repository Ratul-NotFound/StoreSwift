import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Sparkles, Store, ShoppingBag, BarChart3, Truck } from "lucide-react";
import { ALL_CATEGORIES, getCategoryConfig } from "@/config/categories";

export default function PlatformLandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <Store className="w-6 h-6" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Launch<span className="text-blue-600">Commerce</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#categories" className="hover:text-blue-600 transition">Categories</a>
            <a href="#pricing" className="hover:text-blue-600 transition">Pricing</a>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/admin"
              className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
            >
              Merchant Login
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center space-x-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/20 transition"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32 bg-gradient-to-b from-blue-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold mb-8">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Built for Startups & Small Businesses</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            A Professional eCommerce Store in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">3 Minutes</span>, Not 3 Months.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Can’t afford thousands for agency developers? LaunchCommerce provides an instant category-ready online shop, variant inventory matrix, and high-conversion checkout for an affordable monthly fee.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5"
            >
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/store/demo-store"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 text-base font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-7 py-4 rounded-xl shadow-sm transition"
            >
              <span>View Live Demo Store</span>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-slate-500">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Cash on Delivery & Cards Ready</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Free instant subdomain</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Presets Showcase */}
      <section id="categories" className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Pre-Configured For Your Business Category
            </h2>
            <p className="mt-3 text-slate-600">
              Pick your industry and get a storefront loaded with the exact attributes, layout, and starter products you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ALL_CATEGORIES.map((catKey) => {
              const cat = getCategoryConfig(catKey);
              return (
                <div
                  key={cat.id}
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 hover:shadow-lg hover:border-blue-300 transition duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 mb-4 shadow-sm">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{cat.name}</h3>
                    <p className="text-sm text-slate-600 mt-2">{cat.tagline}</p>
                    <div className="mt-4 pt-4 border-t border-slate-200/60">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Tailored Attributes:
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {cat.defaultOptions.map((opt) => (
                          <span
                            key={opt}
                            className="text-xs bg-white border border-slate-200 px-2.5 py-1 rounded-md text-slate-700 font-medium"
                          >
                            {opt}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/onboarding?category=${cat.id}`}
                    className="mt-6 text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                  >
                    <span>Launch {cat.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Everything Your Store Needs to Make Sales
            </h2>
            <p className="mt-3 text-slate-600">
              Powerful eCommerce capabilities packaged into a simple, beautiful interface.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Variant Matrix Generator</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Add options like Size and Color. The system calculates the Cartesian product and auto-generates SKUs, prices, and stock rows.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Hybrid Checkout & COD</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Accept Cash on Delivery (COD) with 1 click, connect Stripe for credit cards, or provide local bank/mobile transfer instructions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Atomic Inventory Lock</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Database-level atomic deduction prevents double-selling and overselling when multiple customers check out simultaneously.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Fair, Transparent Startup Pricing
            </h2>
            <p className="mt-3 text-slate-600">
              Pay a minimal fraction of what an agency charges. No hidden surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="border border-slate-200 rounded-2xl p-8 bg-slate-50 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Starter</h3>
                <p className="text-sm text-slate-500 mt-1">For new startups testing the waters.</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900">$9</span>
                  <span className="text-slate-500 text-sm ml-2">/ month</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Up to 50 active products</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Free .platform.com subdomain</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Cash on Delivery & Mobile Pay</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Admin order management</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/onboarding?plan=starter"
                className="mt-8 block text-center py-3 px-4 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold rounded-xl transition"
              >
                Choose Starter
              </Link>
            </div>

            {/* Growth (Featured) */}
            <div className="border-2 border-blue-600 rounded-2xl p-8 bg-white shadow-xl relative flex flex-col justify-between">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Growth</h3>
                <p className="text-sm text-slate-500 mt-1">For growing stores scaling sales.</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900">$29</span>
                  <span className="text-slate-500 text-sm ml-2">/ month</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Up to 500 active products</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Custom Domain Support (brand.com)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>All Payment Gateways + COD</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>Printable packing slips & invoices</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/onboarding?plan=growth"
                className="mt-8 block text-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-600/20 transition"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Pro */}
            <div className="border border-slate-200 rounded-2xl p-8 bg-slate-50 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Pro</h3>
                <p className="text-sm text-slate-500 mt-1">For high-volume retail brands.</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-slate-900">$79</span>
                  <span className="text-slate-500 text-sm ml-2">/ month</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Unlimited products & storage</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Multi-staff dashboard accounts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>0% platform transaction fee</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Priority 24/7 technical support</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/onboarding?plan=pro"
                className="mt-8 block text-center py-3 px-4 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-semibold rounded-xl transition"
              >
                Choose Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-white font-bold">
            <Store className="w-5 h-5 text-blue-500" />
            <span>LaunchCommerce SaaS</span>
          </div>
          <p className="text-sm text-slate-500">
            © 2026 LaunchCommerce Platform. Designed for startups and independent brands.
          </p>
        </div>
      </footer>
    </div>
  );
}

