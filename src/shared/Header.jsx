import { useContext } from "react";
import logo from "/topline.jpeg";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../firebase/AuthProvider";
import { FaUserGraduate } from "react-icons/fa";
import { FaBookOpenReader } from "react-icons/fa6";
import { RiAdminFill } from "react-icons/ri";
import { toast } from "react-toastify";

export default function Header() {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  // Close drawer helper
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
    <div className="drawer z-50">
      <input id="main-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <div className="navbar bg-blue-950 text-white shadow-md mb-3">
          <div className="flex-1 flex items-center gap-2">
            <Link
              to="/"
              className="text-xl font-bold hover:text-yellow-300 transition"
            >
              টপলাইন একাডেমি
            </Link>
          </div>
          <div className="flex-none">
            <label
              htmlFor="main-drawer"
              className="btn btn-ghost border border-red drawer-button text-white bg-red-500 hover:bg-orange-500 transition"
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
          {/* Admin Section */}
          {user?.email && (
            <>
              <li className="menu-title flex items-center gap-2 text-red-600 font-bold">
                <RiAdminFill /> <span>অ্যাডমিন</span>
              </li>
              <li>
                <Link to="/students" onClick={closeDrawer}>
                  শিক্ষার্থীসমূহ
                </Link>
              </li>
              <li>
                <Link to="/add-fee" onClick={closeDrawer}>
                  ফি যুক্ত করুন
                </Link>
              </li>
              <li>
                <Link to="/add-attendance" onClick={closeDrawer}>
                  উপস্থিতি যুক্ত করুন
                </Link>
              </li>
              <li>
                <Link to="/add-quiz" onClick={closeDrawer}>
                  পরীক্ষা নিন
                </Link>
              </li>
              <li>
                <Link to="/add-video" onClick={closeDrawer}>
                  ভিডিও যুক্ত করুন
                </Link>
              </li>
              <li>
                <Link to="/manage-quiz" onClick={closeDrawer}>
                  কুইজ নিয়ন্ত্রন করুন
                </Link>
              </li>
              <li>
                <Link to="/result" onClick={closeDrawer}>
                  পরীক্ষার ফলাফল
                </Link>
              </li>
              <li>
                <Link to="/recentresults" onClick={closeDrawer}>
                  সকল ফলাফল
                </Link>
              </li>
              <div className="divider"></div>
            </>
          )}

          {/* Student Section */}
          {(user?.isActive || user?.email) && (
            <>
              <li className="menu-title flex items-center gap-2 text-blue-600 font-bold">
                <FaBookOpenReader /> <span>শিক্ষার্থী</span>
              </li>
              <li>
                <Link to="/quiz" onClick={closeDrawer}>
                  পরীক্ষাসমূহ
                </Link>
              </li>
              <li>
                <Link to="/sheet" onClick={closeDrawer}>
                  লেকচারশীট
                </Link>
              </li>
              <li>
                <Link to="/result" onClick={closeDrawer}>
                  পরীক্ষার ফলাফল
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" onClick={closeDrawer}>
                  লিডারবোর্ড
                </Link>
              </li>
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
              <li className="menu-title flex items-center gap-2 text-green-600 font-bold">
                <FaUserGraduate /> <span>প্রোফাইল</span>
              </li>
              {user?.isActive && (
                <li>
                  <Link to="/report" onClick={closeDrawer}>
                    আমার রিপোর্ট
                  </Link>
                </li>
              )}
              <li>
                <Link to="/profile" onClick={closeDrawer}>
                  তথ্য পরিবর্তন
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline w-full mt-1"
                >
                  লগআউট
                </button>
              </li>
              {user.email && (
                <li className="text-xs opacity-70 px-2 break-words">
                  {user.email}
                </li>
              )}
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={closeDrawer}>
                  লগইন
                </Link>
              </li>
              <li>
                <Link to="/html" onClick={closeDrawer}>
                  এইচটিএমএল এডিটর
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
