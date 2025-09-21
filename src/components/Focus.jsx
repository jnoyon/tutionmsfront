import React from 'react';
import { FaYoutube, FaLink } from 'react-icons/fa';
import { Link } from 'react-router';

export default function Focus() {
  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 flex flex-col gap-6">

      {/* Header */}
      <div className="bg-white shadow-md rounded-lg p-4 text-center">
        <h2 className="text-gray-700 font-medium text-base sm:text-lg md:text-xl">
          আপনি বর্তমানে <span className="font-bold text-accent">ফোকাস ব্যাচ</span> এ আছেন। <br />
          ফোকাস ব্যাচ সম্পর্কে জানতে{" "}
          <Link className="text-error font-bold underline" to="/focus">
            এখানে ক্লিক করুন
          </Link>
        </h2>
      </div>

      {/* পরীক্ষাসমূহ Section */}
      <div className="bg-white shadow-md rounded-lg p-4 flex flex-col gap-3">
        <h2 className="bg-accent text-center text-white font-bold rounded-md py-2 text-lg">
          পরীক্ষাসমূহ
        </h2>
        <p className="text-gray-600 text-center">
          খুব শীঘ্রই এ ব্যাচের তথ্য এবং প্রয়োজনীয় কন্টেন্ট দেওয়া হবে।
        </p>

        {/* Placeholder links or future exams */}
        <Link
          to="/quiz"
          className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 hover:bg-accent/10 transition duration-200 w-full"
        >
          <FaLink className="text-accent text-2xl" />
          <span className="font-medium text-gray-700">পরীক্ষাসমূহে যান</span>
        </Link>
      </div>

      {/* YouTube Section */}
      <div className="bg-white shadow-md rounded-lg p-4 flex flex-col gap-3">
        <h2 className="bg-error text-center text-white font-bold rounded-md py-2 text-lg">
          ইউটিউব ভিডিও
        </h2>
        <a
          href="https://www.youtube.com/playlist?list=PLQsbXn2aOMyg0KF-Bo4Mn_IM59SYt3jkl"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 hover:bg-red-50 transition duration-200 w-full"
        >
          <FaYoutube className="text-red-500 text-2xl" />
          <span className="font-medium text-gray-700">চতুর্থ অধ্যায়</span>
        </a>
      </div>
    </div>
  );
}
