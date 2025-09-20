import { FaYoutube } from "react-icons/fa";

export default function Computer() {
  return (
    <div className="space-y-4">
      {/* পরীক্ষাসমূহ Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="bg-accent text-center text-white font-bold rounded-md py-2 mb-3 text-lg">
          পরীক্ষাসমূহ
        </h2>
        <p className="text-gray-600 text-center">
          খুব শীঘ্রই এ ব্যাচের তথ্য এবং প্রয়োজনীয় কন্টেন্ট দেওয়া হবে।
        </p>
      </div>

      {/* YouTube Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="bg-error text-center text-white font-bold rounded-md py-2 mb-3 text-lg">
          ইউটিউব ভিডিও
        </h2>
        <ul className="flex flex-col gap-3">
          <li>
            <a
              href="https://youtu.be/JkDeKfZYfiQ"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 hover:bg-red-50 transition duration-200"
            >
              <FaYoutube className="text-red-500 text-2xl" />
              <span className="font-medium text-gray-700">
                গুগল ফর্ম এর ব্যবহার
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
