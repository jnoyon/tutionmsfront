import { useContext } from "react";
import { AuthContext } from "../firebase/AuthProvider";
import Hero from "./home/Hero";
import LoginSection from "./home/LoginSection";
import LeaderboardSection from "../components/LeaderboardSection";
import Noticeboard from "./Noticeboard";
import HSCBatch from "./home/HSCBatch";
import BatchComponent from "../components/BatchComponent";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      {!user && <Hero />}

      <div className="w-11/12 mx-auto my-3">
        {user && <Noticeboard />}



        {!user && <HSCBatch></HSCBatch>}

        {user?.email ? (
    <>
      <LeaderboardSection batch={"০১"} />
      <LeaderboardSection batch={"০২"} />
      <LeaderboardSection batch={"০৩"} />
      <LeaderboardSection batch={"০৪"} />
      <LeaderboardSection batch={"কম্পিউটার"} />
        </>
      ) : (
        user?.isActive && ["০১", "০২", "০৩", "০৪", "কম্পিউটার"].includes(user?.batch) && (
          <LeaderboardSection batch={user.batch} />
        )
      )}

        
        {!user && <LoginSection />}


        {user?.isActive && user?.batch && (
          <BatchComponent batch={user.batch} />
        )}

      </div>
    </div>
  );
}
