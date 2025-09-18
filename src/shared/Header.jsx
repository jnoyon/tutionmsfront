import { useContext } from "react";
import logo from "../assets/images/logo.jpg";
import { Link } from "react-router";
import { AuthContext } from "../firebase/AuthProvider";
import { FaUserGraduate } from "react-icons/fa";
import { FaBookOpenReader } from "react-icons/fa6";

export default function Header() {
  const { user, logOut } = useContext(AuthContext);

  const handleLogout = () => {
    logOut()
      .then(() => {
        toast.success("Logged out successfully");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1 flex items-center gap-2">
        <img src={logo} width={35} />
        <Link to="/" className="text-xl font-bold">
          {" "}
          নয়ন অ্যাকাডেমি
        </Link>
      </div>
      <div className="flex-none gap-2 flex">
        {user && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost border border-accent btn-circle"
            >
              <FaBookOpenReader />
            </div>
            <div
              tabIndex={0}
              className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow"
            >
              <ul
                tabIndex={0}
                className="menu dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/students">শিক্ষার্থীসমূহ</Link>
                </li>
                <li>
                  <Link to="/add-exam">পরীক্ষা নিন</Link>
                </li>
                <li>
                  <Link to="/result">পরীক্ষার ফলাফল</Link>
                </li>
                <li>
                  <Link to="/leaderboard">লিডারবোর্ড</Link>
                </li>
              </ul>
            </div>
          </div>
        )}
        {user && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost border border-accent btn-circle"
            >
              <FaBookOpenReader />
            </div>
            <div
              tabIndex={0}
              className="card card-compact dropdown-content bg-base-100 z-1 mt-3 w-52 shadow"
            >
              <ul
                tabIndex={0}
                className="menu dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/exam">পরীক্ষাসমূহ</Link>
                </li>
                <li>
                  <Link to="/sheet">লেকচারশীট</Link>
                </li>
                <li>
                  <Link to="/result">পরীক্ষার ফলাফল</Link>
                </li>
                <li>
                  <Link to="/leaderboard">লিডারবোর্ড</Link>
                </li>
              </ul>
            </div>
          </div>
        )}
        {user ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost border border-error btn-circle "
            >
              <FaUserGraduate />
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/report">আমার রিপোর্ট</Link>
              </li>
              <li>
                <Link to="/profile">তথ্য পরিবর্তন</Link>
              </li>
              <li>
                <button onClick={handleLogout}>লগআউট</button>
              </li>
              <li className="text-xs"> {user.email} </li>
            </ul>
          </div>
        ) : (
          <Link to="/login"> লগিন </Link>
        )}
      </div>
    </div>
  );
}
