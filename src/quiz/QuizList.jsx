import { useEffect, useState, useContext } from "react";
import { db } from "../firebase/firebase.init";
import { collection, query, where, getDocs } from "firebase/firestore";
import { AuthContext } from "../firebase/AuthProvider";
import { useNavigate } from "react-router";

export default function QuizList() {
  const { user } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.batch) return;

    const fetchQuizzes = async () => {
      try {
        const q = query(
          collection(db, "quizzes"),
          where("batch", "==", user.batch)
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setQuizzes(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [user?.batch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto my-5">
      <h2 className="text-2xl font-bold mb-3">আপনার কুইজ</h2>
      {quizzes.length === 0 && <p>কোনও কুইজ নেই।</p>}
      <div className="flex flex-col gap-2">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="border p-3 rounded-md cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/quiz/${quiz.id}`)}
          >
            <h3 className="font-semibold">{quiz.title}</h3>
            <p>ব্যাচ: {quiz.batch}</p>
            <p>প্রশ্ন সংখ্যা: {quiz.questions.length}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
