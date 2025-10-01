import React, { useState } from 'react';
import { db } from '../firebase/firebase.init';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddNotice() {
  const [noticeText, setNoticeText] = useState('');
  const [batch, setBatch] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!noticeText.trim()) return toast.error('নোটিশ লিখুন!');
    if (!batch) return toast.error('ব্যাচ নির্বাচন করুন!');

    try {
      setLoading(true);
      await addDoc(collection(db, 'notices'), {
        text: noticeText,
        batch,
        publishedAt: serverTimestamp(), // Firestore server timestamp
      });

      toast.success('নোটিশ সফলভাবে প্রকাশিত হয়েছে!');
      setNoticeText('');
      setBatch('');
    } catch (err) {
      console.error(err);
      toast.error('নোটিশ সংরক্ষণ করা যায়নি: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-11/12 mx-auto py-5">
      <ToastContainer autoClose={2000} />
      <fieldset className="fieldset border p-4 rounded-md">
        <legend className="fieldset-legend text-lg font-bold">নোটিশ যোগ করুন</legend>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-2">
          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="নোটিশ লিখুন"
            value={noticeText}
            onChange={(e) => setNoticeText(e.target.value)}
            required
          />

          <select
            className="select select-bordered w-full"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            required
          >
            <option value="০১">ব্যাচ-০১</option>
          <option value="০২">ব্যাচ-০২</option>
          <option value="০৩">ব্যাচ-০৩</option>
          <option value="০৪">ব্যাচ-০৪</option>
          <option value="কম্পিউটার">কম্পিউটার</option>
          </select>

          <button
            type="submit"
            className={`btn btn-neutral w-full ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            সংরক্ষণ করুন
          </button>
        </form>
      </fieldset>
    </div>
  );
}
