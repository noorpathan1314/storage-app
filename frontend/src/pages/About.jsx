// src/pages/About.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Cloud,
  Heart,
  Users,
  Rocket,
  Shield,
  Zap,
  Globe,
  Menu,
  X,
  User,
} from "lucide-react";

const values = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Security First",
    description: "Your data's safety is our top priority.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Blazing Fast",
    description: "We optimise every millisecond.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Customer Obsessed",
    description: "Your success is our success.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Global Reach",
    description: "Serving users in over 150 countries.",
  },
];

const team = [
  {
    name: "Muhammad Noor",
    role: "Founder & CEO",
    bio: "Full-stack developer with a passion for secure cloud solutions.",
    avatar: "👨‍💻",
  },
  {
    name: "Sarah Chen",
    role: "CTO",
    bio: "Ex-Google engineer, distributed systems expert.",
    avatar: "👩‍💻",
  },
  {
    name: "Alex Rivera",
    role: "Lead Designer",
    bio: "Crafting intuitive user experiences.",
    avatar: "🎨",
  },
  {
    name: "Emily Watson",
    role: "Head of Support",
    bio: "Making sure you're never stuck.",
    avatar: "💬",
  },
];

export default function About() {
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
              <Link to="/features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition font-medium">
                Features
              </Link>
              <Link to="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition font-medium">
                Pricing
              </Link>
              <Link to="/about" className="text-indigo-600 dark:text-indigo-400 font-medium">
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
              <Link to="/pricing" className="text-gray-800 dark:text-gray-200 font-medium" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
              <Link to="/about" className="text-indigo-600 dark:text-indigo-400 font-medium" onClick={() => setMobileMenuOpen(false)}>About</Link>
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

      {/* Hero / Mission Section */}
      <section className="text-center py-20 px-4 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          Our mission: <span className="text-indigo-600 dark:text-indigo-400">secure, simple storage</span> for everyone.
        </h1>
        <p className="mt-6 text-xl text-gray-500 dark:text-gray-400">
          We believe that your data should be accessible from anywhere, without
          compromising on security or ease of use.
        </p>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">2024</div>
              <div className="mt-2 text-gray-500 dark:text-gray-400">Founded</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">100k+</div>
              <div className="mt-2 text-gray-500 dark:text-gray-400">Active users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">500M+</div>
              <div className="mt-2 text-gray-500 dark:text-gray-400">Files stored</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">99.9%</div>
              <div className="mt-2 text-gray-500 dark:text-gray-400">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Story & Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Our story</h2>
            <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
              StorageApp started with a simple idea: cloud storage shouldn't be
              complicated or insecure. Today, we're helping thousands of people
              and teams store, share, and collaborate effortlessly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mt-12">
            <div>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                alt="Team working"
                className="rounded-2xl shadow-md"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Built by developers, for everyone</h3>
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                Our team comes from diverse backgrounds – security, design, and
                distributed systems. We're passionate about creating a product
                that you'll love to use every day.
              </p>
              <div className="mt-6 flex gap-2 items-center">
                <Heart className="w-6 h-6 text-red-500" />
                <span className="text-gray-700 dark:text-gray-300">Made with love in Pakistan</span>
              </div>
            </div>
          </div>

          {/* Core values */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Our core values</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {values.map((value, idx) => (
                <div
                  key={idx}
                  className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="w-12 h-12 mx-auto bg-indigo-50 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-900 dark:text-white">{value.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Meet the team</h2>
            <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">Passionate people behind StorageApp</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="text-center">
                <div className="w-32 h-32 mx-auto bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-5xl shadow-sm">
                  {member.avatar}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-medium">{member.role}</p>
                <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA – Join the team */}
      <section className="py-20 bg-indigo-600 dark:bg-indigo-700">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Want to join our mission?</h2>
          <p className="text-xl text-indigo-100 dark:text-indigo-200 mb-8">
            We're always looking for talented people. Check our careers page.
          </p>
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition shadow-md"
          >
            View open positions
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