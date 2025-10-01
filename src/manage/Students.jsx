import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase.init";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiDelete } from "react-icons/fi";

export default function Students() {
  const [batch, setBatch] = useState(""); // selected batch
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!batch) return;

    setLoading(true);
    const q = query(collection(db, "students"), where("batch", "==", batch));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [batch]);

  const handleStatusToggle = async (studentId, newStatus) => {
    try {
      const docRef = doc(db, "students", studentId);
      await updateDoc(docRef, { isActive: newStatus });
      toast.success("Status updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status: " + err.message);
    }
  };

  const handleDelete = async (studentId) => {
    if (!window.confirm("আপনি কি নিশ্চিতভাবে এই শিক্ষার্থীকে মুছতে চান?")) return;

    try {
      await deleteDoc(doc(db, "students", studentId));
      toast.success("Student deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete student: " + err.message);
    }
  };

  // Calculate total fee
  const totalFee = students.reduce((sum, s) => {
    const studentFee = s.fees?.reduce((a, f) => a + (f.amount || 0), 0) || 0;
    return sum + studentFee;
  }, 0);

  return (
    <div className="mx-auto w-11/12 py-5">
      <ToastContainer autoClose={2000} />

      {/* Batch Selector */}
      <div className="mb-4 flex gap-2 items-center">
        <label className="label">ব্যাচ নির্বাচন করুন:</label>
        <select
          className="select select-bordered w-full"
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
        >
          <option value="০১">ব্যাচ-০১</option>
          <option value="০২">ব্যাচ-০২</option>
          <option value="০৩">ব্যাচ-০৩</option>
          <option value="০৪">ব্যাচ-০৪</option>
          <option value="কম্পিউটার">কম্পিউটার</option>
        </select>
      </div>

      {/* Students Table */}
      {loading ? (
        <p className="text-gray-500">Loading students...</p>
      ) : students.length === 0 ? (
        <p className="text-gray-500">কোনও শিক্ষার্থী নেই এই ব্যাচে।</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-400 w-full text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-1">আইডি</th>
                <th className="border border-gray-300 p-1">নাম</th>
                <th className="border border-gray-300 p-1">মোবাইল</th>
                <th className="border border-gray-300 p-1">অ্যাক্টিভ</th>
                <th className="border border-gray-300 p-1">ফি</th>
                <th className="border border-gray-300 p-1 text-center">*</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const studentFee =
                  student.fees?.reduce((a, f) => a + (f.amount || 0), 0) || 0;
                return (
                  <tr key={student.id}>
                    <td className="border border-gray-300 p-2">{student.studentId}</td>
                    <td className="border border-gray-300 p-2">{student.name}</td>
                    <td className="border border-gray-300 p-2">{student.phone}</td>
                    <td className="border border-gray-300 p-2 text-center">
                      <input
                        type="checkbox"
                        className="toggle toggle-success"
                        checked={student.isActive}
                        onChange={(e) =>
                          handleStatusToggle(student.id, e.target.checked)
                        }
                      />
                    </td>
                    <td className="border border-gray-300 p-2">{studentFee}</td>
                    <td className="border border-gray-300 p-2 text-center">
                      <button
                        className="btn btn-sm btn-outline btn-error"
                        onClick={() => handleDelete(student.id)}
                      >
                        <FiDelete className="text-lg" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {/* Total Fee Row */}
              <tr className="font-bold bg-gray-100">
                <td colSpan={4} className="border border-gray-300 p-2 text-center">
                  মোট টাকা
                </td>
                <td className="border border-gray-300 p-2">{totalFee}</td>
                <td className="border border-gray-300 p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
