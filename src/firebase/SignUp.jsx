import React, { useState } from "react";
import { db } from "../firebase/firebase.init";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import usericon from "../assets/images/usericon.png";
import "react-toastify/dist/ReactToastify.css";

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    fatherName: "",
    address: "",
    instituteName: "",
    batch: "", // No default selected
    mark: 0,
    image: usericon,
    isActive: false,
  });

  const [studentId, setStudentId] = useState("");
  const [monthlyFee, setMonthlyFee] = useState(""); // fee input

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "batch") {
      // Set fee based on batch
      if (value === "ফোকাস") setMonthlyFee("600");
      else if (value === "ইন্টেন্সিভ") setMonthlyFee("1200");
      else setMonthlyFee(""); // অন্যান্য or others
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateStudentId = async () => {
    let id;
    let exists = true;
    while (exists) {
      id = Math.floor(100000 + Math.random() * 900000).toString();
      const q = query(collection(db, "students"), where("studentId", "==", id));
      const snapshot = await getDocs(q);
      exists = !snapshot.empty;
    }
    return id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.batch) return toast.error("Please select a batch!");

    try {
      const q = query(
        collection(db, "students"),
        where("phone", "==", formData.phone)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return toast.error("Phone number already registered!");
      }

      const newId = await generateStudentId();
      setStudentId(newId);

      await addDoc(collection(db, "students"), {
        ...formData,
        studentId: newId,
        createdAt: serverTimestamp(),
      });

      document.getElementById("studentIdModal").showModal();
    } catch (err) {
      console.error(err);
      toast.error("Failed to register: " + err.message);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <ToastContainer autoClose={2000} />
      <div className="card bg-base-100 w-full max-w-sm shadow-2xl mx-auto mt-10">
        <form onSubmit={handleSubmit} className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

          <label className="label">শিক্ষার্থীর নাম</label>
          <input
            type="text"
            name="name"
            className="input"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label className="label">মোবাইল</label>
          <input
            type="tel"
            name="phone"
            className="input"
            placeholder="০১XXXXXXXXX"
            value={formData.phone}
            onChange={handleChange}
            pattern="[0-9]{10,15}"
            required
          />

          <label className="label">পিতার নাম</label>
          <input
            type="text"
            name="fatherName"
            className="input"
            value={formData.fatherName}
            onChange={handleChange}
          />

          <label className="label">ঠিকানা</label>
          <input
            type="text"
            name="address"
            className="input"
            value={formData.address}
            onChange={handleChange}
          />

          <label className="label">শিক্ষা প্রতিষ্ঠানের নাম</label>
          <input
            type="text"
            name="instituteName"
            className="input"
            value={formData.instituteName}
            onChange={handleChange}
          />

          <label className="label">ব্যাচ</label>
          <div className="flex gap-4 border bg-white border-gray-300 rounded-md p-2">
            {["ইন্টেন্সিভ", "ফোকাস", "কম্পিউটার"].map((b) => (
              <label key={b} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="batch"
                  value={b}
                  checked={formData.batch === b}
                  onChange={handleChange}
                  className="radio"
                  required
                />
                {b}
              </label>
            ))}
          </div>

          {/* Disabled fee input */}
          {monthlyFee && (
            <>
              <label className="label">মাসিক ফি</label>
              <input type="text" className="input" value={monthlyFee} disabled />
            </>
          )}

          <button type="submit" className="btn btn-neutral mt-4">
            রেজিস্ট্রেশন করুন
          </button>
        </form>
      </div>

      {/* Student ID Modal */}
      <dialog id="studentIdModal" className="modal" onClose={() => navigate("/login")}>
        <div className="modal-box text-center">
          <h3 className="text-3xl font-bold text-red-600 mb-4">Student ID</h3>
          <p className="text-5xl font-extrabold text-blue-700 tracking-widest mb-6">
            {studentId}
          </p>
          <p className="text-lg">
            এটি আপনার স্টুডেন্ট আইডি। এটি লিখে রাখুন কিংবা মুখস্থ করে ফেলুন।  
            এই আইডি দিয়েই লগিন করতে হবে। কাউকে শেয়ার করা যাবে না।
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-success">বুঝেছি</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
