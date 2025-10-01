import { useEffect, useState } from "react";
import Lottie from "lottie-react";


export default function Hero() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/OnlineLearningPlatform.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data));
  }, []);
  return (
    <div className="flex pr-2 gap-1 items-center justify-betweenn bg-white">
      <div className="w-1/2">
        {animationData && <Lottie animationData={animationData} loop={true} />}
      </div>
      <div className="w-1/2">
        <p className="text-base text-justify text-gray-700 mb-1 md:text-3xl md:py-3 md:pr-10"> একাদশ ও দ্বাদশ শ্রেণির বাংলা, ইংরেজি এবং তথ্য যোগাযোগ প্রযুক্তি শেখার প্ল্যাটফরম।  </p>
        <span className="text-sm btn btn-neutral btn-sm animate-pulse mt-2">ভর্তি চলছে</span>

      </div>


   
    </div>
  );
}
