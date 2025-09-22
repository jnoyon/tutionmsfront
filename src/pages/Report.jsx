import React, { useEffect, useState, useContext } from "react";
import { db } from "../firebase/firebase.init";
import { collection, query, where, getDocs } from "firebase/firestore";
import { AuthContext } from "../firebase/AuthProvider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router";

export default function Report() {
  const { user } = useContext(AuthContext);
  const [student, setStudent] = useState(null);
  const [quizInfo, setQuizInfo] = useState({}); // { quizId: { title, highestScore } }

  useEffect(() => {
    if (!user?.studentId) return;

    const fetchStudent = async () => {
      try {
        // Fetch student info
        const q = query(
          collection(db, "students"),
          where("studentId", "==", user.studentId)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          toast.error("Student not found!");
          return;
        }

        const studentData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };

        // Fetch all quiz results for this student
        const resultsSnap = await getDocs(
          query(collection(db, "quizResults"), where("studentId", "==", studentData.studentId))
        );

        const quizMarksUpdated = {};
        const info = {};

        for (let docSnap of resultsSnap.docs) {
          const data = docSnap.data();
          quizMarksUpdated[data.quizId] = data.score;

          if (!info[data.quizId]) {
            // fetch quiz title
            const quizSnap = await getDocs(
              query(collection(db, "quizzes"), where("__name__", "==", data.quizId))
            );
            const title = !quizSnap.empty ? quizSnap.docs[0].data().title : data.quizId;

            // compute highest score for this quiz
            const allResultsSnap = await getDocs(
              query(collection(db, "quizResults"), where("quizId", "==", data.quizId))
            );
            let highest = 0;
            allResultsSnap.forEach(r => {
              if (r.data().score > highest) highest = r.data().score;
            });

            info[data.quizId] = { title, highestScore: highest };
          }
        }

        setQuizInfo(info);
        setStudent({ ...studentData, quizMarks: quizMarksUpdated });
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch student data");
      }
    };

    fetchStudent();
  }, [user?.studentId]);

  if (!student)
    return (
      <div className="bg-white min-h-screen flex justify-center items-center">
        <span className="loading loading-bars loading-xl"></span>
      </div>
    );

  const attendanceDates = student.attendance ? Object.entries(student.attendance) : [];
  const fees = student.fees || [];
  const quizMarks = student.quizMarks || {};

  const formatDate = (timestamp) => {
    if (!timestamp) return "---";
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toLocaleDateString();
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="bg-gradient-to-l from-yellow-50 via-red-50 to-blue-50 py-5">
      <ToastContainer autoClose={2000} />

      {/* Student Info */}
      <div className="border border-gray-300 rounded-lg p-3 bg-white mx-auto w-11/12">
        <div className="text-center border-b border-gray-300 py-2 mb-2">
          <img
            src={student.image || "/default-avatar.png"}
            alt={student.name}
            className="w-24 h-24 rounded-full mx-auto mb-2 border-2 border-gray-300 object-cover"
          />
          <b>{student.name}</b>
          <p>{student.batch} ব্যাচ</p>
        </div>
        <div className="flex flex-col gap-1 text-sm md:text-base">
          <p><strong>স্টুডেন্ট আইডি:</strong> {student.studentId}</p>
          <p><strong>মোবাইল:</strong> {student.phone}</p>
          <p><strong>পিতার নাম:</strong> {student.fatherName}</p>
          <p><strong>ঠিকানা:</strong> {student.address}</p>
          <p><strong>শিক্ষা প্রতিষ্ঠান:</strong> {student.instituteName}</p>
          <p><strong>ভর্তি অবস্থা:</strong> {student.isActive ? "একটিভ" : "ইন-একটিভ"}</p>
          <Link className="btn btn-sm my-2 btn-primary" to='/profile'> তথ্য পরিবর্তন করুন </Link>
        </div>
      </div>

      {/* Attendance Section */}
      <div className="border border-gray-300 rounded-lg p-3 bg-white mx-auto w-11/12 mt-5">
        <div className="text-center border-b border-gray-300 py-2 mb-2"><b>উপস্থিতি</b></div>
        <div className="flex flex-wrap gap-2">
          {attendanceDates.length === 0 && <p className="text-gray-500">কোনও উপস্থিতি তথ্য নেই</p>}
          {attendanceDates.map(([date, record], index) => (
            <div
              key={date}
              className={`w-8 h-8 rounded-md flex items-center justify-center text-white font-bold cursor-pointer ${
                record.present ? "bg-green-600" : "bg-red-600"
              }`}
              onClick={() => toast.info(`তারিখ: ${date} - উপস্থিতি: ${record.present ? "হ্যাঁ" : "না"}`)}
              title={date}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Quiz Marks Section */}
      <div className="bg-white mx-auto w-11/12 mt-5">
        {Object.keys(quizMarks).length === 0 ? (
          <p className="text-gray-500 text-center">কোনও কুইজ দেওয়া হয়নি</p>
        ) : (
          <table className="table-auto border-collapse border border-gray-400 w-full text-sm md:text-base">
            <thead>
              <tr>
                <th colSpan={3} className="p-2"> কুইজ রিপোর্ট </th>
              </tr>
              <tr>
                <th className="border border-gray-300 p-1.5">কুইজ নাম</th>
                <th className="border border-gray-300 p-1.5">প্রাপ্ত নাম্বার</th>
                <th className="border border-gray-300 p-1.5">সর্বোচ্চ নাম্বার</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(quizMarks).map(([quizId, mark]) => (
                <tr key={quizId}>
                  <td className="border border-gray-300 p-1.5">{quizInfo[quizId]?.title || quizId}</td>
                  <td className="border border-gray-300 p-1.5">{mark}</td>
                  <td className="border border-gray-300 p-1.5">{quizInfo[quizId]?.highestScore ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Fees Section */}
      <div className="border border-gray-300 rounded-lg p-3 bg-white mx-auto w-11/12 mt-5">
        <div className="text-center border-b border-gray-300 py-2 mb-2"><b>পেমেন্ট রিপোর্ট</b></div>
        {fees.length === 0 ? (
          <p className="text-gray-500 text-center">কোনও ফি জমা হয়নি</p>
        ) : (
          <table className="table-auto border-collapse border border-gray-400 w-full text-sm md:text-base">
            <thead>
              <tr>
                <th className="border border-gray-300 p-1.5">টাকা</th>
                <th className="border border-gray-300 p-1.5">বিবরণ</th>
                <th className="border border-gray-300 p-1.5">তারিখ</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((f, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-300 p-1.5">{f.amount}</td>
                  <td className="border border-gray-300 p-1.5">{f.description}</td>
                  <td className="border border-gray-300 p-1.5">{formatDate(f.paidAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
