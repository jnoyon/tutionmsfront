import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.init";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddVideo() {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [subject, setSubject] = useState("");
  const [batches, setBatches] = useState([]);

  const handleBatchChange = (batchName) => {
    setBatches(
      (prev) =>
        prev.includes(batchName)
          ? prev.filter((b) => b !== batchName) // remove
          : [...prev, batchName] // add
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("ভিডিও শিরোনাম লিখুন");
    if (!link.trim()) return toast.error("ভিডিও লিঙ্ক লিখুন");
    if (!subject.trim()) return toast.error("বিষয় লিখুন");
    if (batches.length === 0)
      return toast.error("অন্তত একটি ব্যাচ নির্বাচন করুন");

    try {
      await addDoc(collection(db, "videos"), {
        title,
        link,
        subject,
        batches, // ✅ array
        createdAt: new Date(),
      });

      toast.success("ভিডিও সফলভাবে যোগ হয়েছে!");

      // reset form
      setTitle("");
      setLink("");
      setSubject("");
      setBatches([]);
    } catch (err) {
      console.error("Error adding video:", err);
      toast.error("ভিডিও যোগ করতে সমস্যা: " + err.message);
    }
  };

  return (
    <div className="w-11/12 mx-auto my-5">
      <ToastContainer autoClose={2000} />
      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box p-4">
          <legend className="fieldset-legend">নতুন ভিডিও যোগ করুন</legend>

          {/* Title */}
          <label className="label">ভিডিও শিরোনাম</label>
          <input
            type="text"
            className="input w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Link */}
          <label className="label">ভিডিও লিঙ্ক</label>
          <input
            type="text"
            className="input w-full"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />

          {/* Subject */}
          <label className="label">বিষয়</label>
          <input
            type="text"
            className="input w-full"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          {/* Batch Checkboxes */}
          <div className="flex items-center gap-2 mt-2 border border-gray-300 rounded-sm bg-white p-2">
            <label className="label">ব্যাচ</label>
            <div className="flex flex-col sm:flex-row gap-2">
              {["০১", "০২", "০৩", "০৪", "অর্থনীতি"].map((batchName) => (
                <label
                  key={batchName}
                  className="cursor-pointer flex items-center gap-2"
                >
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

          {/* Submit */}
          <button type="submit" className="btn btn-primary w-full mt-4">
            ভিডিও যোগ করুন
          </button>
        </fieldset>
      </form>
    </div>
  );
}
