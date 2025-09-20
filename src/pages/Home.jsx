import { useContext } from "react";
import { AuthContext } from "../firebase/AuthProvider";
import Hero from "./home/Hero";
import LoginSection from "./home/LoginSection";
import LeaderboardSection from "../components/LeaderboardSection";
import Noticeboard from "./Noticeboard";
import Intensive from "../components/Intensive";
import Focus from "../components/Focus";
import Computer from "../components/Computer";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      {!user && <Hero />}

      <div className="w-11/12 mx-auto my-3">
        {user && <Noticeboard />}
        <LeaderboardSection />
        {!user && <LoginSection />}

        {/* Conditional batch component only if user is active */}
        {user?.isActive && user?.batch === "ইন্টেন্সিভ" && <Intensive />}
        {user?.isActive && user?.batch === "ফোকাস" && <Focus />}
        {user?.isActive && user?.batch === "কম্পিউটার" && <Computer />}
      </div>
    </div>
  );
}
