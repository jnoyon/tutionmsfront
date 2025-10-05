import Lottie from "lottie-react";
import { useEffect, useState } from "react";

export default function GrammarBookPreview() {

  const [animationData, setAnimationData] = useState(null);
  
    useEffect(() => {
      fetch("/OnlineLearningPlatform.json")
        .then((res) => res.json())
        .then((data) => setAnimationData(data));
    }, []);
  return (
    <div className="w-11/12 mx-auto bg-white my-5 py-5 shadow-md rounded-md items-center text-center">
          <div className="w-1/2 mx-auto">
          {animationData && <Lottie animationData={animationData} loop={true} />}
          </div>
          <h2 className="text-center text-3xl font-bold text-primary">
            Grammar in Real Life
          </h2>
          <p className="text-secondary mb-2">
            by Jihadur Rahman Noyon
          </p>
          <p className="text-sm text-gray-500 mb-4">
            [Most Common English Vocabulary Included]
          </p>

          <div className="card-actions justify-center">
            <button
              className="btn btn-primary btn-wide text-lg"
              onClick={() =>
                window.open("https://toplineac.xyz/sample.pdf", "_blank")
              }
            >
               বইটি পড়ুন
            </button>
          </div>
        </div>
  );
}
