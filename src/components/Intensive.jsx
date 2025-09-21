import React from 'react';
import { FaLink, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router';

export default function Intensive() {
  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 flex flex-col gap-6">
      
      {/* Header */}
      <div className="bg-white shadow-md rounded-lg p-4 text-center">
        <h2 className="text-gray-700 font-medium text-base sm:text-lg md:text-xl">
          আপনি বর্তমানে <span className="font-bold text-accent">ইন্টেন্সিভ ব্যাচ</span> এ আছেন। <br />
          ইন্টেন্সিভ ব্যাচ সম্পর্কে জানতে{" "}
          <Link className="text-error font-bold underline" to="/intensive">
            এখানে ক্লিক করুন
          </Link>
        </h2>
      </div>

      {/* Resource Links */}
      <div className="bg-white shadow-md rounded-lg p-4 flex flex-col gap-3">
        <h2 className="bg-error text-center text-white font-bold rounded-md py-2 text-lg">
          প্রয়োজনীয় লিংক
        </h2>
        <Link
          to="/quiz"
          className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 hover:bg-red-50 transition duration-200 w-full"
        >
          <FaLink className="text-red-500 text-2xl" />
          <span className="font-medium text-gray-700">পরীক্ষাসমূহ</span>
        </Link>

        <Link
          to="/sheet"
          className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 hover:bg-red-50 transition duration-200 w-full"
        >
          <FaLink className="text-red-500 text-2xl" />
          <span className="font-medium text-gray-700">লেকচারশীট</span>
        </Link>

        <Link
          to="/result"
          className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 hover:bg-red-50 transition duration-200 w-full"
        >
          <FaLink className="text-red-500 text-2xl" />
          <span className="font-medium text-gray-700">পরীক্ষার ফলাফল</span>
        </Link>

        <Link
          to="/leaderboard"
          className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 hover:bg-red-50 transition duration-200 w-full"
        >
          <FaLink className="text-red-500 text-2xl" />
          <span className="font-medium text-gray-700">লিডারবোর্ড</span>
        </Link>

        <a
          href="https://docs.google.com/document/d/1YXsScX99BIOY__e4UIbjFBwsTsvfETL_3O3poyc8A_s/edit?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-3 hover:bg-red-50 transition duration-200 w-full"
        >
          <FaLink className="text-red-500 text-2xl" />
          <span className="font-medium text-gray-700">ক্লাস শিডিউল</span>
        </a>
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
