import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase.init";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function LeaderboardSection({ batch }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const fallbackImage = "/default-avatar.png";

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "students"),
          where("batch", "==", batch),
          where("isActive", "==", true)
        );
        const snapshot = await getDocs(q);
        const allStudents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(allStudents);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      } finally {
        setLoading(false);
      }
    };

    if (batch) fetchStudents();
  }, [batch]);

  if (loading)
    return (
      <div className="bg-white min-h-40 flex justify-center items-center">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );

  if (!loading && students.length === 0)
    return (
      <div className="bg-white min-h-40 flex justify-center items-center">
        <p className="text-gray-500 font-medium">কোন শিক্ষার্থী নেই</p>
      </div>
    );

  const sorted = [...students]
    .filter((s) => s.image)
    .sort((a, b) => b.mark - a.mark)
    .slice(0, 3);

  return (
    <div className="bg-white pt-5 mb-8">
      <h2 className="font-bold mb-6 text-2xl text-center text-red-600">
        সেরা শিক্ষার্থী <span className="text-blue-800">(ব্যাচ - {batch})</span>
      </h2>

      <div className="flex justify-center items-end gap-4 md:gap-10 relative">
        {sorted.map((student, index) => {
          const position = index === 0 ? "১ম" : index === 1 ? "২য়" : "৩য়";
          const bgColor =
            index === 0
              ? "bg-yellow-200"
              : index === 1
              ? "bg-gray-200"
              : "bg-orange-200";
          const borderColor =
            index === 0
              ? "border-yellow-400"
              : index === 1
              ? "border-gray-400"
              : "border-orange-400";

          // Smaller image sizes on mobile
          const imgSize =
            index === 0
              ? "w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 -mb-10 sm:-mb-12 md:mb-20"
              : "w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 -mb-6 sm:-mb-8 md:-mb-12";

          const orderClass =
            index === 0 ? "order-2" : index === 1 ? "order-1" : "order-3";

          return (
            <div
              key={student.id}
              className={`flex flex-col items-center transition-transform hover:scale-105 ${orderClass}`}
            >
              <div
                className={`${bgColor} rounded-t-3xl relative shadow-md w-full flex items-end justify-center py-2`}
              >
                <img
                  src={student.image || fallbackImage}
                  alt={student.name}
                  className={`${imgSize} rounded-full border-4 ${borderColor} shadow-lg`}
                />
                <span className="absolute -top-4 text-white px-2 py-1 rounded-full text-sm sm:text-base md:text-lg bg-black/70 font-bold shadow">
                  {position}
                </span>
              </div>

              <div className="mt-8 text-center">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                  {student.name}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-500">
                  {student.instituteName}
                </p>
                <p className="text-sm sm:text-base md:text-base text-red-600 font-bold mt-1">
                  প্রাপ্ত নম্বর: {student.mark}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Decorative bottom bar */}
      <div className="mt-6 flex justify-center gap-2">
        <div className="w-1/3 h-1 bg-red-400 rounded-full animate-pulse"></div>
        <div className="w-1/3 h-1 bg-blue-800 rounded-full animate-pulse delay-150"></div>
        <div className="w-1/3 h-1 bg-red-400 rounded-full animate-pulse delay-300"></div>
      </div>
    </div>
  );
}
