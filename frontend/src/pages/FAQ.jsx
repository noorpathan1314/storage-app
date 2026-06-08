// src/pages/FAQ.jsx
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Cloud,
  ChevronDown,
  ChevronUp,
  Search,
  HelpCircle,
  Shield,
  CreditCard,
  Users,
  Globe,
  MessageCircle,
} from "lucide-react";

const faqs = [
  {
    id: 1,
    category: "general",
    q: "What is StorageApp?",
    a: "StorageApp is a secure cloud storage platform that lets you upload, organize, share, and collaborate on files from anywhere, with enterprise-grade security.",
  },
  {
    id: 2,
    category: "security",
    q: "How secure is my data?",
    a: "We use end-to-end encryption and AES-256 bit encryption for files at rest. Your data is protected with the highest security standards, and only you have the keys.",
  },
  {
    id: 3,
    category: "billing",
    q: "Can I upgrade or downgrade my plan?",
    a: "Yes, you can change your plan anytime from the Settings page. Upgrades are instant, downgrades take effect at the next billing cycle.",
  },
  {
    id: 4,
    category: "general",
    q: "What happens if I delete a file?",
    a: "Deleted files move to Trash and stay there for 30 days. You can restore them anytime or permanently delete them from Trash.",
  },
  {
    id: 5,
    category: "billing",
    q: "Do you offer team plans?",
    a: "Yes, our Business plan includes team collaboration features, shared folders, centralized billing, and dedicated support.",
  },
  {
    id: 6,
    category: "general",
    q: "How can I contact support?",
    a: "You can reach us via the Contact page, email support@storageapp.com, or live chat during business hours.",
  },
  {
    id: 7,
    category: "security",
    q: "Does StorageApp offer two-factor authentication?",
    a: "Yes, 2FA is available for all paid plans. You can enable it from your Security Settings page.",
  },
  {
    id: 8,
    category: "billing",
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal.",
  },
];

const categories = [
  { id: "all", label: "All Questions", icon: HelpCircle },
  { id: "general", label: "General", icon: Globe },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = useMemo(() => {
    let filtered = faqs;
    if (activeCategory !== "all") {
      filtered = filtered.filter((f) => f.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (f) => f.q.toLowerCase().includes(query) || f.a.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-sm mb-6">
            <Cloud className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">FAQ</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            Everything you need to know about StorageApp. Can't find what you're looking for?{" "}
            <Link to="/contact" className="text-indigo-600 font-medium hover:underline">
              Contact support
            </Link>
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-lg mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
                  : "bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700"
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* No results */}
        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <HelpCircle className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">No questions found matching your search.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}
              className="mt-4 text-indigo-600 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === faq.id;
            return (
              <div
                key={faq.id}
                className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : faq.id)}
                  className="w-full flex justify-between items-center p-5 text-left"
                >
                  <span className="text-base md:text-lg font-medium text-gray-900 dark:text-white pr-4">
                    {faq.q}
                  </span>
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center transition-transform duration-300">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-indigo-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-indigo-600" />
                    )}
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700/50 pt-3 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions? */}
        <div className="mt-12 text-center bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-2xl p-8 border border-indigo-100 dark:border-indigo-900/30">
          <MessageCircle className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Still have questions?</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
            Can't find the answer you're looking for? Our team is here to help.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md"
          >
            Contact Support
          </Link>
        </div>

        {/* Back to Pricing */}
        <div className="text-center mt-8">
          <Link to="/pricing" className="text-sm text-gray-500 hover:text-indigo-600 transition">
            ← Back to Pricing
          </Link>
        </div>
      </div>

      {/* Animation style */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}