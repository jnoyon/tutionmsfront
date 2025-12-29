import { useContext } from "react";
import { AuthContext } from "../firebase/AuthProvider";
import LoginSection from "./home/LoginSection";
import LeaderboardSection from "../components/LeaderboardSection";
import BatchComponent from "../components/BatchComponent";
import HSCHome from "./home/HSCHome";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      {!user && <HSCHome />}

      <div className="w-11/12 mx-auto my-3">
        {user?.isActive && user?.batch && <BatchComponent batch={user.batch} />}
        {user?.email ? (
          <>
            <LeaderboardSection batch={"০১"} />
            <LeaderboardSection batch={"০২"} />
            <LeaderboardSection batch={"০৩"} />
            <LeaderboardSection batch={"০৪"} />
            <LeaderboardSection batch={"অর্থনীতি"} />
          </>
        ) : (
          user?.isActive &&
          ["০১", "০২", "০৩", "০৪", "অর্থনীতি"].includes(user?.batch) && (
            <LeaderboardSection batch={user.batch} />
          )
        )}

        {!user && <LoginSection />}
      </div>
    </div>
  );
}
