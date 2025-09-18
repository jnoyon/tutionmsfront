import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

export default function AdmissionForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    fatherName: '',
    address: '',
    collegeName: '',
    batch: '',
    role: 'inactive',
    id: '',
    admissiondate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your API endpoint
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      toast.success('Registration successful! Your Roll: ' + data.roll);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <div className='mx-auto w-11/12 mb-3'>
      <form onSubmit={handleSubmit}>
        <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        />
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
          <legend className="fieldset-legend">ভর্তি ফরম</legend>

          <label className="label">আপনার নাম</label>
          <input
            type="text"
            name="name"
            className="input w-full"
            placeholder="বাংলায় লিখুন"
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

          <label className="label">পিন দিন</label>
          <input
            type="number"
            name="pin"
            className="input w-full"
            value={formData.phone}
            onChange={handleChange}
          />

          <label className="label">পিতার নাম</label>
          <input
            type="text"
            name="fatherName"
            className="input w-full"
            placeholder="বাংলায় লিখুন"
            value={formData.fatherName}
            onChange={handleChange}
          />

          <label className="label">ঠিকানা</label>
          <input
            type="text"
            name="address"
            className="input w-full"
            placeholder="বাংলায় লিখুন"
            value={formData.address}
            onChange={handleChange}
          />

          <label className="label">কলেজের নাম</label>
          <input
            type="text"
            name="collegeName"
            className="input w-full"
            placeholder="বাংলায় লিখুন"
            value={formData.collegeName}
            onChange={handleChange}
          />

          <label className="label">ব্যাচ</label>
          <div className="flex gap-4 border bg-white border-gray-300 rounded-md p-2">
            <label className='flex items-center gap-1'>
              <input
                type="radio"
                className='radio radio-error'
                name="batch"
                value="Intensive-1"
                onChange={handleChange}
              /> ইন্টেন্সিভ ব্যাচ - ০১ 
            </label>
            <label className='flex items-center gap-1'>
              <input
                type="radio"
                className='radio radio-accent'
                name="batch"
                value="Focus-1"
                onChange={handleChange}
              /> ফোকাস ব্যাচ - ০১
            </label>
          </div>

          <button type="submit" className="btn btn-neutral mt-4">ভর্তি হোন</button>
        </fieldset>
      </form>
    </div>
  );
}
