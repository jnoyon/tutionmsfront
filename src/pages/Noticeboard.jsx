import React, { useEffect, useState, useContext } from "react";
import { db } from "../firebase/firebase.init";
import { collection, query, where, getDocs } from "firebase/firestore";
import { AuthContext } from "../firebase/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Noticeboard() {
  const { user } = useContext(AuthContext);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotices = async () => {
      if (!user) return;

      // Inactive student
      if (!user.isActive && !user.email) {
        setNotices([]);
        return;
      }

      setLoading(true);
      try {
        let snapshot;
        let data = [];

        if (user?.email) {
          // Admin: fetch all notices and sort descending
          snapshot = await getDocs(collection(db, "notices"));
          data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          data.sort((a, b) => b.publishedAt?.seconds - a.publishedAt?.seconds);
          setNotices(data.slice(0, 3)); // last 3 notices
        } else {
          // Active student: batch-specific
          snapshot = await getDocs(
            query(collection(db, "notices"), where("batch", "==", user.batch))
          );
          data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          data.sort((a, b) => b.publishedAt?.seconds - a.publishedAt?.seconds);
          setNotices(data.slice(0, 3));
        }
      } catch (err) {
        console.error(err);
        toast.error("নোটিশ লোড করা যায়নি: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [user]);

  if (!user) return null;

  if (!user.isActive && !user.email) {
    return <p className="text-red-500">আপনার ভর্তি এখনো কনফার্ম করা হয়নি।</p>;
  }

  return (
    <div className="bg-white border-gray-300 border py-5 rounded-md mb-5">
      <ToastContainer autoClose={2000} />
      <h2 className="text-center text-2xl font-bold mb-2"> <span className="text-red-500">নো</span>টিশ বোর্ড</h2>

      {loading ? (
        <div className="bg-white min-h-screen flex justify-center items-center">
        <span className="loading loading-bars loading-xl"></span>
      </div>
      ) : notices.length === 0 ? (
        <p>কোনও নোটিশ নেই।</p>
      ) : (
        <div className="flex flex-col gap-4">
          
          <ul className="timeline timeline-vertical">
            {notices.map((n) => (
            <li key={n.id}>
              <div className="timeline-start text-sm">{n.publishedAt?.toDate
                  ? n.publishedAt.toDate().toLocaleString()
                  : new Date(n.publishedAt?.seconds * 1000).toLocaleString()}  <p>{n.batch} ব্যাচ</p> </div>
                  
              <div className="timeline-middle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="timeline-end text-lg timeline-box">
                {n.text}  
              </div>
              <hr />
            </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
