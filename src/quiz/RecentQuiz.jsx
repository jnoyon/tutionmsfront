import React, { useEffect, useState, useContext } from "react";
import { db } from "../firebase/firebase.init";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { AuthContext } from "../firebase/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RecentQuiz() {
  const { user } = useContext(AuthContext);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // List of admin emails
  const adminEmails = ["jihadur51@gmail.com"]; // add more if needed
  const isAdmin = adminEmails.includes(user?.email);

  useEffect(() => {
    if (!user) return;
    if (!isAdmin) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "quizResults"));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setResults(data);
      } catch (err) {
        console.error(err);
        toast.error("কুইজ রেজাল্ট লোড করতে সমস্যা: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user]);

  const deleteResult = async (id) => {
    if (!confirm("আপনি কি এই রেজাল্ট ডিলিট করতে চান?")) return;
    try {
      await deleteDoc(doc(db, "quizResults", id));
      setResults((prev) => prev.filter((r) => r.id !== id));
      toast.success("রেজাল্ট ডিলিট হয়েছে");
    } catch (err) {
      console.error(err);
      toast.error("ডিলিট করতে সমস্যা: " + err.message);
    }
  };

  if (!user) return <p className="text-center mt-10">লোড হচ্ছে...</p>;
  if (!isAdmin) return <p className="text-center mt-10 text-red-500">আপনার অ্যাক্সেস নেই</p>;

  return (
    <div className="w-11/12 mx-auto my-5">
      <ToastContainer autoClose={2000} />

      <h2 className="text-2xl font-bold mb-4 text-center">সাম্প্রতিক কুইজ রেজাল্ট</h2>

      {loading ? (
        <p className="text-gray-500 text-center">লোড হচ্ছে...</p>
      ) : results.length === 0 ? (
        <p className="text-gray-500 text-center">কোনও রেজাল্ট পাওয়া যায়নি।</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 divide-y divide-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border border-gray-300">ক্রমিক</th>
                <th className="p-2 border border-gray-300">কুইজের নাম</th>
                <th className="p-2 border border-gray-300">ছাত্রের নাম</th>
                <th className="p-2 border border-gray-300">প্রাপ্ত নাম্বার</th>
                <th className="p-2 border border-gray-300">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {results.map((r, idx) => (
                <tr key={r.id}>
                  <td className="p-2 border border-gray-300 text-center">{idx + 1}</td>
                  <td className="p-2 border border-gray-300">{r.quizTitle || r.quizId}</td>
                  <td className="p-2 border border-gray-300">{r.studentName || "অজানা"}</td>
                  <td className="p-2 border border-gray-300 text-center">{r.score}/{r.total}</td>
                  <td className="p-2 border border-gray-300 text-center">
                    <button
                      onClick={() => deleteResult(r.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      ডিলিট
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
