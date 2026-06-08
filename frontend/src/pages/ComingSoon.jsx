// src/pages/ComingSoon.jsx
import { Link } from "react-router-dom";
import { Cloud } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Cloud className="w-16 h-16 text-indigo-600 mb-4" />
      <h1 className="text-3xl font-bold text-gray-900">Coming Soon! 🚀</h1>
      <p className="text-gray-600 mt-2">This feature is under development.</p>
      <Link to="/dashboard" className="mt-6 text-indigo-600 hover:underline">
        ← Back to Dashboard
      </Link>
    </div>
  );
}