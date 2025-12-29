import React, { useEffect, useState, useContext } from "react";
import { db } from "../firebase/firebase.init";
import { collection, query, where, getDocs } from "firebase/firestore";
import { AuthContext } from "../firebase/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router";
import {
  FaBook,
  FaClock,
  FaHtml5,
  FaPaperclip,
  FaYoutube,
} from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";

export default function BatchComponent() {
  const { user } = useContext(AuthContext);
  const [student, setStudent] = useState(null);

  const batchTitles = {
    অর্থনীতি: "অর্থনীতি",
    "১": "ব্যাচ ১",
    "২": "ব্যাচ ২",
    "৩": "ব্যাচ ৩",
    "৪": "ব্যাচ ৪",
  };

  useEffect(() => {
    if (!user?.studentId) return;

    const fetchStudent = async () => {
      try {
        const q = query(
          collection(db, "students"),
          where("studentId", "==", user.studentId)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          toast.error("Student not found!");
          return;
        }
        setStudent({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch student data");
      }
    };

    fetchStudent();
  }, [user]);

  if (!student)
    return (
      <div className="bg-white min-h-screen flex justify-center items-center">
        <span className="loading loading-bars loading-xl"></span>
      </div>
    );

  const resources = [
    {
      title: "শীট",
      subtitle: "সহায়ক নোট",
      icon: <FaBook className="text-white text-4xl p-2 rounded-full" />,
      iconBg: "bg-red-500",
      link: "/sheet",
    },
    {
      title: "কুইজ",
      subtitle: "অনলাইন পরীক্ষা",
      icon: <FaClock className="text-white text-4xl p-2 rounded-full" />,
      iconBg: "bg-blue-500",
      link: "/quiz",
    },
    {
      title: "ফলাফল",
      subtitle: "কুইজের ফলাফল",
      icon: <FaPaperclip className="text-white text-4xl p-2 rounded-full" />,
      iconBg: "bg-purple-500",
      link: "/result",
    },
    {
      title: "লিডারবোর্ড",
      subtitle: "শিক্ষার্থীদের অবস্থান",
      icon: <FaUsers className="text-white text-4xl p-2 rounded-full" />,
      iconBg: "bg-orange-500",
      link: "/leaderboard",
    },
    {
      title: "ভিডিও",
      subtitle: "সহায়ক ক্লাস",
      icon: <FaYoutube className="text-white text-4xl p-2 rounded-full" />,
      iconBg: "bg-red-500",
      link: "/videos",
    },
    {
      title: "এইচটিএমএল এডিটর",
      subtitle: "কোড লিখুন",
      icon: <FaHtml5 className="text-white text-4xl p-2 rounded-full" />,
      iconBg: "bg-orange-500",
      link: "/html",
    },
  ];

  return (
    <>
      <ToastContainer autoClose={2000} />

      {/* Student Header */}
      <div className="bg-white shadow-md rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 mb-6">
        <img
          src={student.image || "/default-avatar.png"}
          alt={student.name}
          className="w-24 h-24 rounded-full object-cover border-2 border-red-500"
        />
        <div className="flex-1 text-center sm:text-left">
          <p className="font-bold text-xl text-red-700">{student.name}</p>
          <p className="text-gray-600">
            ব্যাচ: {batchTitles[student.batch] || student.batch}
          </p>
          <p className="text-gray-600">প্রাপ্ত নম্বর: {student.mark || 0}</p>
        </div>
        <Link
          to="/report"
          className="btn btn-sm btn-error text-white font-bold"
        >
          রিপ‌োর্ট দেখুন
        </Link>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
        {resources.map((res, idx) => (
          <Link
            key={idx}
            to={res.link}
            className="flex flex-col items-center border border-gray-200 rounded-lg p-3 bg-white hover:bg-red-50 shadow-md transition-transform transform hover:scale-105"
          >
            <div className={`mb-2 ${res.iconBg} rounded-full p-3`}>
              {res.icon}
            </div>
            <p className="font-bold text-gray-700">{res.title}</p>
            <span className="text-sm text-gray-500">{res.subtitle}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
