import React, { useEffect, useState, useContext } from "react";
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
import { AuthContext } from "../firebase/AuthProvider";

export default function Students() {
  const { user } = useContext(AuthContext);
  const [batch, setBatch] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔒 SUPERADMIN CHECK
  const superAdminEmail = "jihadur51@gmail.com";

  if (!user || user.email !== superAdminEmail) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600 text-xl font-bold">
        এই পেজটি শুধু সুপার অ্যাডমিন দেখতে পারবেন
      </div>
    );
  }
  // 🔒 END CHECK

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
    if (!window.confirm("আপনি কি নিশ্চিতভাবে এই শিক্ষার্থীকে মুছতে চান?"))
      return;

    try {
      await deleteDoc(doc(db, "students", studentId));
      toast.success("Student deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete student: " + err.message);
    }
  };

  const handleReset = async (studentId) => {
    if (
      !window.confirm(
        "আপনি কি নিশ্চিতভাবে এই শিক্ষার্থীর উপস্থিতি এবং মার্ক রিসেট করতে চান?"
      )
    )
      return;

    try {
      const docRef = doc(db, "students", studentId);
      await updateDoc(docRef, {
        attendance: {},
        mark: 0,
      });

      toast.success("Attendance এবং Mark রিসেট হয়েছে!");

      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId ? { ...s, attendance: {}, mark: 0 } : s
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("রিসেট করতে সমস্যা: " + err.message);
    }
  };

  const handleResetAll = async () => {
    if (!batch) return toast.error("প্রথমে ব্যাচ নির্বাচন করুন");
    if (
      !window.confirm(
        `আপনি কি নিশ্চিতভাবে ব্যাচ ${batch} এর সকল শিক্ষার্থীর উপস্থিতি এবং মার্ক রিসেট করতে চান?`
      )
    )
      return;

    try {
      await Promise.all(
        students.map(async (student) => {
          const docRef = doc(db, "students", student.id);
          await updateDoc(docRef, { attendance: {}, mark: 0 });
        })
      );

      toast.success(
        `ব্যাচ ${batch} এর সকল শিক্ষার্থীর Attendance এবং Mark রিসেট হয়েছে!`
      );

      setStudents((prev) =>
        prev.map((s) => ({ ...s, attendance: {}, mark: 0 }))
      );
    } catch (err) {
      console.error(err);
      toast.error("Reset all করতে সমস্যা: " + err.message);
    }
  };

  const totalFee = students.reduce((sum, s) => {
    const studentFee = s.fees?.reduce((a, f) => a + (f.amount || 0), 0) || 0;
    return sum + studentFee;
  }, 0);

  return (
    <div className="mx-auto w-11/12 py-5">
      <ToastContainer autoClose={2000} />

      <div className="mb-4 flex gap-2 items-center">
        <label className="label">ব্যাচ নির্বাচন করুন:</label>
        <select
          className="select select-bordered w-full"
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
        >
          <option value="">-- ব্যাচ নির্বাচন করুন --</option>
          <option value="০১">ব্যাচ-০১</option>
          <option value="০২">ব্যাচ-০২</option>
          <option value="০৩">ব্যাচ-০৩</option>
          <option value="০৪">ব্যাচ-০৪</option>
          <option value="অর্থনীতি">অর্থনীতি</option>
        </select>

        {batch && (
          <button
            className="btn btn-sm btn-warning ml-2"
            onClick={handleResetAll}
          >
            Reset All
          </button>
        )}
      </div>

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
                <th className="border border-gray-300 p-1 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {students.map((student) => {
                const studentFee =
                  student.fees?.reduce((a, f) => a + (f.amount || 0), 0) || 0;

                return (
                  <tr key={student.id}>
                    <td className="border border-gray-300 p-2">
                      {student.studentId}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {student.name}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {student.phone}
                    </td>
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
                    <td className="border border-gray-300 p-2 text-center flex justify-center gap-2">
                      <button
                        className="btn btn-sm btn-outline btn-error"
                        onClick={() => handleDelete(student.id)}
                      >
                        <FiDelete className="text-lg" />
                      </button>

                      <button
                        className="btn btn-sm btn-outline btn-warning"
                        onClick={() => handleReset(student.id)}
                      >
                        Reset
                      </button>
                    </td>
                  </tr>
                );
              })}

              <tr className="font-bold bg-gray-100">
                <td
                  colSpan={4}
                  className="border border-gray-300 p-2 text-center"
                >
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
