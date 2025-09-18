
import { useContext } from "react";
import { AuthContext } from "../firebase/AuthProvider";
import FAQ from "./home/FAQ";
import Hero from "./home/Hero";
import LoginSection from "./home/LoginSection";
import LeaderboardSection from "../components/LeaderboardSection";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      {!user &&<Hero></Hero>}

      <div className="w-11/12 mx-auto my-3">
        <LeaderboardSection></LeaderboardSection>
        {!user && <LoginSection></LoginSection>}
        <FAQ></FAQ>
      </div>
      
    </div>
  );
}
