import { useContext } from "react";
import logo from "../assets/images/logo.jpg";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../firebase/AuthProvider";
import { FaUserGraduate } from "react-icons/fa";
import { FaBookOpenReader } from "react-icons/fa6";
import { RiAdminFill } from "react-icons/ri";
import { toast } from "react-toastify";

export default function Header() {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Close drawer after clicking
  const closeDrawer = () => {
    const drawer = document.getElementById("main-drawer");
    if (drawer) drawer.checked = false;
  };

  const handleLogout = () => {
    logOut()
      .then(() => {
        toast.success("Logged out successfully");
        closeDrawer();
        navigate("/login");
      })
      .catch((err) => toast.error(err.message));
  };

  return (
    <div className="drawer">
      <input id="main-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <div className="navbar bg-base-100 shadow-sm">
          <div className="flex-1 flex items-center gap-2">
            <img src={logo} width={35} alt="Logo" />
            <Link to="/" className="text-xl font-bold">
              নয়ন অ্যাকাডেমি
            </Link>
          </div>
          <div className="flex-none">
            <label
              htmlFor="main-drawer"
              className="btn btn-ghost border drawer-button"
            >
              ☰ মেনু
            </label>
          </div>
        </div>
      </div>

      {/* Drawer Sidebar */}
      <div className="drawer-side">
        <label
          htmlFor="main-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 gap-2">
          {/* Admin Menu */}
          {user?.email && (
            <>
              <li className="menu-title flex items-center gap-2">
                <RiAdminFill /> <span>অ্যাডমিন</span>
              </li>
              <li><Link to="/students" onClick={closeDrawer}>শিক্ষার্থীসমূহ</Link></li>
              <li><Link to="/add-notice" onClick={closeDrawer}>নোটিশ দিন</Link></li>
              <li><Link to="/add-fee" onClick={closeDrawer}>ফি যুক্ত করুন</Link></li>
              <li><Link to="/add-attendance" onClick={closeDrawer}>উপস্থিতি যুক্ত করুন</Link></li>
              <li><Link to="/add-exam" onClick={closeDrawer}>পরীক্ষা নিন</Link></li>
              <li><Link to="/result" onClick={closeDrawer}>পরীক্ষার ফলাফল</Link></li>
              <div className="divider"></div>
            </>
          )}

          {/* Active Student Menu */}
          {(user?.isActive || user?.email) && (
            <>
              <li className="menu-title flex items-center gap-2">
                <FaBookOpenReader /> <span>শিক্ষার্থী</span>
              </li>
              <li><Link to="/quiz" onClick={closeDrawer}>পরীক্ষাসমূহ</Link></li>
              <li><Link to="/sheet" onClick={closeDrawer}>লেকচারশীট</Link></li>
              <li><Link to="/result" onClick={closeDrawer}>পরীক্ষার ফলাফল</Link></li>
              <li><Link to="/leaderboard" onClick={closeDrawer}>লিডারবোর্ড</Link></li>
              <div className="divider"></div>
            </>
          )}

          {/* Inactive Student Message */}
          {user && !user.isActive && !user.email && (
            <p className="text-red-500 px-2">
              আপনার ভর্তি এখনো কনফার্ম করা হয়নি।
            </p>
          )}

          {/* Profile Section */}
          {user ? (
            <>
              <li className="menu-title flex items-center gap-2">
                <FaUserGraduate /> <span>প্রোফাইল</span>
              </li>
              {user?.isActive && (
                <li><Link to="/report" onClick={closeDrawer}>আমার রিপোর্ট</Link></li>
              )}
              <li><Link to="/profile" onClick={closeDrawer}>তথ্য পরিবর্তন</Link></li>
              <li><button onClick={handleLogout}>লগআউট</button></li>
              {user.email && (
                <li className="text-xs opacity-70 px-2">{user.email}</li>
              )}
            </>
          ) : (
            <li><Link to="/login" onClick={closeDrawer}>লগইন</Link></li>
          )}
        </ul>
      </div>
    </div>
  );
}
