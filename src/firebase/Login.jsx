import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "./AuthProvider";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase.init";

export default function Login() {
  const { setUser } = useContext(AuthContext); // we'll store logged-in student here
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/report"; // redirect after login

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const q = query(
        collection(db, "students"),
        where("phone", "==", phone),
        where("password", "==", password)
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        toast.error("Invalid phone or password");
        return;
      }

      const studentData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
      toast.success("Logged in successfully!");
      
      // store in context
      setUser(studentData);

      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Login failed: " + err.message);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <ToastContainer autoClose={1500} />
        
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">লগিন করুন!</h1>
          <p className="py-6">শিক্ষার্থীর যাবতীয় তথ্য দেখার জন্য লগিন করুন</p>
        </div>

        <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
          <form onSubmit={handleLogin} className="card-body">
            <fieldset className="fieldset">
              <label className="label">Phone</label>
              <input
                type="text"
                className="input"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />

              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit" className="btn btn-neutral mt-4">
                লগিন করুন
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}
