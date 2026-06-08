// src/pages/Careers.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Cloud, Users, Briefcase, Mail, Heart, Coffee, Globe, Award, Zap, ArrowRight, MapPin, Clock, DollarSign } from "lucide-react";

const jobOpenings = [
  {
    title: "Full Stack Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    salary: "$80k - $120k",
    icon: Briefcase,
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    salary: "$70k - $100k",
    icon: Zap,
  },
  {
    title: "DevOps Engineer",
    department: "Infrastructure",
    location: "Remote",
    type: "Full-time",
    salary: "$90k - $130k",
    icon: Award,
  },
  {
    title: "Customer Success Manager",
    department: "Support",
    location: "Remote",
    type: "Full-time",
    salary: "$60k - $85k",
    icon: Globe,
  },
];

const perks = [
  { icon: Heart, title: "Health Insurance", desc: "Comprehensive medical, dental & vision coverage" },
  { icon: Coffee, title: "Remote First", desc: "Work from anywhere in the world" },
  { icon: Users, title: "Team Retreats", desc: "Annual company offsites and team building" },
  { icon: Clock, title: "Flexible Hours", desc: "Work when you're most productive" },
];

export default function Careers() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-sm mb-6">
            <Cloud className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">We're hiring</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Join Our Team
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg mt-4 max-w-2xl mx-auto">
            We're building the future of cloud storage — and we want you to be part of it.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Link
              to="#openings"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md"
            >
              View Openings <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition border border-gray-200 dark:border-gray-700"
            >
              Learn About Us
            </Link>
          </div>
        </div>

        {/* Stats / Impact */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { value: "10M+", label: "Files Stored", icon: Cloud },
            { value: "150+", label: "Team Members", icon: Users },
            { value: "30+", label: "Countries", icon: Globe },
            { value: "99.9%", label: "Uptime", icon: Zap },
          ].map((stat, idx) => (
            <div key={idx} className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-gray-100 dark:border-gray-700">
              <div className="w-10 h-10 mx-auto bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-2">
                <stat.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Perks / Benefits Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Why join us?</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">We take care of our team</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {perks.map((perk, idx) => (
              <div key={idx} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-5 text-center border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
                <div className="w-12 h-12 mx-auto bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-3">
                  <perk.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{perk.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions Section */}
        <div id="openings" className="scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
              <Briefcase className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Open Positions</h2>
            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs px-2 py-0.5 rounded-full">
              {jobOpenings.length} openings
            </span>
          </div>

          <div className="space-y-4">
            {jobOpenings.map((job, idx) => (
              <div
                key={idx}
                className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                        <job.icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {job.type}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.salary}</span>
                    </div>
                  </div>
                  <button className="text-sm bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-1.5 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-800/50 transition group-hover:shadow-sm">
                    Apply Now →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No fit? */}
          <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 text-center">
            <Mail className="w-8 h-8 text-indigo-500 dark:text-indigo-400 mx-auto mb-2" />
            <p className="text-gray-700 dark:text-gray-300">
              Don't see a perfect fit?{" "}
              <a
                href="mailto:careers@storageapp.com"
                className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                Send your resume
              </a>{" "}
              to careers@storageapp.com
            </p>
          </div>
        </div>

        {/* Back to About */}
        <div className="text-center mt-12">
          <Link to="/about" className="text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
            ← Back to About
          </Link>
        </div>
      </div>
    </div>
  );
}