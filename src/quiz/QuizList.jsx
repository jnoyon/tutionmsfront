import { useEffect, useState, useContext } from "react";
import { db } from "../firebase/firebase.init";
import { collection, query, where, getDocs } from "firebase/firestore";
import { AuthContext } from "../firebase/AuthProvider";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { FaClock } from "react-icons/fa";

export default function QuizList() {
  const { user } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]);
  const [attendedExams, setAttendedExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.studentId || !user?.batch) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // 1️⃣ Fetch quizzes where batch includes user's batch
        const quizQuery = query(
          collection(db, "quizzes"),
          where("batches", "array-contains", user.batch)
        );
        const quizSnap = await getDocs(quizQuery);
        const quizList = quizSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setQuizzes(quizList);

        // 2️⃣ Fetch quiz results for this student
        const resultsQuery = query(
          collection(db, "quizResults"),
          where("studentId", "==", user.studentId)
        );
        const resultsSnap = await getDocs(resultsQuery);
        const attendedList = resultsSnap.docs.map((doc) => ({
          quizId: doc.data().quizId,
          score: doc.data().score,
          total: doc.data().total,
        }));
        setAttendedExams(attendedList);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.studentId, user?.batch]);

  const handleStartQuiz = (quiz) => {
    Swal.fire({
      title: "আপনি কি এখন পরীক্ষা দিতে চান?",
      text: "একবার পরীক্ষা দিলে আর দ্বিতীয়বার দিতে পারবেন না",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, পরীক্ষা শুরু করুন",
      cancelButtonText: "বাতিল করুন",
    }).then((result) => {
      if (result.isConfirmed) navigate(`/quiz/${quiz.id}`);
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  if (!quizzes.length) return <p className="text-gray-500 text-center">কোনও কুইজ নেই।</p>;

  return (
    <div className="w-11/12 mx-auto my-5">
      <h2 className="text-2xl font-bold mb-3">আপনার কুইজ</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quizzes.map((quiz) => {
          const attended = attendedExams.find((e) => e.quizId === quiz.id);

          return (
            <div
              key={quiz.id}
              className="relative border border-gray-300 bg-white px-4 py-4 rounded-md hover:bg-gray-100 transition"
            >
              <div className="flex justify-between items-center mb-2 border-b border-gray-300 pb-2">
                <div>
                  <h3 className="font-semibold text-lg">{quiz.title}</h3>
                  <p className="text-sm text-gray-600">
                    বিষয়: {quiz.subject || "—"} | অধ্যায়: {quiz.chapter || "—"}
                  </p>
                </div>
                {attended && (
                  <span className="bg-green-200 text-green-800 text-xs font-bold px-2 py-1 rounded-md">
                    Completed
                  </span>
                )}
              </div>

              <p className="text-sm mb-2">{quiz.syllabus || "কোন সিলেবাস নেই"}</p>

              <div className="flex justify-between text-sm text-gray-700 font-bold mb-2">
                <span>প্রশ্ন: {quiz.questions.length} টি</span>
                <span className="flex items-center">
                  <FaClock className="mr-1" /> {quiz.duration} মিনিট
                </span>
              </div>

              {attended && (
                <p className="text-sm text-gray-700 mb-2">
                  প্রাপ্ত নম্বর: {attended.score}/{attended.total}
                </p>
              )}

              <button
                className="btn btn-sm btn-primary text-white w-full"
                disabled={!quiz.isActive || attended}
                onClick={() => handleStartQuiz(quiz)}
              >
                পরীক্ষা দিন
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
