import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { collection, query, where, getDocs } from "firebase/firestore";
import { AuthContext } from "../../firebase/AuthProvider";
import { db } from "../../firebase/firebase.init";
import 'react-toastify/dist/ReactToastify.css';

export default function StudentLogin() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!studentId) {
      return toast.error("স্টুডেন্ট আইডি লিখুন");
    }

    try {
      const q = query(collection(db, "students"), where("studentId", "==", studentId));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return toast.error("স্টুডেন্ট আইডি পাওয়া যায়নি");
      }

      const student = snapshot.docs[0].data();

      // login success
      setUser({ id: snapshot.docs[0].id, ...student });

      // Save to localStorage for persistence
      localStorage.setItem("loggedInStudent", JSON.stringify({ id: snapshot.docs[0].id, ...student }));

      toast.success("লগিন সফল!");
      navigate("/report");
    } catch (err) {
      console.error(err);
      toast.error("লগিনে সমস্যা: " + err.message);
    }
  };

  return (
    <div>
      <ToastContainer autoClose={2000} />
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full mb-5 border p-4">
        <h2 className="text-center text-2xl font-bold mb-2">
          <span className="text-red-500">ল</span>গিন করুন
        </h2>
        <p>শুধুমাত্র স্টুডেন্ট আইডি দিয়ে লগিন করুন</p>

        <label className="label">স্টুডেন্ট আইডি</label>
        <input
          type="text"
          className="input w-full"
          placeholder="৬-সংখ্যার স্টুডেন্ট আইডি"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />

        <button className="btn btn-neutral mt-4" onClick={handleLogin}>
          লগিন করুন
        </button>
      </fieldset>
    </div>
  );
}
