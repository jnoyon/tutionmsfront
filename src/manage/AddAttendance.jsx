import React, { useEffect, useState, useContext } from "react";
import { db } from "../firebase/firebase.init";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { AuthContext } from "../firebase/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddAttendance() {
  const { user } = useContext(AuthContext);
  const [batch, setBatch] = useState("০১");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ List of super admin emails
  const superAdmins = ["jihadur51@gmail.com"]; // add more if needed
  const isSuperAdmin = superAdmins.includes(user?.email);

  // Redirect / block non-super-admin
  if (!user) return <p className="text-center mt-10">লোড হচ্ছে...</p>;
  if (!isSuperAdmin)
    return (
      <p className="text-center mt-10 text-red-500">
        আপনার অনুমতি নেই। শুধুমাত্র Super Admin অ্যাক্সেস করতে পারবেন।
      </p>
    );

  // Fetch students by batch
  useEffect(() => {
    if (!batch) return;

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "students"),
          where("batch", "==", batch),
          where("isActive", "==", true)
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
          attendance: docSnap.data().attendance || {},
          present: true, // ✅ EVERY STUDENT DEFAULT PRESENT
        }));

        setStudents(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [batch]);

  const handleCheckboxChange = (id) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, present: !s.present } : s))
    );
  };

  const handleSubmit = async () => {
    if (!batch) return toast.error("Please select a batch");

    const today = new Date().toISOString().split("T")[0];
    setLoading(true);

    try {
      await Promise.all(
        students.map(async (student) => {
          const docRef = doc(db, "students", student.id);

          // update attendance
          await updateDoc(docRef, {
            [`attendance.${today}`]: { present: student.present },
          });

          // update mark (only add if present)
          const currentMark = Number(student.mark) || 0;
          const newMark = student.present ? currentMark + 1 : currentMark;

          await updateDoc(docRef, { mark: newMark });
        })
      );

      toast.success("Attendance updated successfully!");

      // Reset after submit (everyone present again)
      setStudents((prev) => prev.map((s) => ({ ...s, present: true })));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update attendance: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5 w-11/12 mx-auto">
      <ToastContainer autoClose={2000} />

      <div className="mb-3 flex items-center gap-2">
        <label>ব্যাচ:</label>
        <select
          className="select select-bordered w-full"
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
        >
          <option value="০১">ব্যাচ-০১</option>
          <option value="০২">ব্যাচ-০২</option>
          <option value="০৩">ব্যাচ-০৩</option>
          <option value="০৪">ব্যাচ-০৪</option>
          <option value="অর্থনীতি">অর্থনীতি</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center">Loading students...</p>
      ) : students.length === 0 ? (
        <p className="text-center">No students found in this batch.</p>
      ) : (
        <table className="border-collapse border border-gray-400 w-full bg-white">
          <thead>
            <tr>
              <th className="border border-gray-300 p-1.5">নাম</th>
              <th className="border border-gray-300 p-1.5">উপস্থিতি</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="border border-gray-300 p-1.5">{student.name}</td>
                <td className="border border-gray-300 p-1.5 text-center">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-success"
                    checked={student.present}
                    onChange={() => handleCheckboxChange(student.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        className="btn btn-neutral mt-4"
        onClick={handleSubmit}
        disabled={loading || students.length === 0 || !batch}
      >
        আপডেট করুন
      </button>
    </div>
  );
}
