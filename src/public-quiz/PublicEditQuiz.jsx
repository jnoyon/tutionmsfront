import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { db } from "../firebase/firebase.init";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AuthContext } from "../firebase/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PublicEditQuiz() {
  const { user } = useContext(AuthContext);
  const adminEmails = ["jihadur51@gmail.com"];
  const isAdmin = adminEmails.includes(user?.email);

  const { quizId } = useParams(); // quiz ID from URL
  const navigate = useNavigate();

  const [quizName, setQuizName] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [status, setStatus] = useState("off");
  const [deadline, setDeadline] = useState("");
  const [quizTime, setQuizTime] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!quizId) return;
    const fetchQuiz = async () => {
      try {
        const quizDoc = await getDoc(doc(db, "publicQuizzes", quizId));
        if (quizDoc.exists()) {
          const data = quizDoc.data();
          setQuizName(data.quizName || "");
          setSyllabus(data.syllabus || "");
          setStatus(data.status || "off");
          setDeadline(new Date(data.deadline.seconds * 1000).toISOString().slice(0, 16));
          setQuizTime(data.quizTime || "");
        } else {
          toast.error("কুইজ পাওয়া যায়নি");
          navigate("/public-quiz-list");
        }
      } catch (err) {
        console.error(err);
        toast.error("কুইজ লোড করতে সমস্যা");
      }
    };
    fetchQuiz();
  }, [quizId, navigate]);

  const handleUpdateQuiz = async (e) => {
    e.preventDefault();

    if (!quizName || !syllabus || !deadline || !quizTime) {
      toast.error("সব ফিল্ড পূরণ করুন");
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, "publicQuizzes", quizId), {
        quizName,
        syllabus,
        status,
        deadline: new Date(deadline),
        quizTime,
      });
      toast.success("কুইজ আপডেট হয়েছে!");
      navigate("/public-quiz-list");
    } catch (err) {
      console.error(err);
      toast.error("আপডেট করতে সমস্যা: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="text-center mt-10">লোড হচ্ছে...</p>;
  if (!isAdmin) return <p className="text-center mt-10 text-red-500">আপনার অ্যাক্সেস নেই</p>;

  return (
    <div className="max-w-lg mx-auto my-5 p-5 border rounded shadow">
      <ToastContainer autoClose={2000} />
      <h2 className="text-2xl font-bold mb-4 text-center">কুইজ সম্পাদনা করুন</h2>

      <form onSubmit={handleUpdateQuiz} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">কুইজের নাম</label>
          <input
            type="text"
            value={quizName}
            onChange={(e) => setQuizName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">পাঠ্যসূচি</label>
          <textarea
            value={syllabus}
            onChange={(e) => setSyllabus(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">কুইজের অবস্থা</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="on">On</option>
            <option value="off">Off</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">ডেডলাইন</label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">কুইজ সময় (মিনিট)</label>
          <input
            type="number"
            value={quizTime}
            onChange={(e) => setQuizTime(e.target.value)}
            className="w-full border p-2 rounded"
            required
            min="1"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          {loading ? "লোড হচ্ছে..." : "কুইজ আপডেট করুন"}
        </button>
      </form>
    </div>
  );
}
