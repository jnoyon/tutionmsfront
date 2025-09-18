
import { useContext } from "react";
import Leaderboard from "../components/Leaderboard";
import SpeedDial from "../components/SpeedDial";
import { AuthContext } from "../firebase/AuthProvider";
import About from "./home/About";
import FAQ from "./home/FAQ";
import Hero from "./home/Hero";
import Login from "./home/Login";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      {!user &&<Hero></Hero>}

      <div className="w-11/12 mx-auto my-3">
        <Leaderboard></Leaderboard>
        {!user &&<Login></Login>}
        <FAQ></FAQ>
      </div>
      
    </div>
  );
}
