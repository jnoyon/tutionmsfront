import { CiCalendarDate } from "react-icons/ci";

export default function About() {
  return (
    <div className='p-2 rounded-md my-2 border border-gray-300'>
        <h2 className="text-center text-2xl font-bold"> <span className="text-red-500">ব্যা</span>চ সম্পর্কে </h2>
        <p className='text-xs text-justify'>এই কোর্সে মানবিক শাখার বাংলা, ইংরেজি, আইসিটি ও অর্থনীতি সহ সকল বিষয়কে কারিকুলাম অনুযায়ী অনলাইনে পড়ানো হবে। প্রতিদিনের অনলাইন পরীক্ষা ও মাসিক মূল্যায়ণের মাধ্যমে ধারাবাহিক প্রস্তুতি নিশ্চিত করা হবে। শিক্ষার্থীরা বাড়তি পড়াশোনার ঝামেলা ছাড়াই সম্পূর্ণ প্রস্তুতি পাবেন। সর্বোচ্চ মার্ক অর্জনকারীদের জন্য মাসিক পুরস্কার এবং বিশেষ সম্মাননা থাকবে। কোর্সটি একটি সঠিক গাইডলাইন ও রোডম্যাপ অনুসারে ডিজাইন করা হয়েছে।</p>
        <div className="grid mt-2 grid-cols-2 gap-2">
          <div className="text-sm flex items-center gap-2 bg-green-100 rounded-md p-0.5">
            <CiCalendarDate className="text-lg"></CiCalendarDate>
            <p> <b> ক্লাস শুরু </b> <br /> ০১ অক্টোবর ২০২৫ </p> 
          </div>
          <div className="text-sm flex items-center gap-2 bg-purple-100 rounded-md p-0.5">
            <CiCalendarDate className="text-lg"></CiCalendarDate>
            <p> <b> প্রতি মাসে </b> <br /> ২০টি ক্লাস </p> 
          </div>
          <div className="text-sm flex items-center gap-2 bg-blue-100 rounded-md p-0.5">
            <CiCalendarDate className="text-lg"></CiCalendarDate>
            <p> <b> প্রতি মাসে </b> <br /> ১০টি অনলাইন এক্সাম </p> 
          </div>
          <div className="text-sm flex items-center gap-2 bg-red-100 rounded-md p-0.5">
            <CiCalendarDate className="text-lg"></CiCalendarDate>
            <p> <b> মাসিক ফি </b> <br /> ১২০০ টাকা </p> 
          </div>
        </div>
        
    </div>
  )
}
