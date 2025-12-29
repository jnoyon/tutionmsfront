import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router";
import pattern from "../../assets/images/memphis-colorful.png";

export default function HSCHome() {
  const features = [
    { title: "প্রতিদিন ক্লাস: ১টি" },
    { title: "ক্লাসের সময়সীমা: ১ ঘন্টা" },
    { title: "পুরস্কার ও স্বীকৃতি" },
    { title: "মাসে ১০টি পরীক্ষা" },
  ];

  return (
    <section
      className="relative flex flex-col justify-center overflow-hidden py-10 bg-gradient-to-br from-blue-50 via-white to-red-50"
      style={{
        minHeight: "calc(100vh - 81px)",
        backgroundImage: `url(${pattern})`,
        backgroundRepeat: "repeat",
        backgroundSize: "400px 400px",
        backgroundBlendMode: "soft-light",
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/40 to-transparent backdrop-blur-[2px]"></div>

      {/* Decorative shapes */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-[#e74c3c]/15 blur-3xl rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#2c3e50]/15 blur-3xl rounded-full animate-float-slow"></div>

      {/* Main content */}
      <div className="relative z-10 w-11/12 mx-auto flex flex-col md:flex-row items-center justify-between gap-10 bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-lg">
        {/* Left Side - Intro */}
        <div className="flex flex-col gap-6 md:w-1/2">
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-extrabold leading-tight text-[#2c3e50]"
          >
            এইচএসসি —
            <span className="block mt-2 bg-gradient-to-r from-[#2c3e50] via-[#e74c3c] to-[#2c3e50] bg-clip-text text-transparent animate-pulse">
              আপনার ভবিষ্যতের প্রস্তুতি
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-700 md:text-lg leading-relaxed"
          >
            আমাদের HSC কোর্সটি মানবিক শাখার বাংলা, ইংরেজি, ICT এবং অর্থনীতি সহ
            সকল বিষয়ের ওপর কারিকুলাম অনুযায়ী অনলাইন শিক্ষা প্রদান করে।
            প্রতিদিনের ক্লাস এবং ধারাবাহিক মূল্যায়নের মাধ্যমে শিক্ষার্থীরা
            সর্বোচ্চ প্রস্তুতি অর্জন করবে।
          </motion.p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            <Link
              to="/admission"
              className="px-8 py-3 bg-gradient-to-r from-[#e74c3c] to-[#c0392b] text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-500"
            >
              ভর্তি ফরম
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 border-2 border-[#e74c3c] text-[#e74c3c] font-semibold rounded-xl hover:bg-[#e74c3c]/10 hover:scale-105 shadow-md transition-transform duration-500"
            >
              লগিন করুন
            </Link>
          </div>
        </div>

        {/* Right Side - Features */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 w-full bg-white rounded-2xl shadow-md p-8 border border-gray-100"
        >
          <h3 className="text-2xl font-bold text-[#2c3e50] mb-4 text-center">
            কোর্সের বৈশিষ্ট্য
          </h3>
          <ul className="space-y-4">
            {features.map((f, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 rounded-lg hover:bg-[#e74c3c]/5 transition-colors"
              >
                <span className="w-3 h-3 bg-[#e74c3c] rounded-full"></span>
                <span className="font-medium text-gray-800">{f.title}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
