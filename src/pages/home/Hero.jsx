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
    <div className="flex pr-2 gap-1 items-center justify-between bg-gradient-to-l from-yellow-50 via-red-50 to-blue-50">
      <div className="w-1/2">
        {animationData && <Lottie animationData={animationData} loop={true} />}
      </div>
      <div className="w-1/2">
        <h2 className="mb-1 font-bold md:text-5xl"> ‌ভর্তি চলমান </h2>
        <p className="text-xs text-justify text-gray-700 mb-1 md:text-3xl md:py-3 md:pr-10"> একাদশ ও দ্বাদশ শিক্ষার্থীদের প্রয়োজনীয়তার উপর ভিত্তি করে ২ ধরনের ব্যাচ রয়েছে; ফোকাস ব্যাচে প্রতিদিন ১ ঘন্টা ক্লাস অপরদিকে ইন্টেন্সিভ ব্যাচ এ প্রতিদিন ২ ঘন্টা ক্লাস হয়।  </p>
        <div className="flex gap-2">
          <button className="btn btn-sm btn-error text-white" onClick={()=>document.getElementById('intensive').showModal()}>ইন্টেসিভ ব্যাচ</button>
          <button className="btn btn-sm btn-accent text-white" onClick={()=>document.getElementById('focus').showModal()}> ফোকাস ব্যাচ </button>
        </div>
        
      </div>


    <dialog id="intensive" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h2 className="text-center text-2xl font-bold"> <span className="text-red-500">ইন্টেন্সিভ</span> ব্যাচ </h2>
                <p className='text-xs text-justify'> যারা পরীক্ষার জন্য সম্পূর্ণ প্রস্তুতি নিতে চান, তাদের জন্য এটি সর্বোত্তম ব্যাচ। এই ব্যাচে শিক্ষার্থীরা পূর্ণাঙ্গ শিডিউল অনুসারে ক্লাস করবে। মানবিক শাখার প্রায় সকল বিষয় স্টেপ-বাই-স্টেপ ক্লাস এবং পরীক্ষার মাধ্যমে সম্পূর্ণ করা হবে। আমাদের দেওয়া শিডিউলের বাইরে পড়াশোনা করার প্রয়োজন হবে না। মাস শেষে ১০০ মার্কের ৩ ঘণ্টার সমন্বিত পরীক্ষা অনুষ্ঠিত হবে।  </p>
                <div className="grid mt-2 grid-cols-2 gap-2">
                  <div className="text-xs flex items-center gap-2 bg-green-100 rounded-md p-0.5">
                    <CiCalendarDate className="text-lg"></CiCalendarDate>
                    <p> <b> ক্লাস শুরু </b> <br /> ০১ অক্টোবর ২০২৫ </p> 
                  </div>
                  <div className="text-xs flex items-center gap-2 bg-purple-100 rounded-md p-0.5">
                    <CiCalendarDate className="text-lg"></CiCalendarDate>
                    <p> <b> প্রতি মাসে </b> <br /> ২০টি ক্লাস </p> 
                  </div>
                  <div className="text-xs flex items-center gap-2 bg-blue-100 rounded-md p-0.5">
                    <CiCalendarDate className="text-lg"></CiCalendarDate>
                    <p> <b> প্রতি মাসে </b> <br /> ১০টি অনলাইন এক্সাম </p> 
                  </div>
                  <div className="text-xs flex items-center gap-2 bg-red-100 rounded-md p-0.5">
                    <CiCalendarDate className="text-lg"></CiCalendarDate>
                    <p> <b> মাসিক ফি </b> <br /> ১২০০ টাকা </p> 
                  </div>
                </div>
        <p className="text-center mt-2"><Link to='/admit' className="btn btn-sm btn-error text-white"> ভর্তি হোন </Link></p>
      </div>
      
    </dialog>
    <dialog id="focus" className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <h2 className="text-center text-2xl font-bold"> <span className="text-accent">ফোকাস</span> ব্যাচ </h2>
                <p className='text-xs text-justify'> যাদের নির্দিষ্ট সাবজেক্টগুলোতে সমস্যা রয়েছে তাদের জন্য এই ব্যাচ সেরা। এই ব্যাচে শিক্ষার্থীরা মূল বিষয়গুলোতে ফোকাস করে প্রস্তুতি নেবে। প্রতিদিন ১ ঘন্টা ক্লাস অনুষ্ঠিত হবে, যেখানে তিনটি গুরুত্বপূর্ণ বিষয় পরীক্ষাভিত্তিকভাবে পড়ানো হবে। </p>
                <div className="grid mt-2 grid-cols-2 gap-2">
                  <div className="text-xs flex items-center gap-2 bg-green-100 rounded-md p-0.5">
                    <CiCalendarDate className="text-lg"></CiCalendarDate>
                    <p> <b> ক্লাস শুরু </b> <br /> চলমান </p> 
                  </div>
                  <div className="text-xs flex items-center gap-2 bg-purple-100 rounded-md p-0.5">
                    <CiCalendarDate className="text-lg"></CiCalendarDate>
                    <p> <b> প্রতি মাসে </b> <br /> ২০টি ক্লাস </p> 
                  </div>
                  <div className="text-xs flex items-center gap-2 bg-blue-100 rounded-md p-0.5">
                    <CiCalendarDate className="text-lg"></CiCalendarDate>
                    <p> <b> প্রতি মাসে </b> <br /> ৩টি অনলাইন এক্সাম </p> 
                  </div>
                  <div className="text-xs flex items-center gap-2 bg-red-100 rounded-md p-0.5">
                    <CiCalendarDate className="text-lg"></CiCalendarDate>
                    <p> <b> মাসিক ফি </b> <br /> ৬০০ টাকা </p> 
                  </div>
                </div>
        <p className="text-center mt-2"><Link to='/admit' className="btn btn-sm btn-error text-white"> ভর্তি হোন </Link></p>
      </div>
      
    </dialog>
    </div>
  );
}
