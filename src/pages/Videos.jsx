import { useContext, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase.init";
import { AuthContext } from "../firebase/AuthProvider";

export default function Videos() {
  const { user } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      if (!user?.batch) {
        setVideos([]);
        setLoading(false);
        return;
      }

      try {
        // ✅ Fetch videos for this batch
        const q = query(
          collection(db, "videos"),
          where("batches", "array-contains", user.batch)
        );
        const snap = await getDocs(q);
        const fetched = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVideos(fetched);
      } catch (err) {
        console.error("Error loading videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [user]);

  // ✅ Group by subject
  const groupedBySubject = videos.reduce((acc, vid) => {
    if (!acc[vid.subject]) acc[vid.subject] = [];
    acc[vid.subject].push(vid);
    return acc;
  }, {});

  if (loading) return <div className="p-3">লোড হচ্ছে...</div>;

  if (videos.length === 0)
    return <div className="p-3">কোনও ভিডিও পাওয়া যায়নি।</div>;

  return (
    <div className="w-11/12 mx-auto my-5 space-y-6">
      <h2 className="text-xl font-bold mb-4"> সহায়ক ভিডিও </h2>

      {Object.keys(groupedBySubject).map((subject) => (
        <div key={subject} className="border p-3 bg-white border-gray-300 rounded-md shadow">
          <h3 className="text-lg font-semibold mb-2">{subject}</h3>
          <ul className="space-y-2">
            {groupedBySubject[subject].map((video, idx) => (
              <li
                key={video.id}
                className="flex justify-between items-center bg-gray-50 p-2 rounded"
              >
                <span className="font-medium">
                  {idx + 1}. {video.title}
                </span>
                <a
                  href={video.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white bg-error px-3 font-bold py-0.5 rounded-sm"
                >
                  দেখুন
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
