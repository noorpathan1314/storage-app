// src/pages/Features.jsx
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Cloud,
  FolderKanban,
  Lock,
  Share2,
  Zap,
  Globe,
  Database,
  Users,
  FileText,
  Clock,
  Shield,
  Smartphone,
  ArrowRight,
  Menu,
  X,
  User,
} from "lucide-react";

// Fade-up on scroll component (same as Home)
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

const featuresList = [
  {
    icon: <Cloud className="w-6 h-6" />,
    title: "Cloud Sync",
    description: "Access your files from any device, anywhere in the world.",
  },
  {
    icon: <FolderKanban className="w-6 h-6" />,
    title: "Smart Organization",
    description: "Create folders, tag files, and find everything instantly.",
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: "End‑to‑End Encryption",
    description: "Your data is encrypted before it leaves your device.",
  },
  {
    icon: <Share2 className="w-6 h-6" />,
    title: "Secure Sharing",
    description: "Share files with anyone via protected links.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Lightning Fast",
    description: "Optimised servers for quick uploads and downloads.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Global CDN",
    description: "Files are delivered from the nearest server to you.",
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: "Scalable Storage",
    description: "Plans from 5GB to unlimited storage.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Team Collaboration",
    description: "Share folders and manage permissions together.",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "File Preview",
    description: "View images, PDFs, and documents without downloading.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Version History",
    description: "Restore older versions of your files.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Compliance Ready",
    description: "GDPR, HIPAA, and SOC2 compliant infrastructure.",
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: "Mobile Apps",
    description: "Native apps for iOS and Android (coming soon).",
  },
];

export default function Features() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

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
              <Link to="/features" className="text-indigo-600 dark:text-indigo-400 font-medium">
                Features
              </Link>
              <Link to="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition font-medium">
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

        {/* Mobile Slide-out Menu – Dynamic */}
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
              <Link to="/features" className="text-indigo-600 dark:text-indigo-400 font-medium" onClick={() => setMobileMenuOpen(false)}>Features</Link>
              <Link to="/pricing" className="text-gray-800 dark:text-gray-200 font-medium" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
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

      {/* Hero Section */}
      <section className="py-20 md:py-28 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp delay={0}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
              Everything you need to{" "}
              <span className="text-indigo-600 dark:text-indigo-400">store and share</span>{" "}
              files securely
            </h1>
          </FadeUp>
          <FadeUp delay={100}>
            <p className="mt-6 text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to simplify your workflow and keep your data safe.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* Features Grid – modern card design with dark mode */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature, idx) => (
            <FadeUp key={idx} delay={(idx % 3) * 100}>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-indigo-600 dark:bg-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to experience the future of file storage?
          </h2>
          <p className="text-lg text-indigo-100 dark:text-indigo-200 mb-8">
            Join thousands of users who trust StorageApp.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-md"
          >
            Start free trial <ArrowRight className="w-5 h-5" />
          </Link>
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