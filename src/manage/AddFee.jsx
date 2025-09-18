import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase.init';
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddFee() {
  const [batch, setBatch] = useState('Intensive-1');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  // Load students when batch changes
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'students'), where('batch', '==', batch));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudents(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [batch]);

  const handleSubmit = async () => {
  if (!selectedStudent) return toast.error('শিক্ষার্থী নির্বাচন করুন');
  if (!amount) return toast.error('টাকা লিখুন');

  try {
    const studentRef = doc(db, 'students', selectedStudent.id);

    // Use local JS date instead of serverTimestamp inside arrayUnion
    const now = new Date();

    await updateDoc(studentRef, {
      fees: arrayUnion({
        amount: Number(amount),
        description,
        paidAt: now, // ✅ local date
      }),
    });

    toast.success('ফি জমা হয়েছে');
    setAmount('');
    setDescription('');
  } catch (err) {
    console.error(err);
    toast.error('ফি জমা হয়নি: ' + err.message);
  }
};


  return (
    <div className="py-5 w-11/12 mx-auto">
      <ToastContainer autoClose={2000} />

      {/* Batch Selection */}
      <div className="mb-3">
        <label>ব্যাচ নির্বাচন করুন:</label>
        <select
          className="select select-bordered ml-2"
          value={batch}
          onChange={e => setBatch(e.target.value)}
        >
          <option value="Intensive-1">ইন্টেন্সিভ</option>
          <option value="Focus-1">ফোকাস</option>
          <option value="Computer">কম্পিউটার</option>
        </select>
      </div>

      {/* Student Selection */}
      <div className="mb-3">
        <label>শিক্ষার্থী বাছাই করুন:</label>
        <select
          className="select select-bordered ml-2"
          value={selectedStudent?.id || ''}
          onChange={e => setSelectedStudent(students.find(s => s.id === e.target.value))}
        >
          <option value="">নাম</option>
          {students.map(student => (
            <option key={student.id} value={student.id}>{student.name}</option>
          ))}
        </select>
      </div>

      {/* Fee Inputs */}
      <div className="mb-3 flex gap-2">
        <input
          type="number"
          className="input input-bordered"
          placeholder="টাকা"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <input
          type="text"
          className="input input-bordered flex-1"
          placeholder="বিবরণ"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <button
        className="btn btn-neutral"
        onClick={handleSubmit}
        disabled={loading || !selectedStudent}
      >
        জমা দিন
      </button>

      {/* Optional: show fee history */}
      {selectedStudent?.fees?.length > 0 && (
        <div className="mt-5">
          <h3 className="font-bold mb-2">ফি ইতিহাস</h3>
          <table className="table-auto border-collapse border border-gray-400 w-full">
            <thead>
              <tr>
                <th className="border border-gray-300 p-1.5">টাকা</th>
                <th className="border border-gray-300 p-1.5">বিবরণ</th>
                <th className="border border-gray-300 p-1.5">তারিখ</th>
              </tr>
            </thead>
            <tbody>
              {selectedStudent.fees.map((f, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-300 p-1.5">{f.amount}</td>
                  <td className="border border-gray-300 p-1.5">{f.description}</td>
                  <td className="border border-gray-300 p-1.5">
                    {f.paidAt?.toDate ? f.paidAt.toDate().toLocaleDateString() : '---'}
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
