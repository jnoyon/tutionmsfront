import React, { useState, useContext } from "react";
import { db } from "../firebase/firebase.init";
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../firebase/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PublicCreateQuiz() {
  const { user } = useContext(AuthContext);
  const adminEmails = ["jihadur51@gmail.com"]; // Admins
  const isAdmin = adminEmails.includes(user?.email);

  const [quizName, setQuizName] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [status, setStatus] = useState("off");
  const [deadline, setDeadline] = useState("");
  const [quizTime, setQuizTime] = useState("");

  const [loading, setLoading] = useState(false);

  const [quizId, setQuizId] = useState(null); // store created quiz ID
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], correct: "" }]);

  const handleCreateQuiz = async (e) => {
    e.preventDefault();

    if (!quizName || !syllabus || !deadline || !quizTime) {
      toast.error("সব ফিল্ড পূরণ করুন");
      return;
    }

    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "publicQuizzes"), {
        quizName,
        syllabus,
        status,
        deadline: new Date(deadline),
        quizTime,
        createdAt: serverTimestamp(),
      });

      setQuizId(docRef.id);
      toast.success("কুইজ তৈরি হয়েছে! এখন প্রশ্ন যোগ করুন");
    } catch (err) {
      console.error(err);
      toast.error("কুইজ তৈরি করতে সমস্যা: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionChange = (idx, field, value) => {
    const newQuestions = [...questions];
    if (field === "question" || field === "correct") {
      newQuestions[idx][field] = value;
    } else {
      newQuestions[idx].options[field] = value;
    }
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correct: "" }]);
  };

  const saveQuestions = async () => {
    if (!quizId) {
      toast.error("প্রথমে কুইজ তৈরি করুন");
      return;
    }

    try {
      const quizDocRef = doc(db, "publicQuizzes", quizId);
      await setDoc(
        quizDocRef,
        { questions },
        { merge: true } // append questions to quiz
      );
      toast.success("প্রশ্ন যোগ করা হয়েছে!");
      setQuizName("");
      setSyllabus("");
      setStatus("off");
      setDeadline("");
      setQuizTime("");
      setQuestions([{ question: "", options: ["", "", "", ""], correct: "" }]);
      setQuizId(null);
    } catch (err) {
      console.error(err);
      toast.error("প্রশ্ন যোগ করতে সমস্যা: " + err.message);
    }
  };

  if (!user) return <p className="text-center mt-10">লোড হচ্ছে...</p>;
  if (!isAdmin) return <p className="text-center mt-10 text-red-500">আপনার অ্যাক্সেস নেই</p>;

  return (
    <div className="max-w-lg mx-auto my-5 p-5 border rounded shadow">
      <ToastContainer autoClose={2000} />
      <h2 className="text-2xl font-bold mb-4 text-center">নতুন পাবলিক কুইজ তৈরি করুন</h2>

      {/* Step 1: Create Quiz Metadata */}
      {!quizId && (
        <form onSubmit={handleCreateQuiz} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">কুইজের নাম</label>
            <input
              type="text"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">পাঠ্যসূচি</label>
            <textarea
              value={syllabus}
              onChange={(e) => setSyllabus(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">কুইজের অবস্থা</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="on">On</option>
              <option value="off">Off</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">ডেডলাইন</label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">কুইজ সময় (মিনিট)</label>
            <input
              type="number"
              value={quizTime}
              onChange={(e) => setQuizTime(e.target.value)}
              className="w-full border p-2 rounded"
              required
              min="1"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {loading ? "লোড হচ্ছে..." : "কুইজ তৈরি করুন"}
          </button>
        </form>
      )}

      {/* Step 2: Add Questions */}
      {quizId && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-2 text-center">প্রশ্ন যোগ করুন</h3>
          {questions.map((q, idx) => (
            <div key={idx} className="border p-3 mb-4 rounded">
              <input
                type="text"
                placeholder={`প্রশ্ন ${idx + 1}`}
                value={q.question}
                onChange={(e) => handleQuestionChange(idx, "question", e.target.value)}
                className="w-full border p-2 rounded mb-2"
              />
              {q.options.map((opt, optIdx) => (
                <input
                  key={optIdx}
                  type="text"
                  placeholder={`Option ${optIdx + 1}`}
                  value={opt}
                  onChange={(e) => handleQuestionChange(idx, optIdx, e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                />
              ))}
              <input
                type="text"
                placeholder="সঠিক উত্তর"
                value={q.correct}
                onChange={(e) => handleQuestionChange(idx, "correct", e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
          ))}

          <button
            onClick={addQuestion}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 mr-2"
          >
            নতুন প্রশ্ন যোগ করুন
          </button>

          <button
            onClick={saveQuestions}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            প্রশ্নগুলো সংরক্ষণ করুন
          </button>
        </div>
      )}
    </div>
  );
}
