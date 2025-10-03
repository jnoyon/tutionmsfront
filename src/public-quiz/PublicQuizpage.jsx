import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { db } from "../firebase/firebase.init";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";

export default function PublicQuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [visitor, setVisitor] = useState({
    name: "",
    mobile: "",
    address: "",
    fatherName: ""
  });
  const [attempted, setAttempted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      const docRef = doc(db, "publicQuizzes", quizId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setQuiz({ id: docSnap.id, ...docSnap.data() });
      }
    };
    fetchQuiz();
  }, [quizId]);

  const checkAttempt = async () => {
    const q = query(
      collection(db, "publicQuizAttempts"),
      where("quizId", "==", quizId),
      where("mobile", "==", visitor.mobile)
    );
    const querySnap = await getDocs(q);
    setAttempted(!querySnap.empty);
  };

  const handleStartQuiz = async () => {
    if (!visitor.name || !visitor.mobile || !visitor.address || !visitor.fatherName) {
      toast.error("সব তথ্য পূরণ করুন");
      return;
    }
    await checkAttempt();
    if (!attempted) {
      setQuizStarted(true);
    } else {
      toast.error("আপনি ইতিমধ্যে এই কুইজ সম্পন্ন করেছেন");
    }
  };

  const handleAnswerChange = (idx, value) => {
    setAnswers({ ...answers, [idx]: value });
  };

  const handleSubmitQuiz = async () => {
    const attemptData = {
      quizId,
      visitor,
      answers,
      createdAt: serverTimestamp()
    };
    await addDoc(collection(db, "publicQuizAttempts"), attemptData);
    toast.success("কুইজ জমা হয়েছে");
    setQuizStarted(false);
    setAttempted(true);
  };

  if (!quiz) return <p className="text-center mt-10">লোড হচ্ছে...</p>;

  if (!quizStarted) {
    return (
      <div className="max-w-lg mx-auto p-5">
        <ToastContainer autoClose={2000} />
        <h2 className="text-2xl font-bold mb-4">{quiz.quizName}</h2>
        <p>{quiz.syllabus}</p>
        <div className="mt-5 space-y-3">
          <input
            type="text"
            placeholder="আপনার নাম"
            value={visitor.name}
            onChange={(e) => setVisitor({ ...visitor, name: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="মোবাইল"
            value={visitor.mobile}
            onChange={(e) => setVisitor({ ...visitor, mobile: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="ঠিকানা"
            value={visitor.address}
            onChange={(e) => setVisitor({ ...visitor, address: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="পিতার নাম"
            value={visitor.fatherName}
            onChange={(e) => setVisitor({ ...visitor, fatherName: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <button
            onClick={handleStartQuiz}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            কুইজ শুরু করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4">কুইজ: {quiz.quizName}</h2>
      {quiz.questions?.length > 0 && (
        <div>
          {quiz.questions.map((q, idx) => (
            <div key={idx} className="mb-4 border p-3 rounded">
              <p className="font-semibold">{idx + 1}. {q.question}</p>
              {q.options.map((opt, optIdx) => (
                <label key={optIdx} className="block">
                  <input
                    type="radio"
                    name={`question-${idx}`}
                    value={opt}
                    onChange={() => handleAnswerChange(idx, opt)}
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
          <button
            onClick={handleSubmitQuiz}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            কুইজ জমা দিন
          </button>
        </div>
      )}
    </div>
  );
}
