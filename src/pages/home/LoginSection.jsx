import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { collection, query, where, getDocs } from "firebase/firestore";
import { AuthContext } from "../../firebase/AuthProvider";
import { db } from "../../firebase/firebase.init";
import "react-toastify/dist/ReactToastify.css";

export default function StudentLogin() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [canProceed, setCanProceed] = useState(false);

  // Automatically navigate once isActive becomes true
  useEffect(() => {
    if (user?.isActive) {
      setCanProceed(true);
      navigate("/report");
    } else if (user && !user.isActive) {
      toast.info("অ্যাডমিন এখনও আপনার অ্যাকাউন্ট সক্রিয় করেননি");
      setCanProceed(false);
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!studentId) return toast.error("স্টুডেন্ট আইডি লিখুন");

    try {
      setLoading(true);
      const q = query(
        collection(db, "students"),
        where("studentId", "==", studentId)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setLoading(false);
        return toast.error("স্টুডেন্ট আইডি পাওয়া যায়নি");
      }

      const student = snapshot.docs[0].data();
      const studentData = { id: snapshot.docs[0].id, ...student };

      // Set student in context
      setUser(studentData);

      // Save to localStorage
      localStorage.setItem("loggedInStudent", JSON.stringify(studentData));

      if (studentData.isActive) {
        toast.success("লগিন সফল!");
        navigate("/");
      } else {
        toast.info("অ্যাডমিন এখনও আপনার অ্যাকাউন্ট সক্রিয় করেননি");
      }
    } catch (err) {
      console.error(err);
      toast.error("লগিনে সমস্যা: " + err.message);
    } finally {
      setLoading(false);
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

        <button
          className="btn btn-neutral mt-4"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "লগইন হচ্ছে..." : "লগিন করুন"}
        </button>

        {!canProceed && user && !user.isActive && (
          <p className="mt-3 text-red-600 font-medium">
            ⚠️ অ্যাডমিন এখনও আপনার অ্যাকাউন্ট সক্রিয় করেননি
          </p>
        )}
      </fieldset>
    </div>
  );
}
