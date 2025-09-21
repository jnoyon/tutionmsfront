import { useEffect, useState, useContext } from "react";
import { db } from "../firebase/firebase.init";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { AuthContext } from "../firebase/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function QuizResult() {
  const { user } = useContext(AuthContext);
  const [batch, setBatch] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch quizzes for selected batch
  useEffect(() => {
    if (!batch) {
      setQuizzes([]);
      return;
    }
    const fetchQuizzes = async () => {
      const q = query(collection(db, "quizzes"), where("batch", "==", batch));
      const snap = await getDocs(q);
      setQuizzes(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchQuizzes();
  }, [batch]);

  // Fetch results for selected quiz
  useEffect(() => {
    if (!selectedQuiz) {
      setResults([]);
      return;
    }
    const fetchResults = async () => {
      setLoading(true);
      const q = query(
        collection(db, "quizResults"),
        where("quizId", "==", selectedQuiz)
      );
      const snap = await getDocs(q);
      setResults(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    };
    fetchResults();
  }, [selectedQuiz]);

  const deleteResult = async (id) => {
    try {
      await deleteDoc(doc(db, "quizResults", id));
      setResults((prev) => prev.filter((r) => r.id !== id));
      toast.success("রেজাল্ট ডিলিট হয়েছে");
    } catch (err) {
      console.error(err);
      toast.error("ডিলিট করতে সমস্যা: " + err.message);
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m} মিনিট ${s} সেকেন্ড`;
  };

  return (
    <div className="w-11/12 mx-auto my-5">
      <ToastContainer autoClose={2000} />

      {/* Batch Selector */}
      <div className="mb-4">
        <label className="label">ব্যাচ নির্বাচন করুন:</label>
        <select
          className="select select-bordered w-full"
          value={batch}
          onChange={(e) => {
            setBatch(e.target.value);
            setSelectedQuiz("");
            setResults([]);
          }}
        >
          <option value="">-- ব্যাচ নির্বাচন করুন --</option>
          <option value="ইন্টেন্সিভ">ইন্টেন্সিভ</option>
          <option value="ফোকাস">ফোকাস</option>
          <option value="কম্পিউটার">কম্পিউটার</option>
        </select>
      </div>

      {/* Quiz Selector */}
      {batch && (
        <div className="mb-4">
          <label className="label">কুইজ নির্বাচন করুন:</label>
          <select
            className="select select-bordered w-full"
            value={selectedQuiz}
            onChange={(e) => setSelectedQuiz(e.target.value)}
          >
            <option value="">-- কুইজ নির্বাচন করুন --</option>
            {quizzes.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Results Table */}
      {loading ? (
        <p className="text-gray-500">লোড হচ্ছে...</p>
      ) : results.length === 0 ? (
        <p className="text-gray-500">কোনও রেজাল্ট পাওয়া যায়নি।</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-400">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 p-2">নাম</th>
                <th className="border border-gray-300 p-2">প্রাপ্ত নাম্বার</th>
                <th className="border border-gray-300 p-2">সময় লেগেছে</th>
                {user?.isAdmin && (
                  <th className="border border-gray-300 p-2">অ্যাকশন</th>
                )}
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td className="border border-gray-300 p-2">
                    {r.userName || "অজানা"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {r.score}/{r.total}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {formatTime(r.timeTaken)}
                  </td>
                  {user?.isAdmin && (
                    <td className="border border-gray-300 p-2">
                      <button
                        onClick={() => deleteResult(r.id)}
                        className="btn btn-sm btn-error"
                      >
                        ডিলিট
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
