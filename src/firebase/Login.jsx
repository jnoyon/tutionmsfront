import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "./AuthProvider";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase.init";

export default function Login() {
  const { signInUser, setUser } = useContext(AuthContext);
  const [role, setRole] = useState("student"); // student or admin
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/report"; // redirect after login

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (role === "student") {
        // Student login via phone/password
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
        setUser(studentData); // store student in context
        toast.success("Student logged in successfully!");
      } else {
        // Admin/CR login via email/password
        await signInUser(email, password);
        toast.success("Logged in successfully!");
        // user info will be automatically updated via AuthProvider
      }

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
          <p className="py-6">শিক্ষার্থী বা অ্যাডমিন/CR হিসাবে লগিন করুন</p>
        </div>

        <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
          <form onSubmit={handleLogin} className="card-body">
            <fieldset className="fieldset">
              <label className="label">Role</label>
              <select
                className="select select-bordered w-full mb-4"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="admin">Admin/CR</option>
              </select>

              {role === "student" ? (
                <>
                  <label className="label">Phone</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </>
              ) : (
                <>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </>
              )}

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
