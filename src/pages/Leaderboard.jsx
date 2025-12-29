import React, { useEffect, useState, useContext } from "react";
import { db } from "../firebase/firebase.init";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { AuthContext } from "../firebase/AuthProvider";

export default function Leaderboard() {
  const { user } = useContext(AuthContext);
  const [batch, setBatch] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showFees, setShowFees] = useState(false);

  useEffect(() => {
    if (!batch) return;

    setLoading(true);
    const q = query(
      collection(db, "students"),
      where("batch", "==", batch),
      where("isActive", "==", true)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => (b.mark || 0) - (a.mark || 0));
      setStudents(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [batch]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "---";
    if (timestamp.seconds)
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-12 bg-gray-50 min-h-screen">
      {/* Batch Selector */}
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-3 bg-white p-3 border border-gray-300 rounded-lg shadow-sm">
        <label className="font-semibold text-gray-700">ব্যাচ :</label>
        <select
          className="select select-bordered w-full sm:w-64 border-red-600 focus:border-red-600 focus:ring-red-200"
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
        >
          <option value="">বাছাই করুন</option>
          <option value="০১">ব্যাচ-০১</option>
          <option value="০২">ব্যাচ-০২</option>
          <option value="০৩">ব্যাচ-০৩</option>
          <option value="০৪">ব্যাচ-০৪</option>
          <option value="অর্থনীতি">অর্থনীতি</option>
        </select>
      </div>

      {/* Students Grid */}
      {loading ? (
        <p className="text-center text-gray-500">লোড হচ্ছে...</p>
      ) : students.length === 0 ? (
        <p className="text-center text-gray-500">
          কোনও শিক্ষার্থী নেই এই ব্যাচে।
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {students.map((student) => (
            <div
              key={student.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-5 flex flex-col items-center text-center"
            >
              <img
                src={student.image || "/default-user.png"}
                alt={student.name}
                className="w-24 h-24 rounded-full border-2 border-red-500 mb-4 object-cover"
              />
              <h2 className="text-lg font-bold text-navy-900 mb-1">
                {student.name}
              </h2>
              <p className="text-gray-600 mb-1">{student.address}</p>
              <p className="text-gray-600 mb-2">{student.instituteName}</p>
              <p className="text-red-600 font-semibold">
                প্রাপ্ত নম্বর: {student.mark || 0}
              </p>
              {user?.email === "jihadur51@gmail.com" && (
                <button
                  onClick={() => {
                    setSelectedStudent(student);
                    setShowFees(false); // reset fees when opening
                  }}
                  className="mt-3 w-full btn btn-sm bg-red-500 hover:bg-red-600 text-white rounded-full shadow-sm transition-all"
                >
                  শিক্ষার্থী তথ্য
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-lg relative">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-4 right-4 text-red-500 text-xl font-bold"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-5 border-b border-gray-200 pb-4">
              <img
                src={selectedStudent.image || "/default-user.png"}
                alt={selectedStudent.name}
                className="w-28 h-28 rounded-full border-2 border-red-500 object-cover"
              />
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-navy-900">
                  {selectedStudent.name}
                </h2>
                <p className="text-gray-600">
                  পিতার নাম: {selectedStudent.fatherName}
                </p>
                <p className="text-gray-600">
                  ঠিকানা: {selectedStudent.address}
                </p>
                <p className="text-gray-600">
                  শিক্ষা প্রতিষ্ঠান: {selectedStudent.instituteName}
                </p>
                <p className="text-red-600 font-semibold mt-1">
                  মার্ক: {selectedStudent.mark || 0}
                </p>
              </div>
            </div>

            {/* Attendance */}
            <div className="mb-5">
              <h3 className="text-lg font-semibold mb-2 text-navy-900">
                উপস্থিতি
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selectedStudent.attendance ?? {}).length ===
                0 ? (
                  <p className="text-gray-500">কোনও উপস্থিতি তথ্য নেই</p>
                ) : (
                  Object.entries(selectedStudent.attendance ?? {}).map(
                    ([date, record], idx) => (
                      <div
                        key={date}
                        className={`w-8 h-8 flex items-center justify-center text-white font-bold rounded ${
                          record.present ? "bg-red-500" : "bg-gray-400"
                        }`}
                        title={date}
                      >
                        {idx + 1}
                      </div>
                    )
                  )
                )}
              </div>
            </div>

            {/* Fees */}
            <div className="mb-5">
              <button
                onClick={() => setShowFees((prev) => !prev)}
                className="btn btn-sm btn-outline text-red-500 border-red-500 mb-2 hover:bg-red-50 w-full"
              >
                {showFees ? "ফি তথ্য লুকান" : "ফি তথ্য দেখুন"}
              </button>

              {showFees &&
                ((selectedStudent.fees ?? []).length === 0 ? (
                  <p className="text-gray-500">কোনও ফি জমা হয়নি</p>
                ) : (
                  <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
                    <thead className="bg-red-100 text-red-700">
                      <tr>
                        <th className="border border-gray-300 p-1.5">টাকা</th>
                        <th className="border border-gray-300 p-1.5">বিবরণ</th>
                        <th className="border border-gray-300 p-1.5">তারিখ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedStudent.fees ?? []).map((f, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-red-50 transition-colors"
                        >
                          <td className="border border-gray-300 p-1.5">
                            {f.amount}
                          </td>
                          <td className="border border-gray-300 p-1.5">
                            {f.description}
                          </td>
                          <td className="border border-gray-300 p-1.5">
                            {formatDate(f.paidAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
