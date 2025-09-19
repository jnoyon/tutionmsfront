import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "./AuthProvider";

export default function AdminLogin() {
  const { signInUser } = useContext(AuthContext);
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"; // redirect after login

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Firebase Auth login
      const result = await signInUser(email, password);

      // User info is automatically updated via AuthProvider's onAuthStateChanged
      toast.success("Logged in successfully!");
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
          <p className="py-6">অ্যাডমিন অথবা CR হিসাবে প্রবেশ করুন</p>
        </div>

        <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
          <form onSubmit={handleLogin} className="card-body">
            <fieldset className="fieldset">
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
