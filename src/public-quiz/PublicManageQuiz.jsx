import React, { useEffect, useState, useContext } from "react";
import { db } from "../firebase/firebase.init";
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router";
import { AuthContext } from "../firebase/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PublicManageQuiz() {
  const { user } = useContext(AuthContext);
  const adminEmails = ["jihadur51@gmail.com"];
  const isAdmin = adminEmails.includes(user?.email);

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizCollection = collection(db, "publicQuizzes");
        const quizQuery = query(quizCollection, orderBy("createdAt", "desc"));
        const quizSnapshot = await getDocs(quizQuery);
        const quizList = quizSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuizzes(quizList);
      } catch (err) {
        console.error(err);
        toast.error("কুইজ লোড করতে সমস্যা");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleEdit = (quizId) => {
    navigate(`/edit-public-quiz/${quizId}`);
  };

  const handleResetResults = async (quizId) => {
    const confirmReset = window.confirm("আপনি কি নিশ্চিতভাবে এই কুইজের সকল ফলাফল রিসেট করতে চান?");
    if (!confirmReset) return;

    setLoading(true);
    try {
      const resultsCollection = collection(db, "publicQuizResults");
      const resultsSnapshot = await getDocs(resultsCollection);

      const batchDeletes = resultsSnapshot.docs
        .filter(doc => doc.data().quizId === quizId)
        .map(docItem => deleteDoc(doc(db, "publicQuizResults", docItem.id)));

      await Promise.all(batchDeletes);

      toast.success("ফলাফল সফলভাবে রিসেট হয়েছে!");
    } catch (err) {
      console.error(err);
      toast.error("রিসেট করতে সমস্যা: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="text-center mt-10">লোড হচ্ছে...</p>;
  if (!isAdmin) return <p className="text-center mt-10 text-red-500">আপনার অ্যাক্সেস নেই</p>;

  return (
    <div className="max-w-4xl mx-auto my-5 p-5 border rounded shadow">
      <ToastContainer autoClose={2000} />
      <h2 className="text-2xl font-bold mb-4 text-center">পাবলিক কুইজ ম্যানেজমেন্ট</h2>

      {loading ? (
        <p className="text-center">লোড হচ্ছে...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">কুইজের নাম</th>
              <th className="border p-2">পাঠ্যসূচি</th>
              <th className="border p-2">অবস্থা</th>
              <th className="border p-2">ডেডলাইন</th>
              <th className="border p-2">সময়</th>
              <th className="border p-2">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map(quiz => (
              <tr key={quiz.id} className="text-center">
                <td className="border p-2">{quiz.quizName}</td>
                <td className="border p-2">{quiz.syllabus}</td>
                <td className="border p-2">{quiz.status}</td>
                <td className="border p-2">{new Date(quiz.deadline?.seconds * 1000).toLocaleString()}</td>
                <td className="border p-2">{quiz.quizTime} মিনিট</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(quiz.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    এডিট
                  </button>
                  <button
                    onClick={() => handleResetResults(quiz.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    রিসেট ফলাফল
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
