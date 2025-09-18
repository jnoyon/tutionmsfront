import React, { useContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { db } from '../firebase/firebase.init';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { AuthContext } from '../firebase/AuthProvider';

export default function Profile() {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    fatherName: '',
    address: '',
    instituteName: '',
    batch: '',
    role: '',
  });

  const [docId, setDocId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Real-time listener for user profile
  useEffect(() => {
  if (!user?.phone) return; // Use phone instead of email

  const q = query(collection(db, 'students'), where('phone', '==', user.phone));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    if (!snapshot.empty) {
      const docSnap = snapshot.docs[0];
      const data = docSnap.data();
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        fatherName: data.fatherName || '',
        address: data.address || '',
        instituteName: data.instituteName || '',
        batch: data.batch || '',
        role: data.role || '',
      });
      setDocId(docSnap.id);
    } else {
      toast.error('No profile found for this phone!');
    }
    setLoading(false);
  });

  return () => unsubscribe();
}, [user?.phone]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!docId) return toast.error('No profile to update');

    try {
      const docRef = doc(db, 'students', docId);
      await updateDoc(docRef, formData);
      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-11/12 mb-3">
      <form onSubmit={handleSubmit}>
        <ToastContainer autoClose={2000} position="top-right" theme="light" />

        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
          <legend className="fieldset-legend">প্রোফাইল তথ্য</legend>

          <label className="label">অবস্থান</label>
          <input
            type="text"
            name="role"
            className="input w-full border border-red-500"
            value={formData.role}
            disabled
          />

          <label className="label">আপনার নাম</label>
          <input
            type="text"
            name="name"
            className="input w-full"
            value={formData.name}
            onChange={handleChange}
          />

          <label className="label">মোবাইল নম্বর</label>
          <input
            type="number"
            name="phone"
            className="input w-full"
            value={formData.phone}
            onChange={handleChange}
          />

          <label className="label">পিতার নাম</label>
          <input
            type="text"
            name="fatherName"
            className="input w-full"
            value={formData.fatherName}
            onChange={handleChange}
          />

          <label className="label">ঠিকানা</label>
          <input
            type="text"
            name="address"
            className="input w-full"
            value={formData.address}
            onChange={handleChange}
          />

          <label className="label">শিক্ষা প্রতিষ্ঠানের নাম</label>
          <input
            type="text"
            name="instituteName"
            className="input w-full"
            value={formData.instituteName}
            onChange={handleChange}
          />

          <label className="label">ব্যাচ</label>
          <div className="flex gap-4 border bg-white border-gray-300 rounded-md p-2">
            {['Intensive-1', 'Focus-1', 'Computer'].map((b) => (
              <label key={b} className="flex items-center gap-1">
                <input
                  type="radio"
                  className="radio"
                  name="batch"
                  value={b}
                  checked={formData.batch === b}
                  onChange={handleChange}
                />
                {b === 'Intensive-1' ? 'ইন্টেন্সিভ' : b === 'Focus-1' ? 'ফোকাস' : 'কম্পিউটার'}
              </label>
            ))}
          </div>

          <button type="submit" className="btn btn-neutral mt-4">
            আপডেট করুন
          </button>
        </fieldset>
      </form>
    </div>
  );
}
