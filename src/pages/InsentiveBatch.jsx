import logo from '../assets/images/logo.jpg'
export default function InsentiveBatch() {
  return (
    <section className="max-w-6xl mx-auto p-6 sm:p-10">
      <div className="grid gap-8 lg:gap-12 lg:grid-cols-3 items-start">
        {/* Left column - Card */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-xl p-6">
            <div className="flex items-start gap-4">
              <div className="avatar">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  <img src={logo} alt="Logo" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">এইচএসসি ইন্টেন্সিভ ব্যাচ</h2>
                <p className="text-sm opacity-80 mt-1">বেসিক থেকে সন্তোযজনক প্রস্তুতি</p>
              </div>
            </div>

            <div className="divider my-4" />

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m4 4v-6a2 2 0 00-2-2h-1" />
                </svg>
                <div>
                  <strong>শূন্য থেকে শুরু করার উপযোগী:</strong> গ্রামার/ভোকাবুলারি দুর্বল শিক্ষার্থীদের জন্য শুরু থেকেই বেসিক গ্রামার ও ভোকাবুলারি শেখানো হবে
                </div>
              </li>

              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <strong>প্রাকটিস ও টেস্ট:</strong> আইসিটি এবং অন্যান্য বিষয়ে MCQ ও সৃজনশীল প্রশ্নের নিয়মিত অনুশীলন।
                </div>
              </li>

              <li className="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <strong>মাসিক পুরস্কার বিতরণ:</strong> প্রতি মাসে সর্বোচ্চ নম্বর প্রাপ্ত শিক্ষার্থীদের (৩জন) পুরস্কৃত করা হবে এছাড়াও যেসব শিক্ষার্থী সবগুলো ক্লাস করবে এবং পরীক্ষা দিবে তাদেরকেও পুরস্কৃত করা হবে।
                </div>
              </li>
            </ul>

            <div className="mt-6 text-sm bg-base-200 p-4 rounded-lg">
              <p><strong>💰 মাসিক ফি:</strong> ১২০০ টাকা</p>
              <p className="mt-1"><strong>🎁 ভর্তি বোনাস:</strong> Grammar in Real Life বই ফ্রি (প্রয়োজনীয় বেসিক গ্রামার + ১০০০ কমন ইংরেজি ভোকাবুলারি)</p>
            </div>

            <div className="mt-6 text-xs opacity-70">
              <p> যারা ইতোমধ্যে অন্য ব্যাচে আছেন তাদের ফরম পূরণ করার প্রয়োজন নেই </p>
            </div>
          </div>
        </div>

        {/* Right column - Details */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div className="bg-base-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold">কোর্সের সারসংক্ষেপ</h3>
              <p className="mt-2 text-sm leading-relaxed">
                এই ব্যাচে নিম্নলিখিত পরিকল্পনা অনুযায়ী ক্লাস করা হবে — সবকিছুই বোর্ড পরীক্ষার দিক থেকে প্রাসঙ্গিক ও কার্যকরীভাবে সাজানো আছে।
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div className="card p-4 bg-white shadow">
                  <h4 className="font-medium">ইংরেজি</h4>
                  <ul className="mt-2 text-sm space-y-1">
                    <li>• Grammar in Real Life - প্রয়োজনীয় অধ্যায়</li>
                    <li>• ইংরেজি ২য় পত্রের গ্রামার টপিক সমাপ্তি</li>
                    <li>• ভোকাবুলারি: টপ-ফ্রিকুয়েন্ট ১০০০টি শব্দ ৩ মাসে শেষ</li>
                    <li>• ১ম ও ২য় পত্র একসাথে কভার</li>
                    <li className='text-gray-600'>যেসব টপিক পড়ানো হবে না: Connector, Fill in the gap with clue and without clue</li>
                  </ul>
                </div>

                <div className="card p-4 bg-white shadow">
                  <h4 className="font-medium">আইসিটি</h4>
                  <p className="mt-2 text-sm">আইসিটির ৬টি অধ্যায় ভালভাবে পড়ানো হবে এবং  টেস্ট পেপার অনুযায়ী MCQ এবং সৃজনশীল প্র্যাকটিস করানো হবে।</p>
                </div>

                <div className="card p-4 bg-white shadow">
                  <h4 className="font-medium">বাংলা</h4>
                  <p className="mt-2 text-sm">বাংলা ১ম পত্রের পদ্যের উপর ক্লাস এবং গদ্য অংশ থেকে নিয়মিত পরীক্ষা নেওয়া হবে।</p>
                </div>

                <div className="card p-4 bg-white shadow">
                  <h4 className="font-medium">অর্থনীতি</h4>
                  <p className="mt-2 text-sm">অর্থনীতি ১ম পত্রের ৬টি অধ্যায় এবং ২য় পত্রের ৭ম অধ্যায় বিশদে পড়ানো হবে; বাকী অধ্যায়ে শুধুমাত্র অনলাইন এক্সাম হবে।</p>
                </div>
              </div>
            </div>

            <div className="bg-base-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold">ক্লাস ও পরীক্ষা ব্যবস্থা</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>• প্রতিদিন গড়ে <strong>২ ঘন্টা ১৫ মিনিট</strong> ক্লাস</li>
                <li>• মাসে মোট <strong>২০টি ক্লাস</strong></li>
                <li>• মাসে <strong>১০টি অনলাইন পরীক্ষা</strong></li>
                <li>• ১টি <strong>১০০ মার্কের ৩ ঘরের পরীক্ষা</strong>সহ মোট ১১টি পরীক্ষা</li>
                <li>• শিক্ষার্থীরা পূর্ণাঙ্গ শিডিউল অনুসারে পড়বে, আলাদা প্রস্তুতির প্রয়োজন নেই</li>
                <li>• মানবিক শাখার প্রায় সকল বিষয় স্টেপ-বাই-স্টেপ ক্লাস ও পরীক্ষার মাধ্যমে সম্পূর্ণ</li>
              </ul>
            </div>

            <div className="bg-base-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold">কেন এই কোর্স?</h3>
              <p className="mt-2 text-sm leading-relaxed text-justify">
                এই কোর্সে আমার তত্ববাধানে সবগুলো বিষয়ে প্রস্তুতি করানো হবে। অর্থাৎ, সকল মানবিক শাখার সবগুলো বিষয় আমি খোঁজ খবর রাখবো এবং প্রয়োজনীয় শিডিউল করে দেব। শিক্ষার্থীরা শুধু নির্দিষ্ট দিনে পড়া শেষ করবে এবং পরীক্ষাগুলো দিবে।
              </p>
            </div>

            <div className="bg-base-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold">কাদের জন্য এই কোর্স নয়?</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>• যারা অলস এবং পড়াশোনার প্রতি আগ্রহ কম</li>
                <li>• যারা অনিয়মিত শিক্ষার্থী</li>
                <li>• যারা ফাঁকিবাজি করে</li>
                <li>• যারা নিয়মিত বাড়িতে পড়াশোনা করে না</li>
              </ul>
            </div>

            <div className="bg-base-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold">অতিরিক্ত তথ্য</h3>
              <ul className="mt-3 space-y-2 text-sm">
                <li>• মানবিক শাখার অন্যান্য সাবজেক্ট থেকে কেবল পরীক্ষা নেওয়া হবে।</li>
                <li>• ক্লাসে নোট, টেস্ট ও রিভিশন সেগমেন্ট থাকবে।</li>
                <li>• নিয়মিতভাবে এসাইনমেন্ট থাকবে এবং এসাইনমেন্টে মার্ক রয়েছে।</li>
              </ul>
            </div>

            <div className="mt-6">
              <a
                href="https://noyon-academy.web.app/signup"
                className="btn btn-primary w-full"
              >
                ভর্তি ফরম পূরণ করুন
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}