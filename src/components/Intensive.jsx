import {  FaCalendarCheck, FaClock, FaLink, FaPaperclip, FaYoutube } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { Link } from "react-router";

export default function Intensive() {
  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white shadow-md rounded-lg p-4 text-center">
        <h2 className="text-gray-700 font-medium text-base sm:text-lg md:text-xl">
          আপনি বর্তমানে{" "}
          <span className="font-bold text-accent">ইন্টেন্সিভ ব্যাচ</span> এ
          আছেন। <br />
          ইন্টেন্সিভ ব্যাচ সম্পর্কে জানতে{" "}
          <Link className="text-error font-bold underline" to="/intensive">
            এখানে ক্লিক করুন
          </Link>
        </h2>
      </div>

      {/* Resource Links */}
      <div className="bg-white shadow-md rounded-lg p-4">

        {/* Grid Layout: Left 3, Right 3 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          
          <Link
            to="/report"
            className="flex flex-col items-center border border-gray-200 rounded-lg px-1 py-3 hover:bg-red-50 transition"
          >
            <FaLink className="bg-red-500 text-white p-1.5 rounded-full text-4xl mb-2" />
            <p className="font-bold text-gray-700">রিপোর্ট</p>
            <span className="text-sm text-gray-600">শিক্ষার্থী প্রোফাইল</span>
          </Link>
          <Link
            to="/quiz"
            className="flex flex-col items-center border border-gray-200 rounded-lg px-1 py-3 hover:bg-red-50 transition"
          >
            <FaClock className="bg-blue-500 text-white p-1.5 rounded-full text-4xl mb-2" />
            <p className="font-bold text-gray-700">কুইজ</p>
            <span className="text-sm text-gray-600">অনলাইন পরীক্ষা</span>
          </Link>
          <Link
            to="/result"
            className="flex flex-col items-center border border-gray-200 rounded-lg px-1 py-3 hover:bg-red-50 transition"
          >
            <FaPaperclip className="bg-purple-500 text-white p-1.5 rounded-full text-4xl mb-2" />
            <p className="font-bold text-gray-700">ফলাফল</p>
            <span className="text-sm text-gray-600">কুইজের ফলাফল</span>
          </Link>
          <Link
            to="/leaderboard"
            className="flex flex-col items-center border border-gray-200 rounded-lg px-1 py-3 hover:bg-red-50 transition"
          >
            <FaUsers className="bg-orange-500 text-white p-1.5 rounded-full text-4xl mb-2" />
            <p className="font-bold text-gray-700">লিডারবোর্ড</p>
            <span className="text-sm text-gray-600"> শিক্ষার্থীদের অবস্থান </span>
          </Link>

          <a
            href="https://docs.google.com/document/d/1YXsScX99BIOY__e4UIbjFBwsTsvfETL_3O3poyc8A_s/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center border border-gray-200 rounded-lg px-2 py-3 hover:bg-red-50 transition"
          >
            <FaCalendarCheck className="bg-green-500 text-white p-1.5 rounded-full text-4xl mb-2" />
            <span className="font-bold text-gray-700">ক্লাস শিডিউল</span>
            <span className="text-sm text-gray-600">  পরীক্ষার সিলেবাস </span>
          </a>
        <Link
            to="/videos"
            className="flex flex-col items-center border border-gray-200 rounded-lg px-1 py-3 hover:bg-red-50 transition"
          >
            <FaYoutube className="bg-red-500 text-white p-1.5 rounded-full text-4xl mb-2" />
            <p className="font-bold text-gray-700">ভিডিও</p>
            <span className="text-sm text-gray-600"> সহায়ক ক্লাস </span>
          </Link>

        </div>
      </div>

      {/* YouTube Section */}
      
    </div>
  );
}
