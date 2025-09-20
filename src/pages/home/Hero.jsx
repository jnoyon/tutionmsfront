import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { Link } from "react-router";
import { CiCalendarDate } from "react-icons/ci";

export default function Hero() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/OnlineLearningPlatform.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);
  return (
    <div className="flex pr-2 gap-1 items-center justify-between">
      <div className="w-1/2">
        {animationData && <Lottie animationData={animationData} loop={true} />}
      </div>
      <div className="w-1/2">
        <h2 className="mb-1 font-bold md:text-5xl"> ‌ভর্তি চলমান </h2>
        <p className="text-sm text-justify text-gray-700 mb-1 md:text-3xl md:py-3 md:pr-10"> একাদশ ও দ্বাদশ শিক্ষার্থীদের প্রয়োজনীয়তার উপর ভিত্তি করে ২ ধরনের ব্যাচ রয়েছে; ফোকাস ব্যাচে প্রতিদিন ১ ঘন্টা ক্লাস অপরদিকে ইন্টেন্সিভ ব্যাচ এ প্রতিদিন ২ ঘন্টা ক্লাস হয়।  </p>
        <div className="flex gap-2">
          <Link to='/intensive' className="btn btn-sm btn-error text-white">ইন্টেসিভ ব্যাচ</Link>
          <Link to='/focus' className="btn btn-sm btn-accent text-white"> ফোকাস ব্যাচ </Link>
        </div>
        
      </div>


   
    </div>
  );
}
