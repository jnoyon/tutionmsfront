import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.init";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddQuiz() {
  const [title, setTitle] = useState("");
  const [batches, setBatches] = useState([]); // ✅ array
  const [syllabus, setSyllabus] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [duration, setDuration] = useState(5);
  const [isActive, setIsActive] = useState(true);
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], answer: "" },
  ]);

  const handleBatchChange = (batchName) => {
    setBatches((prev) =>
      prev.includes(batchName)
        ? prev.filter((b) => b !== batchName) // remove
        : [...prev, batchName] // add
    );
  };

  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    if (field === "question" || field === "answer") {
      updated[index][field] = value;
    } else {
      updated[index].options[field] = value;
    }
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { question: "", options: ["", "", "", ""], answer: "" },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("কুইজের শিরোনাম লিখুন");
    if (!syllabus.trim()) return toast.error("সিলেবাস লিখুন");
    if (!subject.trim()) return toast.error("বিষয় লিখুন");
    if (!chapter.trim()) return toast.error("অধ্যায় লিখুন");
    if (batches.length === 0) return toast.error("অন্তত একটি ব্যাচ নির্বাচন করুন");
    if (!duration || duration <= 0) return toast.error("সময় লিখুন");

    for (let q of questions) {
      if (!q.question.trim()) return toast.error("সব প্রশ্ন পূরণ করুন");
      if (!q.answer.trim()) return toast.error("সব প্রশ্নের সঠিক উত্তর নির্বাচন করুন");
      if (q.options.some((opt) => !opt.trim()))
        return toast.error("সব অপশন পূরণ করুন");
    }

    try {
      await addDoc(collection(db, "quizzes"), {
        title,
        syllabus,
        subject,
        chapter,
        batches, // ✅ array save
        duration,
        isActive,
        questions,
        createdAt: new Date(),
      });
      toast.success("কুইজ সফলভাবে তৈরি হয়েছে!");
      setTitle("");
      setSyllabus("");
      setSubject("");
      setChapter("");
      setBatches([]);
      setDuration(5);
      setIsActive(true);
      setQuestions([{ question: "", options: ["", "", "", ""], answer: "" }]);
    } catch (err) {
      console.error(err);
      toast.error("কুইজ তৈরি করতে সমস্যা: " + err.message);
    }
  };

  return (
    <div className="w-11/12 mx-auto my-5">
      <ToastContainer autoClose={2000} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box p-4">
          <legend className="fieldset-legend">নতুন কুইজ তৈরি করুন</legend>

          {/* Title */}
          <label className="label">কুইজ শিরোনাম</label>
          <input
            type="text"
            className="input w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Syllabus / Subject / Chapter */}
          <label className="label">সিলেবাস</label>
          <input
            type="text"
            className="input w-full"
            value={syllabus}
            onChange={(e) => setSyllabus(e.target.value)}
          />

          <label className="label">বিষয়</label>
          <input
            type="text"
            className="input w-full"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <label className="label">অধ্যায়</label>
          <input
            type="text"
            className="input w-full"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
          />

          {/* ✅ Batch Checkboxes */}
          <div className="flex items-center gap-2 mt-2 border border-gray-300 rounded-sm bg-white p-2">
            <label className="label">ব্যাচ</label>
          <div className="flex flex-col sm:flex-row gap-2">
            {["০১", "০২", "০৩", "০৪", "কম্পিউটার"].map((batchName) => (
              <label key={batchName} className="cursor-pointer flex items-center gap-2 ">
                <input
                  type="checkbox"
                  className="checkbox checkbox-accent"
                  checked={batches.includes(batchName)}
                  onChange={() => handleBatchChange(batchName)}
                />
                <span>{batchName}</span>
              </label>
            ))}
          </div>
          </div>

          {/* Duration */}
          <label className="label">সময় (মিনিটে)</label>
          <input
            type="number"
            min="1"
            className="input w-full mb-4"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />

          {/* Active / Inactive */}
          <label className="label">কুইজ চালু আছে?</label>
          <select
            className="select select-bordered w-full mb-4"
            value={isActive ? "true" : "false"}
            onChange={(e) => setIsActive(e.target.value === "true")}
          >
            <option value="true">হ্যাঁ</option>
            <option value="false">না</option>
          </select>

          {/* Questions */}
          {questions.map((q, idx) => (
            <div key={idx} className="border p-3 rounded-md mb-3 space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-semibold">{`প্রশ্ন ${idx + 1}`}</label>
                {questions.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-error"
                    onClick={() => removeQuestion(idx)}
                  >
                    মুছে ফেলুন
                  </button>
                )}
              </div>

              <input
                type="text"
                placeholder="প্রশ্ন লিখুন"
                className="input w-full"
                value={q.question}
                onChange={(e) =>
                  handleQuestionChange(idx, "question", e.target.value)
                }
              />

              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt, oidx) => (
                  <input
                    key={oidx}
                    type="text"
                    placeholder={`অপশন ${oidx + 1}`}
                    className="input w-full"
                    value={opt}
                    onChange={(e) =>
                      handleQuestionChange(idx, oidx, e.target.value)
                    }
                  />
                ))}
              </div>

              <label className="label">সঠিক উত্তর</label>
              <select
                className="select select-bordered w-full"
                value={q.answer}
                onChange={(e) =>
                  handleQuestionChange(idx, "answer", e.target.value)
                }
              >
                <option value="">সিলেক্ট করুন</option>
                {q.options.map((opt, oidx) => (
                  <option key={oidx} value={opt}>
                    {opt || `অপশন ${oidx + 1}`}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-neutral"
            onClick={addQuestion}
          >
            নতুন প্রশ্ন যোগ করুন
          </button>

          <button type="submit" className="btn btn-primary w-full mt-4">
            কুইজ তৈরি করুন
          </button>
        </fieldset>
      </form>
    </div>
  );
}
