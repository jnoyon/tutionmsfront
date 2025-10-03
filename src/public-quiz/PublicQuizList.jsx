import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase.init";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { Link } from "react-router";

export default function PublicQuizList() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const q = query(
        collection(db, "publicQuizzes"),
        where("status", "==", "on"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const quizData = [];
      querySnapshot.forEach((doc) => {
        quizData.push({ id: doc.id, ...doc.data() });
      });
      setQuizzes(quizData);
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h2 className="text-3xl font-bold text-center mb-5">প্রকাশিত কুইজসমূহ</h2>
      {quizzes.length === 0 && <p className="text-center">কোনো কুইজ নেই</p>}
      <div className="space-y-4">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="border p-4 rounded shadow hover:bg-gray-50"
          >
            <h3 className="text-xl font-semibold">{quiz.quizName}</h3>
            <p>{quiz.syllabus}</p>
            <p>
              ডেডলাইন: {quiz.deadline?.toDate().toLocaleString() || "N/A"}
            </p>
            <Link
              to={`/public-quiz/${quiz.id}`}
              className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              শুরু করুন
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
