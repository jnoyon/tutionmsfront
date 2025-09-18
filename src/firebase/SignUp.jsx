import { useState } from "react";
import { db } from "../firebase/firebase.init";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import usericon from '../assets/images/usericon.png';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    fatherName: "",
    address: "",
    instituteName: "",
    batch: "Intensive-1",
    role: "inactive",
    mark: 0,
    image: usericon,
    isActive: true, // all users active by default
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if phone already exists
      const q = query(collection(db, "students"), where("phone", "==", formData.phone));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return toast.error("Phone number already registered!");
      }

      // Add new student record
      await addDoc(collection(db, "students"), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      toast.success("Registration successful!");
      setTimeout(() => navigate("/login"), 1500);

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

          <label className="label">Name</label>
          <input type="text" name="name" className="input" value={formData.name} onChange={handleChange} required />

          <label className="label">Phone</label>
          <input type="text" name="phone" className="input" value={formData.phone} onChange={handleChange} required />

          <label className="label">Password</label>
          <input type="password" name="password" className="input" value={formData.password} onChange={handleChange} required />

          <label className="label">Father's Name</label>
          <input type="text" name="fatherName" className="input" value={formData.fatherName} onChange={handleChange} />

          <label className="label">Address</label>
          <input type="text" name="address" className="input" value={formData.address} onChange={handleChange} />

          <label className="label">Institute Name</label>
          <input type="text" name="instituteName" className="input" value={formData.instituteName} onChange={handleChange} />

          <label className="label">Batch</label>
          <div className="flex gap-4 border bg-white border-gray-300 rounded-md p-2">
            {["Intensive-1", "Focus-1", "Computer"].map(b => (
              <label key={b} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="batch"
                  value={b}
                  checked={formData.batch === b}
                  onChange={handleChange}
                  className="radio"
                />
                {b === "Intensive-1" ? "ইন্টেন্সিভ" : b === "Focus-1" ? "ফোকাস" : "কম্পিউটার"}
              </label>
            ))}
          </div>

          <button type="submit" className="btn btn-neutral mt-4">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
