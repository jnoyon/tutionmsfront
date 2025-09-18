import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "./AuthProvider";

export default function SignIn() {
  const { signInUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = (e) => {
    e.preventDefault();
    signInUser(email, password)
      .then(() => {
        toast.success("Logged in successfully!");
        navigate(from, { replace: true });
      })
      .catch((err) => {
        toast.error(err.message);
        
      });
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          />
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">লগিন করুন!</h1>
          <p className="py-6">
            থিসিসের সাবজেক্ট যুক্ত করতে কিংবা পরিবর্তন করতে অথবা আবেদনগুলো দেখতে লগিন করতে হবে।
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
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