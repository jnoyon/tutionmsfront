import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase.init';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function LeaderboardSection({ batch }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ track loading state
  const fallbackImage = "/default-avatar.png"; // provide a default image in public folder

  // Fetch students by batch
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true); // start loading
      try {
        const q = query(
          collection(db, 'students'),
          where("batch", "==", batch),
          where("isActive", "==", true) // ✅ only active students
        );
        const snapshot = await getDocs(q);
        const allStudents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudents(allStudents);
      } catch (err) {
        console.error('Failed to fetch students:', err);
      } finally {
        setLoading(false); // stop loading
      }
    };

    if (batch) {
      fetchStudents();
    }
  }, [batch]);

  // Show loader while fetching
  if (loading) {
    return (
      <div className="bg-white min-h-40 flex justify-center items-center">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  // Show message if no students found
  if (!loading && students.length === 0) {
    return (
      <div className="bg-white min-h-40 flex justify-center items-center">
        <p className="text-gray-600">কোন শিক্ষার্থী নেই</p>
      </div>
    );
  }

  // Filter students with image, sort descending by mark, pick top 3
  const sorted = [...students]
    .filter(s => s.image)
    .sort((a, b) => b.mark - a.mark)
    .slice(0, 3);

  return (
    <div className="rounded-md border border-gray-300 p-3 bg-white mb-5">
      <h2 className="font-bold text-xl text-center">
        <span className="text-blue-500">সেরা</span> শিক্ষার্থী ( ব্যাচ - {batch})
      </h2>
      <div className="flex justify-center items-end gap-2">
        {sorted.map((student, index) => {
          const position = index === 0 ? '১ম' : index === 1 ? '২য়' : '৩য়';
          const bgColor = index === 0 ? 'bg-yellow-200' : index === 1 ? 'bg-gray-200' : 'bg-orange-200';
          const borderColor = index === 0 ? 'border-yellow-400' : index === 1 ? 'border-gray-400' : 'border-orange-400';
          const imgSize = index === 0 ? 'w-32 h-32 md:w-48 md:h-48 -mb-12 md:-mb-24' : 'w-24 h-24 md:w-36 md:h-36 -mb-8 md:-mb-16';
          const orderClass = index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3';

          return (
            <div key={student.id} className={`flex flex-col items-center ${orderClass}`}>
              <div className={`${bgColor} flex items-end justify-center rounded-t-lg relative`}>
                <img
                  src={student.image || fallbackImage}
                  alt={student.name}
                  className={`${imgSize} rounded-full border-4 ${borderColor}`}
                />
                <span className="absolute -top-4 text-white px-2 py-1 rounded-full text-sm md:text-xl bg-black/50">
                  {position}
                </span>
              </div>
              <div className={`mt-10 text-center ${index === 0 ? 'md:mt-24' : 'md:mt-16'}`}>
                <h3 className="mt-2 text-sm font-semibold md:text-xl">{student.name}</h3>
                <p className="text-sm text-gray-500 md:text-base">{student.instituteName}</p>
                <p className="text-sm md:text-base">প্রাপ্ত নম্বর: {student.mark}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
