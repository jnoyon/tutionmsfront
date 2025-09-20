import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase.init";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TbDisabled } from "react-icons/tb";
import { MdOutlinePersonAddDisabled } from "react-icons/md";
import { IoCheckmarkDoneCircle } from "react-icons/io5";

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

  const handleStatusToggle = async (studentId, currentStatus) => {
    try {
      const docRef = doc(db, "students", studentId);
      await updateDoc(docRef, { isActive: !currentStatus });
      toast.success("Status updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status: " + err.message);
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
          <option value="">-- ব্যাচ নির্বাচন করুন --</option>
          <option value="ইন্টেন্সিভ">ইন্টেন্সিভ</option>
          <option value="ফোকাস">ফোকাস</option>
          <option value="অন্যান্য">অন্যান্য</option>
        </select>
      </div>

      {/* Students Table */}
      {loading ? (
        <p className="text-gray-500">Loading students...</p>
      ) : students.length === 0 ? (
        <p className="text-gray-500">কোনও শিক্ষার্থী নেই এই ব্যাচে।</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-400 w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-1">আইডি</th>
                <th className="border border-gray-300 p-1">নাম</th>
                <th className="border border-gray-300 p-1">মোবাইল</th>
                <th className="border border-gray-300 p-1">স্ট্যাটাস</th>
                <th className="border border-gray-300 p-1">ফি</th>
                <th className="border border-gray-300 p-">* </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const studentFee = student.fees?.reduce((a, f) => a + (f.amount || 0), 0) || 0;
                return (
                  <tr key={student.id}>
                    <td className="border border-gray-300 p-2">{student.studentId}</td>
                    <td className="border border-gray-300 p-2">{student.name}</td>
                    <td className="border border-gray-300 p-2">{student.phone}</td>
                    <td className="border border-gray-300 p-2 text-center">
                      {student.isActive ? <IoCheckmarkDoneCircle className="text-success text-xl mx-auto"></IoCheckmarkDoneCircle> : <MdOutlinePersonAddDisabled className="text-error text-xl mx-auto"></MdOutlinePersonAddDisabled>}
                    </td>
                    <td className="border border-gray-300 p-2">{studentFee}</td>
                    <td className="border border-gray-300 p-2">
                      <button
                        className={`btn btn-sm ${student.isActive ? "btn-error" : "btn-success"}`}
                        onClick={() => handleStatusToggle(student.id, student.isActive)}
                      >
                        {student.isActive ? <MdOutlinePersonAddDisabled></MdOutlinePersonAddDisabled> :  <IoCheckmarkDoneCircle></IoCheckmarkDoneCircle>}
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
