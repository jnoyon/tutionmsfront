import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase.init';
import { collection, getDocs } from 'firebase/firestore';

export default function LeaderboardSection() {
  const [students, setStudents] = useState([]);
  const fallbackImage = "/default-avatar.png"; // provide a default image in public folder

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

  if (students.length === 0) return (
    <div className="bg-white min-h-screen flex justify-center items-center">
      <span className="loading loading-bars loading-xl"></span>
    </div>
  );

  // Filter students with image, sort descending by mark, pick top 3
  const sorted = [...students]
    .filter(s => s.image) // only students with image
    .sort((a, b) => b.mark - a.mark)
    .slice(0, 3);

  return (
    <div className="border border-gray-300 rounded-md py-3 mb-3 bg-white">
      <h2 className="font-bold text-2xl text-center">
        <span className="text-red-500">সে</span>রা শিক্ষার্থী
      </h2>
      <p className='text-center text-l mb-4 text-gray-600'></p>

      <div className="flex justify-center items-end gap-2">
  {sorted.map((student, index) => {
    // Determine position label
    const position = index === 0 ? '১ম' : index === 1 ? '২য়' : '৩য়';
    
    // Background & border colors
    const bgColor = index === 0 ? 'bg-yellow-200' : index === 1 ? 'bg-gray-200' : 'bg-orange-200';
    const borderColor = index === 0 ? 'border-yellow-400' : index === 1 ? 'border-gray-400' : 'border-orange-400';
    
    // Image size: make 1st place bigger
    const imgSize = index === 0 ? 'w-32 h-32 md:w-48 md:h-48 -mb-12 md:-mb-24' : 'w-24 h-24 md:w-36 md:h-36 -mb-8 md:-mb-16';
    
    // Order to center 1st place
    const orderClass = index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3';

    return (
      <div key={student.id} className={`flex flex-col items-center ${orderClass}`}>
        <div className={`${bgColor} flex items-end justify-center rounded-t-lg relative`}>
          <img
            src={student.image || fallbackImage}
            alt={student.name}
            className={`${imgSize} rounded-full border-4 ${borderColor}`}
          />
          <span className="absolute -top-4 text-white px-2 py-1 rounded-full text-sm md:text-xl md:-top-4 bg-black/50">
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
