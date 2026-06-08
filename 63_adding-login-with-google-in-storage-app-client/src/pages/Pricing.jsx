// src/pages/Pricing.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cloud, Check, Sparkles, Menu, X, User } from "lucide-react";

const plans = {
  monthly: [
    {
      name: "Free",
      price: 0,
      description: "Perfect for getting started",
      features: [
        "5 GB storage",
        "Basic file sharing",
        "Community support",
        "30-day version history",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Pro",
      price: 9.99,
      description: "Best for professionals",
      features: [
        "100 GB storage",
        "Advanced sharing controls",
        "Priority email support",
        "180-day version history",
        "End-to-end encryption",
        "Custom branding",
      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      name: "Business",
      price: 19.99,
      description: "For teams and organizations",
      features: [
        "1 TB storage",
        "Team collaboration",
        "24/7 phone support",
        "Unlimited version history",
        "Single sign-on (SSO)",
        "Audit logs",
        "Dedicated account manager",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ],
  yearly: [
    {
      name: "Free",
      price: 0,
      description: "Perfect for getting started",
      features: [
        "5 GB storage",
        "Basic file sharing",
        "Community support",
        "30-day version history",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Pro",
      price: 99.9,
      description: "Best for professionals",
      features: [
        "100 GB storage",
        "Advanced sharing controls",
        "Priority email support",
        "180-day version history",
        "End-to-end encryption",
        "Custom branding",
      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      name: "Business",
      price: 199.9,
      description: "For teams and organizations",
      features: [
        "1 TB storage",
        "Team collaboration",
        "24/7 phone support",
        "Unlimited version history",
        "Single sign-on (SSO)",
        "Audit logs",
        "Dedicated account manager",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ],
};

export default function Pricing() {
  const [billing, setBilling] = useState("monthly");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const currentPlans = plans[billing];

  // ✅ Restore theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else if (savedTheme === "system" || !savedTheme) {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemDark) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:4000/user", { credentials: "include" })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 overflow-x-hidden">
      {/* Navbar – Dynamic + dark mode */}
      <nav className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Cloud className="h-7 w-7 text-indigo-600" />
              <span className="text-xl font-semibold text-gray-900 dark:text-white">StorageApp</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition font-medium">
                Features
              </Link>
              <Link to="/pricing" className="text-indigo-600 dark:text-indigo-400 font-medium">
                Pricing
              </Link>
              <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition font-medium">
                About
              </Link>
            </div>

            {/* Desktop Auth Buttons – Dynamic */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition font-medium">
                    Dashboard
                  </Link>
                  <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-800">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
                      {user.name}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition font-medium">
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition shadow-sm"
                  >
                    Sign up free
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Slide-out Menu – Dynamic + dark mode */}
        <div
          className={`fixed inset-0 z-30 transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl p-6 flex flex-col">
            <div className="flex justify-end">
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col gap-4 mt-8">
              <Link to="/features" className="text-gray-800 dark:text-gray-200 font-medium" onClick={() => setMobileMenuOpen(false)}>Features</Link>
              <Link to="/pricing" className="text-indigo-600 dark:text-indigo-400 font-medium" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
              <Link to="/about" className="text-gray-800 dark:text-gray-200 font-medium" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                {user ? (
                  <>
                    <Link to="/dashboard" className="block text-gray-800 dark:text-gray-200 font-medium mb-3" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{user.name}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block text-gray-800 dark:text-gray-200 font-medium mb-3" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
                    <Link to="/register" className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Sign up free</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-16 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
          Choose the plan that fits your needs. Upgrade or downgrade anytime.
        </p>

        {/* Modern Billing Toggle – dark mode support */}
        <div className="mt-8 inline-flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-full">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              billing === "monthly"
                ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              billing === "yearly"
                ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            Yearly <span className="text-green-600 dark:text-green-400 text-xs ml-1">Save 20%</span>
          </button>
        </div>
      </section>

      {/* Pricing cards - modern design with dark mode */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {currentPlans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl p-6 bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 border ${
                plan.highlighted
                  ? "border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/20 dark:ring-indigo-400/20"
                  : "border-gray-100 dark:border-gray-700"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 dark:bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                  Most popular
                </div>
              )}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">{plan.description}</p>
                <div className="mt-6 flex justify-center items-baseline gap-1">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-500 dark:text-gray-400">
                      /{billing === "monthly" ? "month" : "year"}
                    </span>
                  )}
                </div>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  to={plan.name === "Business" ? "/contact" : "/register"}
                  className={`block w-full text-center py-2.5 px-4 rounded-lg font-medium transition ${
                    plan.highlighted
                      ? "bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-sm"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ teaser – dark mode support */}
      <section className="text-center py-12 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Have questions?</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Check our{" "}
            <Link to="/faq" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              FAQ
            </Link>{" "}
            or{" "}
            <Link to="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              contact support
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Footer – dark mode support */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="hover:text-white transition">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link to="/security" className="hover:text-white transition">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="hover:text-white transition">About</Link></li>
                <li><Link to="/blog" className="hover:text-white transition">Blog</Link></li>
                <li><Link to="/careers" className="hover:text-white transition">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="/help" className="hover:text-white transition">Help Center</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><Link to="/status" className="hover:text-white transition">Status</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="hover:text-white transition">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition">Terms</Link></li>
                <li><Link to="/cookies" className="hover:text-white transition">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 dark:border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-4">
              <Cloud className="w-6 h-6 text-indigo-400" />
              <span>© 2026 StorageApp. All rights reserved.</span>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">Twitter</a>
              <a href="#" className="hover:text-white transition">GitHub</a>
              <a href="#" className="hover:text-white transition">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}