import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { collection, query, where, getDocs } from "firebase/firestore";
import { AuthContext } from "../../firebase/AuthProvider";
import { db } from "../../firebase/firebase.init";

export default function LoginSection() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!phone || !password) {
      return toast.error("মোবাইল এবং পাসওয়ার্ড লিখুন");
    }

    try {
      const q = query(collection(db, "students"), where("phone", "==", phone));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        return toast.error("মোবাইল নম্বর পাওয়া যায়নি");
      }

      const student = snapshot.docs[0].data();

      if (student.password !== password) {
        return toast.error("পাসওয়ার্ড ভুল");
      }

      // login success
      setUser({ id: snapshot.docs[0].id, ...student });
      toast.success("লগিন সফল!");
      navigate("/report");
    } catch (err) {
      console.error(err);
      toast.error("লগিনে সমস্যা: " + err.message);
    }
  };

  return (
    <div>
      <ToastContainer autoClose={2000} />
      <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full mb-5 border p-4">
        <h2 className="text-center text-2xl font-bold mb-2">
          <span className="text-red-500">ল</span>গিন করুন
        </h2>
        <p>শিক্ষার্থীর যাবতীয় তথ্য দেখার জন্য লগিন করুন</p>

        <label className="label">শিক্ষার্থীর মোবাইল নম্বর</label>
        <input
          type="number"
          className="input w-full"
          placeholder="মোবাইল নম্বর"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label className="label">শিক্ষার্থীর পাসওয়ার্ড</label>
        <input
          type="password"
          className="input w-full"
          placeholder="পাসওয়ার্ড"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-neutral mt-4" onClick={handleLogin}>
          লগিন করুন
        </button>
      </fieldset>
    </div>
  );
}
