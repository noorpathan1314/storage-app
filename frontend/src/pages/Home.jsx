// src/pages/Home.jsx (with persistent dark mode)
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Cloud,
  FolderKanban,
  Lock,
  Share2,
  ChevronRight,
  User,
  Star,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Database,
  Menu,
  X,
} from "lucide-react";

// CountUp Component
const CountUp = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const step = end / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
};

// Fade‑up on scroll
const FadeUp = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ✅ Add this effect to restore theme on page load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else if (savedTheme === "system" || !savedTheme) {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
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
      {/* Navbar – clean, responsive with dark mode */}
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
              <Link to="/features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition font-medium">Features</Link>
              <Link to="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition font-medium">Pricing</Link>
              <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition font-medium">About</Link>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition font-medium">Dashboard</Link>
                  <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-800">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                      <User className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition font-medium">Log in</Link>
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

        {/* Mobile Slide-out Menu */}
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
              <Link to="/pricing" className="text-gray-800 dark:text-gray-200 font-medium" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
              <Link to="/about" className="text-gray-800 dark:text-gray-200 font-medium" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                {user ? (
                  <>
                    <Link to="/dashboard" className="block text-gray-800 dark:text-gray-200 font-medium mb-3" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                        <User className="w-4 h-4 text-indigo-600" />
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

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeUp delay={0}>
            <div className="inline-flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-full px-4 py-1.5 mb-6">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Trusted by 100,000+ users</span>
            </div>
          </FadeUp>
          <FadeUp delay={100}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-white">
              {user ? (
                <>
                  Welcome back,{" "}
                  <span className="text-indigo-600 dark:text-indigo-400">{user.name}</span>
                  !
                </>
              ) : (
                <>
                  Store, share & collaborate <br />
                  <span className="text-indigo-600 dark:text-indigo-400">without limits.</span>
                </>
              )}
            </h1>
          </FadeUp>
          <FadeUp delay={200}>
            <p className="mt-6 text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              {user
                ? "You're already logged in. Click Dashboard to manage your files instantly."
                : "Upload, organize, and access your files from anywhere. Enterprise-grade security with zero-knowledge encryption."}
            </p>
          </FadeUp>
          <FadeUp delay={300}>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-sm"
                >
                  Go to Dashboard <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-sm"
                  >
                    Start free trial <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    to="/features"
                    className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-lg font-semibold border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    Learn more
                  </Link>
                </>
              )}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 100, suffix: "k+", label: "Active Users", icon: <TrendingUp className="w-5 h-5" /> },
              { value: 500, suffix: "M+", label: "Files Stored", icon: <Database className="w-5 h-5" /> },
              { value: 99.9, suffix: "%", label: "Uptime SLA", icon: <Zap className="w-5 h-5" /> },
              { value: 24, suffix: "/7", label: "Support", icon: <ShieldCheck className="w-5 h-5" /> },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="w-10 h-10 mx-auto bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  <CountUp end={stat.value} duration={2000} suffix={stat.suffix} />
                </div>
                <div className="mt-1 text-gray-500 dark:text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Everything you need</h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Powerful features designed to save time and keep your data secure</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FolderKanban className="w-6 h-6" />,
                title: "Smart Organization",
                desc: "Create folders, tag files, and find everything instantly with powerful search.",
              },
              {
                icon: <Share2 className="w-6 h-6" />,
                title: "Secure Sharing",
                desc: "Share files with anyone via expiring links and control access permissions.",
              },
              {
                icon: <Lock className="w-6 h-6" />,
                title: "End-to-End Encryption",
                desc: "Your data is encrypted before it leaves your device. Only you have the keys.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition"
              >
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{feature.desc}</p>
                <div className="mt-4 flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                  Learn more <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Loved by creators worldwide</h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">Join thousands of satisfied users</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Product Designer",
                avatar: "SC",
                text: "StorageApp has completely changed how our team collaborates. It's fast, secure, and incredibly easy to use.",
                rating: 5,
              },
              {
                name: "Michael Torres",
                role: "Freelance Photographer",
                avatar: "MT",
                text: "The best cloud storage I've used. Simple UI, powerful features. Highly recommended!",
                rating: 5,
              },
              {
                name: "Dr. Emily Watson",
                role: "CTO, TechStart",
                avatar: "EW",
                text: "Enterprise-grade security with consumer-friendly pricing. This is the future.",
                rating: 5,
              },
            ].map((t, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">"{t.text}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{t.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted by Logos */}
      <section className="py-12 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 dark:text-gray-500 text-sm uppercase tracking-wider mb-8">Trusted by innovative teams worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            {["Acme Inc", "TechCorp", "StartupX", "DesignStudio", "CloudScale"].map((logo, idx) => (
              <span key={idx} className="text-gray-400 dark:text-gray-500 font-semibold text-lg">{logo}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section – only for guests */}
      {!user && (
        <section className="py-24 bg-indigo-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to secure your files?</h2>
            <p className="text-lg text-indigo-100 mb-8 max-w-xl mx-auto">
              Join thousands of users who trust StorageApp for their daily storage needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-md"
              >
                Start free trial <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
              >
                Contact sales
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Cloud className="h-6 w-6 text-indigo-400" />
                <span className="text-lg font-bold text-white">StorageApp</span>
              </div>
              <p className="text-sm">Secure cloud storage for individuals and teams.</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/features" className="hover:text-white transition">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link to="/security" className="hover:text-white transition">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white transition">About</Link></li>
                <li><Link to="/blog" className="hover:text-white transition">Blog</Link></li>
                <li><Link to="/careers" className="hover:text-white transition">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="hover:text-white transition">Privacy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition">Terms</Link></li>
                <li><Link to="/cookies" className="hover:text-white transition">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 dark:border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
            <div>© 2026 StorageApp. All rights reserved.</div>
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