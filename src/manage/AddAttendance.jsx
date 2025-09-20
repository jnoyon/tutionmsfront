import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase.init';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';

export default function AddAttendance() {
  const [batch, setBatch] = useState('Intensive-1'); // Default batch
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch students whenever batch changes
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'students'), where('batch', '==', batch));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data(),
          present: false,
          assignment: false
        }));
        setStudents(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [batch]);

  const handleCheckboxChange = (id, type) => {
    setStudents(prev => prev.map(s => 
      s.id === id ? { ...s, [type]: !s[type] } : s
    ));
  };

  const handleSubmit = async () => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    try {
      for (const student of students) {
        const docRef = doc(db, 'students', student.id);
        const newMark = student.mark + (student.present ? 1 : 0) + (student.assignment ? 1 : 0);
        const attendance = student.attendance || {};
        attendance[today] = {
          present: student.present,
          assignment: student.assignment
        };
        await updateDoc(docRef, { mark: newMark, attendance });
      }
      toast.success('Attendance updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update attendance: ' + err.message);
    }
  };

  return (
    <div className='py-5 w-11/12 mx-auto'>
      <ToastContainer autoClose={2000} />
      <div className='mb-3 flex items-center gap-2'>
        <label>ব্যাচ:</label>
        <select
          className='select select-bordered w-full'
          value={batch}
          onChange={e => setBatch(e.target.value)}
        >
          <option value='ইন্টেন্সিভ'>ইন্টেন্সিভ</option>
          <option value='ফোকাস'>ফোকাস</option>
          <option value='অন্যান্য'>অন্যান্য</option>
        </select>
      </div>

      {loading ? (
        <p>Loading students...</p>
      ) : (
        <table className="border-collapse border border-gray-400 w-full bg-white">
          <thead>
            <tr>
              <th className="border border-gray-300 p-1.5">নাম</th>
              <th className="border border-gray-300 p-1.5">উপস্থিতি</th>
              <th className="border border-gray-300 p-1.5">এসাইনমেন্ট</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td className="border border-gray-300 p-1.5">{student.name}</td>
                <td className="border border-gray-300 p-1.5 text-center">
                  <input
                    type='checkbox'
                    className='checkbox checkbox-success'
                    checked={student.present}
                    onChange={() => handleCheckboxChange(student.id, 'present')}
                  />
                </td>
                <td className="border border-gray-300 p-1.5 text-center">
                  <input
                    type='checkbox'
                    className='checkbox checkbox-success'
                    checked={student.assignment}
                    onChange={() => handleCheckboxChange(student.id, 'assignment')}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        className='btn btn-neutral mt-4'
        onClick={handleSubmit}
        disabled={loading || students.length === 0}
      >
        আপডেট করুন
      </button>
    </div>
  );
}
