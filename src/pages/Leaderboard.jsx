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
    const q = query(collection(db, "students"), where("batch", "==", batch), where("isActive", "==", true) );
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
    <div className="py-5 w-11/12 mx-auto">
      {/* Batch Selector */}
      <div className="mb-5 flex items-center bg-white p-2 border border-gray-300 rounded-md">
        <label className="label">ব্যাচ :</label>
        <select
          className="select select-bordered ml-2 w-full"
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
        >
          <option value="">  বাছাই করুন </option>
          <option value="০১">ব্যাচ-০১</option>
          <option value="০২">ব্যাচ-০২</option>
           <option value="০৩">ব্যাচ-০৩</option>
            <option value="০৪">ব্যাচ-০৪</option>
          <option value="কম্পিউটার">কম্পিউটার</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">লোড হচ্ছে...</p>
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
              <p className="text-gray-600 mb-1">{student.address}</p>
              <p className="text-gray-600 mb-1">{student.instituteName}</p>
              <p className="text-blue-600">প্রাপ্ত নম্বর: {student.mark || 0}</p>

              {user?.email && (
                <button
                  onClick={() => {
                    setSelectedStudent(student);
                    setShowFees(false); // reset fees when opening
                  }}
                  className="btn btn-sm btn-primary mt-2"
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-5 w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-300 pb-2 mb-3">
              <h2 className="text-lg font-bold">{selectedStudent.name} এর তথ্য</h2>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-red-500 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Basic Info */}
            <div className="mb-4">
              <p><b>পিতার নাম:</b> {selectedStudent.fatherName}</p>
              <p><b>ঠিকানা:</b> {selectedStudent.address}</p>
              <p><b>শিক্ষা প্রতিষ্ঠান:</b> {selectedStudent.instituteName}</p>
            </div>

            {/* Attendance */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">উপস্থিতি</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selectedStudent.attendance ?? {}).length === 0 ? (
                  <p className="text-gray-500">কোনও উপস্থিতি তথ্য নেই</p>
                ) : (
                  Object.entries(selectedStudent.attendance ?? {}).map(([date, record], idx) => (
                    <div
                      key={date}
                      className={`w-8 h-8 flex items-center justify-center text-white font-bold rounded ${
                        record.present ? "bg-green-600" : "bg-red-600"
                      }`}
                      title={date}
                    >
                      {idx + 1}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Fees (toggle with button) */}
            <div className="mb-4">
              <button
                onClick={() => setShowFees((prev) => !prev)}
                className="btn btn-sm btn-outline mb-2"
              >
                {showFees ? "ফি তথ্য লুকান" : "ফি তথ্য দেখুন"}
              </button>

              {showFees &&
                ((selectedStudent.fees ?? []).length === 0 ? (
                  <p className="text-gray-500">কোনও ফি জমা হয়নি</p>
                ) : (
                  <table className="table-auto border-collapse border border-gray-400 w-full text-sm">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 p-1.5">টাকা</th>
                        <th className="border border-gray-300 p-1.5">বিবরণ</th>
                        <th className="border border-gray-300 p-1.5">তারিখ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedStudent.fees ?? []).map((f, idx) => (
                        <tr key={idx}>
                          <td className="border border-gray-300 p-1.5">{f.amount}</td>
                          <td className="border border-gray-300 p-1.5">{f.description}</td>
                          <td className="border border-gray-300 p-1.5">{formatDate(f.paidAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ))}
            </div>

            {/* Assignments */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">অ্যাসাইনমেন্ট</h3>
              {(selectedStudent.assignments ?? []).length === 0 ? (
                <p className="text-gray-500">কোনও অ্যাসাইনমেন্ট নেই</p>
              ) : (
                <table className="table-auto border-collapse border border-gray-400 w-full text-sm">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-1.5">শিরোনাম</th>
                      <th className="border border-gray-300 p-1.5">তারিখ</th>
                      <th className="border border-gray-300 p-1.5">অবস্থা</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedStudent.assignments ?? []).map((a, idx) => (
                      <tr key={idx}>
                        <td className="border border-gray-300 p-1.5">{a.title}</td>
                        <td className="border border-gray-300 p-1.5">{formatDate(a.date)}</td>
                        <td className="border border-gray-300 p-1.5">{a.status || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
