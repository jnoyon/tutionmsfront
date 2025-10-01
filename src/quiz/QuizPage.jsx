import React, { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase.init";
import { AuthContext } from "../firebase/AuthProvider";
import Swal from "sweetalert2";
import ExamAudioAlert from "./quizcomponent/ExamAudioAlert";

export default function QuizPage() {
  const { quizId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);
  const [duration, setDuration] = useState(null);
  const [alreadyTaken, setAlreadyTaken] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  // Fetch quiz data and shuffle
  useEffect(() => {
    const fetchQuiz = async () => {
      const quizRef = doc(db, "quizzes", quizId);
      const quizSnap = await getDoc(quizRef);

      if (quizSnap.exists()) {
        const data = quizSnap.data();

        // inactive
        if (!data.isActive) {
          setQuiz({ ...data, inactive: true });
          return;
        }

        // batch check
        if (data.batches && !data.batches.includes(user?.batch)) {
          setQuiz({ ...data, notForBatch: true });
          return;
        }

        // Shuffle questions & pick 10
        let questionsShuffled = [...data.questions].sort(() => 0.5 - Math.random());
        if (questionsShuffled.length > 10) questionsShuffled = questionsShuffled.slice(0, 10);

        // Shuffle options for each question
        questionsShuffled = questionsShuffled.map((q) => ({
          ...q,
          options: [...q.options].sort(() => 0.5 - Math.random()),
        }));

        setShuffledQuestions(questionsShuffled);
        setQuiz({ id: quizSnap.id, ...data, questions: questionsShuffled });

        if (data.duration) {
          setTimeLeft(data.duration * 60);
          setDuration(data.duration * 60);
        }
      }

      // Check if student already took this quiz
      if (user?.studentId) {
        const q = query(
          collection(db, "quizResults"),
          where("quizId", "==", quizId),
          where("studentId", "==", user.studentId)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          setAlreadyTaken(true);
          setSubmitted(true);
        }
      }
    };

    fetchQuiz();
  }, [quizId, user?.studentId, user?.batch]);

  // Timer countdown
  useEffect(() => {
    if (!timeLeft || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  // Prevent back navigation & warn
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!submitted && timeLeft > 0) {
        e.preventDefault();
        e.returnValue = "";
        Swal.fire({
          title: "আপনি কি কুইজ ছাড়তে চান?",
          text: "আপনি বের হলে নির্বাচিত উত্তরগুলোই জমা হবে!",
          icon: "warning",
          confirmButtonText: "ঠিক আছে",
        }).then(() => handleSubmit());
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = () => {
      if (!submitted && timeLeft > 0) {
        Swal.fire({
          title: "আপনি কি কুইজ ছাড়তে চান?",
          text: "আপনি বের হলে নির্বাচিত উত্তরগুলোই জমা হবে!",
          icon: "warning",
          confirmButtonText: "ঠিক আছে",
        }).then(() => handleSubmit());
        window.history.pushState(null, null, window.location.href);
      }
    };

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [submitted, timeLeft]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChange = (qIdx, option) => {
    if (answers[qIdx]) return; // ✅ cannot change
    setAnswers((prev) => ({ ...prev, [qIdx]: option }));
  };

  const handleSubmit = async () => {
    if (submitted || alreadyTaken) return;

    let marks = 0;
    shuffledQuestions.forEach((q, idx) => {
      if (answers[idx] === q.answer) marks++;
    });
    setScore(marks);
    setSubmitted(true);

    const timeTaken = duration ? duration - timeLeft : null;

    try {
      await addDoc(collection(db, "quizResults"), {
        quizId: quiz.id,
        quizTitle: quiz.title,
        batches: quiz.batches,
        studentId: user.studentId,
        studentBatch: user.batch,
        studentName: user.displayName || user.name || "অজ্ঞাত",
        score: marks,
        total: shuffledQuestions.length,
        timeTaken,
        submittedAt: serverTimestamp(),
      });

      const studentQuery = query(
        collection(db, "students"),
        where("studentId", "==", user.studentId)
      );
      const studentSnap = await getDocs(studentQuery);
      if (!studentSnap.empty) {
        const studentRef = doc(db, "students", studentSnap.docs[0].id);
        const prevMark = studentSnap.docs[0].data().mark || 0;
        await updateDoc(studentRef, { mark: prevMark + marks });
      }
    } catch (err) {
      console.error(err);
    }

    document.getElementById("result_modal").showModal();
  };

  if (!quiz) return <p>লোড হচ্ছে...</p>;
  if (quiz.inactive) return <p className="text-center mt-10">এই কুইজ বর্তমানে বন্ধ আছে।</p>;
  if (quiz.notForBatch) return <p className="text-center mt-10">এই কুইজ আপনার ব্যাচের জন্য নয়।</p>;
  if (alreadyTaken) return (
    <p className="text-center mt-10">
      আপনি ইতিমধ্যে কুইজ দিয়েছেন। <Link to="/result">ফলাফল দেখুন</Link>
    </p>
  );

  return (
    <div className="w-11/12 mx-auto my-5">
      {!submitted && timeLeft !== null && (
        <div className="font-bold mb-3 fixed bottom-5 right-5 bg-error text-white px-2 rounded-sm py-1">
          সময় বাকি: {formatTime(timeLeft)}
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">{quiz.title}</h2>

      {shuffledQuestions.map((q, idx) => (
        <div key={idx} className="border border-gray-300 bg-white p-2 rounded-md mb-3">
          <p className="font-semibold mb-2 border-b border-gray-300 pb-1">{`প্রশ্ন ${idx + 1}: ${q.question}`}</p>
          <div className="space-y-2">
            {q.options.map((opt, oidx) => (
              <label key={oidx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`q-${idx}`}
                  value={opt}
                  checked={answers[idx] === opt}
                  onChange={() => handleChange(idx, opt)}
                  disabled={!!answers[idx] || submitted}
                  className="radio radio-neutral"
                />
                {opt}
              </label>
            ))}
          </div>
          {submitted && answers[idx] !== q.answer && (
            <p className="text-sm bg-green-600 mt-3 rounded-sm px-3 py-1 text-white">
              <b>সঠিক উত্তর:</b> {q.answer}
            </p>
          )}
        </div>
      ))}

      {!submitted && (
        <button onClick={handleSubmit} className="btn btn-primary mt-4">
          জমা দিন
        </button>
      )}
<ExamAudioAlert timeLeft={timeLeft} duration={duration} />

      <dialog id="result_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">কুইজ ফলাফল</h3>
          <p><b>কুইজ:</b> {quiz.title}</p>
          <p><b>শিক্ষার্থীর নাম:</b> {user.displayName || user.name || "অজ্ঞাত"}</p>
          <p><b>মোট প্রশ্ন:</b> {shuffledQuestions.length}</p>
          <p><b>প্রাপ্ত নাম্বার:</b> {score}</p>
          <p><b>সময় লেগেছে:</b> {duration && duration - timeLeft > 0 ? formatTime(duration - timeLeft) : "—"}</p>
          <div className="modal-action">
            <form method="dialog">
              <Link to="/result" className="btn btn-primary">সকলের ফলাফল দেখুন</Link>
              <button className="btn btn-error ml-2">বন্ধ করুন</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
