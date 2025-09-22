import { useEffect, useState } from "react";
import { db } from "../firebase/firebase.init";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router";

export default function ManageQuiz() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const snapshot = await getDocs(collection(db, "quizzes"));
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setQuizzes(data);
    };
    fetchQuizzes();
  }, []);

  const toggleActive = async (quiz) => {
    const ref = doc(db, "quizzes", quiz.id);
    await updateDoc(ref, { isActive: !quiz.isActive });
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === quiz.id ? { ...q, isActive: !q.isActive } : q
      )
    );
  };

  const deleteQuiz = async (quiz) => {
    if (!window.confirm("আপনি কি নিশ্চিতভাবে এই কুইজ মুছে ফেলতে চান?"))
      return;
    await deleteDoc(doc(db, "quizzes", quiz.id));
    setQuizzes((prev) => prev.filter((q) => q.id !== quiz.id));
  };

  const deleteResults = async (quiz) => {
    if (
      !window.confirm(
        "আপনি কি নিশ্চিতভাবে এই কুইজের সকল রেজাল্ট মুছে ফেলতে চান?"
      )
    )
      return;
    const resultsRef = collection(db, "quizResults"); // ✅ fixed
    const q = query(resultsRef, where("quizId", "==", quiz.id));
    const snapshot = await getDocs(q);
    for (const docSnap of snapshot.docs) {
      await deleteDoc(doc(db, "quizResults", docSnap.id));
    }
    alert("সকল রেজাল্ট মুছে ফেলা হয়েছে।");
  };

  return (
    <div className="w-11/12 mx-auto my-5">
      <h2 className="text-2xl font-bold mb-4">কুইজ ম্যানেজ করুন</h2>
      <table className="table-auto border-collapse border border-gray-400 w-full text-sm md:text-base">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">কুইজ শিরোনাম</th>
            <th className="border border-gray-300 p-2">ব্যাচ</th>
            <th className="border border-gray-300 p-2">Active</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz) => (
            <tr key={quiz.id}>
              <td className="border border-gray-300 p-2">{quiz.title}</td>
              <td className="border border-gray-300 p-2">
                {quiz.batches?.join(", ") || "—"}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <input
                  type="checkbox"
                  checked={quiz.isActive || false}
                  onChange={() => toggleActive(quiz)}
                  className="toggle toggle-success"
                />
              </td>
              <td className="border border-gray-300 p-2 flex gap-2">
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => navigate(`/edit-quiz/${quiz.id}`)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => deleteQuiz(quiz)}
                >
                  Delete Quiz
                </button>
                <button
                  className="btn btn-sm btn-info"
                  onClick={() => deleteResults(quiz)}
                >
                  Delete Results
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
