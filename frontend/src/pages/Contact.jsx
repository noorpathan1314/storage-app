// src/pages/Contact.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Cloud,
  Send,
  Mail,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Headphones,
  Clock,
  MapPin,
} from "lucide-react";

// ✅ Use environment variable for backend URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const response = await fetch(`${BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setTimeout(() => setStatus(null), 5000);
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg("Network error. Please check your connection.");
      setTimeout(() => setStatus(null), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-sm mb-4">
            <Cloud className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-700">StorageApp Support</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Get in touch
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            Have questions about pricing, features, or anything else? We're here to help.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left side - Contact info / Illustration */}
          <div className="order-2 md:order-1 space-y-6">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                How can we help?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                Our team typically responds within 24 hours. For urgent matters, please call us.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">support@storageapp.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Hours</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Mon-Fri, 9am – 6pm EST</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Office</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">123 Cloud St, Suite 100, San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote or testimonial */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/30">
              <p className="text-sm italic text-gray-700 dark:text-gray-200">
                "StorageApp helped us streamline our team's workflow. Their support is top-notch!"
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-8 h-8 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center text-indigo-600 font-bold text-xs">
                  JD
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-900 dark:text-white">John Davis</p>
                  <p className="text-xs text-gray-500">CTO, TechCorp</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Contact Form */}
          <div className="order-1 md:order-2">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Send a message
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Fill out the form and we'll respond shortly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-800 dark:text-white transition"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-800 dark:text-white transition"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <div className="relative group">
                    <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition" />
                    <textarea
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-800 dark:text-white transition resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>
                </div>

                {/* Status messages */}
                {status === "sending" && (
                  <div className="flex items-center justify-center gap-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 py-2 rounded-xl">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                    <span className="text-sm">Sending...</span>
                  </div>
                )}
                {status === "success" && (
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">Message sent successfully! We'll get back to you soon.</span>
                  </div>
                )}
                {status === "error" && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{errorMsg}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "sending" ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
                By submitting, you agree to our{" "}
                <Link to="/privacy" className="underline hover:text-indigo-500">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Back to pricing */}
        <div className="text-center mt-8">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition"
          >
            ← Back to Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}