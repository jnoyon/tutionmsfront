import { FaClock, FaLevelUpAlt, FaLink, FaPaperclip, FaYoutube } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { Link } from "react-router";

export default function BatchComponent({ batch }) {
  const batchTitles = {
    "কম্পিউটার": "কম্পিউটার অফিস অ্যাপলিকেশন ব্যাচ",
    "১": "ব্যাচ ১",
    "২": "ব্যাচ ২",
    "৩": "ব্যাচ ৩",
    "৪": "ব্যাচ ৪",
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white shadow-md rounded-lg p-4 text-center">
        <h2 className="text-gray-700 font-medium text-base sm:text-lg md:text-xl">
          আপনি বর্তমানে <span className="font-bold text-primary">ব্যাচ-{batchTitles[batch] || batch}</span> এ আছেন।
        </h2>
      </div>

      {/* Resources */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Link to="/report" className="flex flex-col items-center border rounded-lg px-1 py-3 hover:bg-red-50 transition">
            <FaLink className="bg-red-500 text-white p-1.5 rounded-full text-4xl mb-2" />
            <p className="font-bold text-gray-700">রিপোর্ট</p>
            <span className="text-sm text-gray-600">শিক্ষার্থী প্রোফাইল</span>
          </Link>

          <Link to="/quiz" className="flex flex-col items-center border rounded-lg px-1 py-3 hover:bg-red-50 transition">
            <FaClock className="bg-blue-500 text-white p-1.5 rounded-full text-4xl mb-2" />
            <p className="font-bold text-gray-700">কুইজ</p>
            <span className="text-sm text-gray-600">অনলাইন পরীক্ষা</span>
          </Link>

          <Link to="/result" className="flex flex-col items-center border rounded-lg px-1 py-3 hover:bg-red-50 transition">
            <FaPaperclip className="bg-purple-500 text-white p-1.5 rounded-full text-4xl mb-2" />
            <p className="font-bold text-gray-700">ফলাফল</p>
            <span className="text-sm text-gray-600">কুইজের ফলাফল</span>
          </Link>

          <Link to="/leaderboard" className="flex flex-col items-center border rounded-lg px-1 py-3 hover:bg-red-50 transition">
            <FaUsers className="bg-orange-500 text-white p-1.5 rounded-full text-4xl mb-2" />
            <p className="font-bold text-gray-700">লিডারবোর্ড</p>
            <span className="text-sm text-gray-600">শিক্ষার্থীদের অবস্থান</span>
          </Link>

          <Link to="/videos" className="flex flex-col items-center border rounded-lg px-1 py-3 hover:bg-red-50 transition">
            <FaYoutube className="bg-red-500 text-white p-1.5 rounded-full text-4xl mb-2" />
            <p className="font-bold text-gray-700">ভিডিও</p>
            <span className="text-sm text-gray-600">সহায়ক ক্লাস</span>
          </Link>
        {batch === "কম্পিউটার" && (
          <Link to="/sheet" className="flex flex-col items-center border rounded-lg px-1 py-3 hover:bg-red-50 transition">
            <FaLevelUpAlt className="bg-green-500 text-white p-1.5 rounded-full text-4xl mb-2" />
            <p className="font-bold text-gray-700">এসাইনমেন্ট</p>
            <span className="text-sm text-gray-600">এখানে দেখুন</span>
          </Link>
        )}
          
         
        </div>
      </div>
    </div>
  );
}
