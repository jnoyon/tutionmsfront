import React from 'react'
import { FaLink, FaYoutube } from 'react-icons/fa'
import { Link } from 'react-router'

export default function Intensive() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-4 space-y-4">
      {/* Header */}
      <h2 className="text-gray-700 font-medium text-center">
        আপনি বর্তমানে <span className="font-bold text-accent">ইন্টেন্সিভ ব্যাচ</span> এ আছেন। ইন্টেন্সিভ ব্যাচ সম্পর্কে জানতে <Link className='text-error font-bold' to='/intensive'> এখানে ক্লিক করুন </Link>
      </h2>

      {/* পরীক্ষাসমূহ Section */}
      <div className="bg-gray-50 rounded-md p-3">
        <h2 className="bg-accent text-center text-white font-bold rounded-md py-2 mb-2 text-lg">
          পরীক্ষাসমূহ
        </h2>
        <p className="text-gray-600 text-center">
          খুব শীঘ্রই এ ব্যাচের তথ্য এবং প্রয়োজনীয় কন্টেন্ট দেওয়া হবে।
        </p>
      </div>

      {/* YouTube Section */}
      <div>
        <h2 className="bg-error text-center text-white font-bold rounded-md py-2 text-lg">
          ইউটিউব ভিডিও
        </h2>
        <ul className="mt-3 flex flex-col gap-3">
          <li>
            <a
              href="https://www.youtube.com/playlist?list=PLQsbXn2aOMyg0KF-Bo4Mn_IM59SYt3jkl"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 hover:bg-red-50 transition duration-200"
            >
              <FaYoutube className="text-red-500 text-2xl" />
              <span className="font-medium text-gray-700">চতুর্থ অধ্যায়</span>
            </a>
          </li>
        </ul>
      </div>

       <div>
        <h2 className="bg-error text-center text-white font-bold rounded-md py-2 text-lg">
          প্রয়োজনীয় লিংক
        </h2>
        <ul className="mt-3 flex flex-col gap-3">
          <li>
            <a
              href="https://docs.google.com/document/d/1YXsScX99BIOY__e4UIbjFBwsTsvfETL_3O3poyc8A_s/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 hover:bg-red-50 transition duration-200"
            >
              <FaLink className="text-red-500 text-2xl" />
              <span className="font-medium text-gray-700">ক্লাস শিডিউল</span>
            </a>
          </li>
        </ul>
      </div>

    </div>
  )
}
