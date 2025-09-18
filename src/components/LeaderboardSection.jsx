import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase.init';
import { collection, getDocs } from 'firebase/firestore';

export default function LeaderboardSection() {
  const [students, setStudents] = useState([]);

  // Fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'students'));
        const allStudents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudents(allStudents);
      } catch (err) {
        console.error('Failed to fetch students:', err);
      }
    };

    fetchStudents();
  }, []);

  if (students.length === 0) return <div>Loading...</div>;

  // Sort descending by mark
  const sorted = [...students].sort((a, b) => b.mark - a.mark).slice(0, 3); // Top 3

  return (
    <div className="border border-gray-300 rounded-md py-3 mb-3">
      <h2 className="font-bold text-2xl text-center">
        <span className="text-red-500">সে</span>রা শিক্ষার্থী
      </h2>
      <p className='text-center text-l mb-4 text-gray-600'>ইন্টেন্সিভ ব্যাচ</p>

      <div className="flex gap-3 justify-center items-end">
        {/* Second Place */}
        {sorted[1] && (
          <div className="flex flex-col items-center">
            <div className="bg-gray-200 w-20 h-20 flex items-end justify-center rounded-t-lg relative md:w-40 md:h-40">
              <img
                src={sorted[1].image}
                alt={sorted[1].name}
                className="w-20 h-20 rounded-full border-4 border-gray-400 -mb-10 md:w-40 md:h-40 md:-mb-20"
              />
              <span className="absolute -top-2 bg-gray-400 text-white px-2 py-1 rounded-full text-sm md:text-xl md:-top-4">
                ২য়
              </span>
            </div>
            <div className="mt-10 text-center md:mt-20">
              <h3 className="mt-2 text-sm font-semibold md:text-xl">{sorted[1].name}</h3>
              <p className="text-sm text-gray-500 md:text-base">{sorted[1].instituteName}</p>
              <p className="text-sm md:text-base">প্রাপ্ত নম্বর: {sorted[1].mark}</p>
            </div>
          </div>
        )}

        {/* First Place */}
        {sorted[0] && (
          <div className="flex flex-col items-center">
            <div className="bg-yellow-200 w-24 h-24 flex items-end justify-center rounded-t-lg relative md:w-64 md:h-64">
              <img
                src={sorted[0].image}
                alt={sorted[0].name}
                className="w-24 h-24 rounded-full border-4 border-yellow-400 -mb-12 md:w-64 md:h-64 md:-mb-28"
              />
              <span className="absolute -top-2 bg-yellow-400 text-white px-3 py-1 rounded-full text-sm md:text-xl md:-top-4">
                ১ম
              </span>
            </div>
            <div className="mt-10 text-center md:mt-28">
              <h3 className="mt-2 text-sm font-semibold md:text-xl">{sorted[0].name}</h3>
              <p className="text-sm text-gray-500 md:text-base">{sorted[0].instituteName}</p>
              <p className="text-sm md:text-base">প্রাপ্ত নম্বর: {sorted[0].mark}</p>
            </div>
          </div>
        )}

        {/* Third Place */}
        {sorted[2] && (
          <div className="flex flex-col items-center">
            <div className="bg-orange-200 w-20 h-20 flex items-end justify-center rounded-t-lg relative md:w-40 md:h-40">
              <img
                src={sorted[2].image}
                alt={sorted[2].name}
                className="w-20 h-20 rounded-full border-4 border-orange-400 -mb-10 md:w-40 md:h-40 md:-mb-20"
              />
              <span className="absolute -top-2 bg-orange-400 text-white px-2 py-1 rounded-full text-sm md:text-xl md:-top-4">
                ৩য়
              </span>
            </div>
            <div className="mt-10 text-center md:mt-20">
              <h3 className="mt-2 text-sm font-semibold md:text-xl">{sorted[2].name}</h3>
              <p className="text-sm text-gray-500 md:text-base">{sorted[2].instituteName}</p>
              <p className="text-sm md:text-base">প্রাপ্ত নম্বর: {sorted[2].mark}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
