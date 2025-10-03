import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase.init";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PublicQuizResult() {
  const [quizList, setQuizList] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch available quizzes
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const snapshot = await getDocs(collection(db, "publicQuizzes"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuizList(data);
      } catch (err) {
        console.error(err);
        toast.error("কুইজ লোড করতে সমস্যা হয়েছে");
      }
    };

    fetchQuizzes();
  }, []);

  // Fetch results for selected quiz
  const handleQuizChange = async (e) => {
    setSelectedQuiz(e.target.value);
    setResults([]);
    setError(null);

    if (!e.target.value) return;

    setLoading(true);
    try {
      const resultsCollection = collection(db, "publicQuizResults");
      const resultsQuery = query(
        resultsCollection,
        where("quizId", "==", e.target.value),
        orderBy("marks", "desc")
      );
      const snapshot = await getDocs(resultsQuery);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResults(data);
    } catch (err) {
      console.error(err);
      if (err.code === "failed-precondition") {
        setError(
          "Results require a Firestore index. Please create the index from Firebase Console."
        );
      } else {
        setError("রেজাল্ট লোড করতে সমস্যা হয়েছে");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <ToastContainer autoClose={2000} />
      <h2 className="text-2xl font-bold mb-4 text-center">পাবলিক কুইজ রেজাল্ট</h2>

      <div className="mb-6">
        <label className="font-semibold">কুইজ নির্বাচন করুন:</label>
        <select
          className="border p-2 rounded ml-2"
          value={selectedQuiz}
          onChange={handleQuizChange}
        >
          <option value="">-- কুইজ নির্বাচন করুন --</option>
          {quizList.map((quiz) => (
            <option key={quiz.id} value={quiz.id}>
              {quiz.quizName}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>লোড হচ্ছে...</p>}

      {error && (
        <div className="bg-red-100 p-3 rounded mb-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((res, index) => (
          <div key={res.id} className="p-4 border rounded shadow">
            <h3 className="font-bold text-lg">পজিশন: {index + 1}</h3>
            <p>নাম: {res.name}</p>
            <p>ঠিকানা: {res.address}</p>
            <p>বাবার নাম: {res.fathersName}</p>
            <p>মোবাইল নম্বর: ****{res.mobileNumber.slice(-4)}</p>
            <p>সময়: {res.timeTaken} মিনিট</p>
            <p>মার্ক: {res.marks}</p>
            {/* Admin delete button */}
            <button
              className="mt-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              onClick={() => {
                if (window.confirm("আপনি কি নিশ্চিতভাবে রেজাল্ট মুছতে চান?")) {
                  db.collection("publicQuizResults").doc(res.id).delete();
                  setResults(results.filter((r) => r.id !== res.id));
                  toast.success("রেজাল্ট মুছে ফেলা হয়েছে");
                }
              }}
            >
              মুছুন
            </button>
          </div>
        ))}
      </div>

      {!loading && !selectedQuiz && <p>কোনও কুইজ নির্বাচন করা হয়নি</p>}
      {!loading && selectedQuiz && results.length === 0 && !error && (
        <p>কোনও ফলাফল পাওয়া যায়নি</p>
      )}
    </div>
  );
}
