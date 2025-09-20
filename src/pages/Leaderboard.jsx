import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase.init";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export default function Leaderboard() {
  const [batch, setBatch] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load students when batch changes
  useEffect(() => {
    if (!batch) return;

    setLoading(true);
    const q = query(collection(db, "students"), where("batch", "==", batch));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.mark || 0) - (a.mark || 0)); // sort descending
      setStudents(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [batch]);

  return (
    <div className="py-5 w-11/12 mx-auto">
      {/* Batch Selector */}
      <div className="mb-5">
        <label className="label">ব্যাচ নির্বাচন করুন:</label>
        <select
          className="select select-bordered ml-2"
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
        >
          <option value="">-- ব্যাচ নির্বাচন করুন --</option>
          <option value="ইন্টেন্সিভ">ইন্টেন্সিভ</option>
          <option value="ফোকাস">ফোকাস</option>
          <option value="অ‌ন্যান্য">অ‌ন্যান্য</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading leaderboard...</p>
      ) : students.length === 0 ? (
        <p className="text-gray-500">কোনও শিক্ষার্থী নেই এই ব্যাচে।</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {students.map((student) => (
            <div
              key={student.id}
              className="card bg-base-100 shadow-md p-4 flex flex-col items-center"
            >
              <img
                src={student.image || "/default-user.png"}
                alt={student.name}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
              <h2 className="text-xl font-bold mb-1">{student.name}</h2>
              <p className="text-gray-600 mb-1">Batch: {student.batch}</p>
              <p className="text-gray-600 mb-1">
                Institute: {student.instituteName || "---"}
              </p>
              <p className="text-blue-600 font-semibold text-lg">
                Marks: {student.mark || 0}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
