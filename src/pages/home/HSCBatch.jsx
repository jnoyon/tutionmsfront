import React from "react";
import { Link } from "react-router";

export default function HSCBatch() {
  return (
    <section className="relative py-8">
      {/* Animated Gradient Border */}
      <div className="relative rounded-2xl p-1 bg-gradient-to-r from-purple-400 via-pink-500 to-red-400 animate-gradient-x">
        
        {/* Inner Content */}
        <div className="bg-white rounded-2xl p-8 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              এইচএসসি ফোকাস ব্যাচ
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              বিষয়ভিত্তিক ব্যাচ  
            </p>
          </div>

          {/* Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            {/* Facilities Card */}
            <div className="p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-50 flex flex-col justify-between">
              <ul className="space-y-3 text-gray-700 text-sm">
                {[
                  "প্রতিদিন ক্লাস: ১টি",
                  "ক্লাসের সময়সীমা: ১ ঘন্টা",
                  "মাসিক পুরস্কার",
                  "মাসে ৩টি পরীক্ষা"
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className="mt-6 btn btn-primary w-full py-2 text-sm font-semibold rounded-lg text-center hover:bg-blue-700 transition-colors duration-300"
              >
                ভর্তি হোন
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style jsx>{`
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 6s ease infinite;
        }
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </section>
  );
}
