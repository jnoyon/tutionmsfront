import React from 'react'

export default function Leaderboard() {
  const students = [
    {
      name: "জিহাদুর রহমান নয়ন",
      college: "সায়েদুর রহমান কলেজ",
      score: 20,
      img: "https://jihadur.surge.sh/assets/photo-HPTmCrAF.jpg",
    },
    {
      name: "জিহাদুর রহমান",
      college: "সায়েদুর রহমান কলেজ",
      score: 25,
      img: "https://jihadur.surge.sh/assets/photo-HPTmCrAF.jpg",
    },
    {
      name: "জিল্লুর রহমান",
      college: "সায়েদুর রহমান কলেজ",
      score: 15,
      img: "https://jihadur.surge.sh/assets/photo-HPTmCrAF.jpg",
    },
  ];

  // Sort by score descending
  const sorted = [...students].sort((a, b) => b.score - a.score);

  return (
    <div className="border border-gray-300 rounded-md py-3 mb-3">
      <h2 className="font-bold text-2xl text-center">
        <span className="text-red-500">সে</span>রা শিক্ষার্থী
      </h2>
      <p className='text-center text-sm mb-4 text-gray-600'> ইন্টেন্সিভ ব্যাচ </p>

      <div className="flex gap-3 justify-center items-end">
        {/* Second Place */}
        <div className="flex flex-col items-center">
          <div className="bg-gray-200 w-20 h-20 flex items-end justify-center rounded-t-lg relative md:w-40 md:h-40">
            <img
              src={sorted[1].img}
              alt={sorted[1].name}
              className="w-20 h-20 rounded-full border-4 border-gray-400 -mb-10 md:w-40 md:h-40 md:-mb-20"
            />
            <span className="absolute -top-2 bg-gray-400 text-white px-2 py-1 rounded-full text-xs md:text-xl md:-top-4">
                ২য়
            </span>
          </div>
          <div className="mt-10 text-center md:mt-20">
            <h3 className="mt-2 text-sm font-semibold md:text-xl">{sorted[2].name}</h3>
            <p className="text-xs text-gray-500 md:text-base">{sorted[2].college}</p>
            <p className="text-xs md:text-base">প্রাপ্ত নম্বর: {sorted[2].score}</p>
          </div>
        </div>

        {/* First Place */}
        <div className="flex flex-col items-center">
          <div className="bg-yellow-200 w-24 h-24 flex items-end justify-center rounded-t-lg relative md:w-64 md:h-64">
            <img
              src={sorted[0].img}
              alt={sorted[0].name}
              className="w-24 h-24 rounded-full border-4 border-yellow-400 -mb-12 md:w-64 md:h-64 md:-mb-28"
            />
            <span className="absolute -top-2 bg-yellow-400 text-white px-3 py-1 rounded-full text-sm md:text-xl md:-top-4">
              ১ম
            </span>
          </div>
          <div className="mt-10 text-center md:mt-28">
            <h3 className="mt-2 text-sm font-semibold md:text-xl">{sorted[2].name}</h3>
            <p className="text-xs text-gray-500 md:text-base">{sorted[2].college}</p>
            <p className="text-xs md:text-base">প্রাপ্ত নম্বর: {sorted[2].score}</p>
          </div>
        </div>

        {/* Third Place */}
        <div className="flex flex-col items-center">
          <div className="bg-orange-200 w-20 h-20 flex items-end justify-center rounded-t-lg relative md:w-40 md:h-40">
            <img
              src={sorted[2].img}
              alt={sorted[2].name}
              className="w-20 h-20 rounded-full border-4 border-orange-400 -mb-10 md:w-40 md:h-40 md:-mb-20"
            />
            <span className="absolute -top-2 bg-orange-400 text-white px-2 py-1 rounded-full text-xs md:text-xl md:-top-4">
              ৩য়
            </span>
          </div>
          <div className="mt-10 text-center md:mt-20">
            <h3 className="mt-2 text-sm font-semibold md:text-xl">{sorted[2].name}</h3>
            <p className="text-xs text-gray-500 md:text-base">{sorted[2].college}</p>
            <p className="text-xs md:text-base">প্রাপ্ত নম্বর: {sorted[2].score}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
