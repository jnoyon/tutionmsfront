import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase.init";
import { AuthContext } from "../firebase/AuthProvider";

export default function QuizPage() {
  const { quizId } = useParams();
  const { user } = useContext(AuthContext);

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [duration, setDuration] = useState(null);
  const [alreadyTaken, setAlreadyTaken] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      const ref = doc(db, "quizzes", quizId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        // Randomize options for each question
        const questions = data.questions.map((q) => ({
          ...q,
          options: [...q.options].sort(() => Math.random() - 0.5),
        }));
        setQuiz({ id: snap.id, ...data, questions });
        if (data.duration) {
          setTimeLeft(data.duration * 60);
          setDuration(data.duration * 60);
        }

        // Check if student already took this quiz
        if (user?.studentId) {
          const resQ = query(
            collection(db, "quizResults"),
            where("quizId", "==", snap.id),
            where("userId", "==", user.studentId)
          );
          const resSnap = await getDocs(resQ);
          if (!resSnap.empty) setAlreadyTaken(true);
        }
      }
    };
    fetchQuiz();
  }, [quizId, user?.studentId]);

  // Timer
  useEffect(() => {
    if (!timeLeft || submitted || alreadyTaken) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted, alreadyTaken]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChange = (qIdx, option) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: option }));
  };

  const handleSubmit = async () => {
    if (submitted || alreadyTaken) return;

    let marks = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) marks++;
    });
    setScore(marks);
    setSubmitted(true);

    const timeTaken = duration ? duration - timeLeft : null;

    try {
      // Save result in quizResults collection
      await addDoc(collection(db, "quizResults"), {
        quizId: quiz.id,
        quizTitle: quiz.title,
        batch: quiz.batch,
        userId: user?.studentId || "guest",
        userName: user?.displayName || user?.name || "অজ্ঞাত",
        score: marks,
        total: quiz.questions.length,
        timeTaken,
        submittedAt: serverTimestamp(),
      });

      // Update student's profile (quizMarks)
      if (user?.studentId) {
        const studentQ = query(
          collection(db, "students"),
          where("studentId", "==", user.studentId)
        );
        const studentSnap = await getDocs(studentQ);
        if (!studentSnap.empty) {
          const studentRef = studentSnap.docs[0].ref;
          await updateDoc(studentRef, {
            [`quizMarks.${quiz.id}`]: marks,
          });
        }
      }
    } catch (err) {
      console.error("Error saving result:", err);
    }

    // Show modal
    document.getElementById("result_modal").showModal();
  };

  if (!quiz) return <p>লোড হচ্ছে...</p>;
  if (alreadyTaken)
    return <p className="text-center text-red-600 font-bold mt-10">আপনি এই কুইজটি ইতিমধ্যেই দিয়েছেন।</p>;

  return (
    <div className="w-11/12 mx-auto my-5">
      {!submitted && timeLeft !== null && (
        <div className="text-right text-lg font-bold text-red-600 mb-3">
          সময় বাকি: {formatTime(timeLeft)}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>

      {quiz.questions.map((q, idx) => (
        <div key={idx} className="border p-3 rounded-md mb-3">
          <p className="font-semibold mb-2">{`প্রশ্ন ${idx + 1}: ${q.question}`}</p>
          <div className="space-y-2">
            {q.options.map((opt, oidx) => (
              <label key={oidx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`q-${idx}`}
                  value={opt}
                  checked={answers[idx] === opt}
                  onChange={() => handleChange(idx, opt)}
                  disabled={submitted}
                />
                {opt}
              </label>
            ))}
          </div>
          {submitted && answers[idx] !== q.answer && (
            <p className="text-sm text-green-600 mt-1">
              ✅ সঠিক উত্তর: {q.answer}
            </p>
          )}
        </div>
      ))}

      {!submitted && (
        <button onClick={handleSubmit} className="btn btn-primary mt-4">
          কুইজ সাবমিট করুন
        </button>
      )}

      {/* Result Modal */}
      <dialog id="result_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">কুইজ ফলাফল</h3>
          <p className="py-2"><b>কুইজ:</b> {quiz.title}</p>
          <p className="py-2"><b>শিক্ষার্থীর নাম:</b> {user?.displayName || user?.name || "অজ্ঞাত"}</p>
          <p className="py-2"><b>মোট প্রশ্ন:</b> {quiz.questions.length}</p>
          <p className="py-2"><b>প্রাপ্ত নাম্বার:</b> {score}</p>
          <p className="py-2"><b>সময় লেগেছে:</b> {duration && formatTime(duration - timeLeft)}</p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">বন্ধ করুন</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
