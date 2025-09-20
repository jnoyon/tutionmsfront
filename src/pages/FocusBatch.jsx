
export default function FocusBatch() {
  return (
    <section className="max-w-4xl mx-auto p-6 sm:p-10">
      <div className="card bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4">ফোকাস ব্যাচ</h2>
        <p className="text-sm mb-4">
          যাদের নির্দিষ্ট সাবজেক্টগুলোতে সমস্যা রয়েছে তাদের জন্য এই ব্যাচ সেরা। এই ব্যাচে শিক্ষার্থীরা মূল বিষয়গুলোতে ফোকাস করে প্রস্তুতি নেবে।
        </p>

        <ul className="space-y-3 text-sm mb-4">
          <li>• প্রতিদিন <strong>১ ঘন্টা</strong> ক্লাস, যেখানে তিনটি গুরুত্বপূর্ণ বিষয় পরীক্ষাভিত্তিকভাবে পড়ানো হবে।</li>
          <li>• প্রতি মাসে <strong>২০টি ক্লাস</strong></li>
          <li>• প্রতি মাসে <strong>৩টি অনলাইন এক্সাম</strong></li>
          <li>• মাস শেষে <strong>৩ ঘন্টার পরীক্ষা</strong></li>
          <li>• মাসিক ফি: <strong>৬০০ টাকা</strong></li>
          <li>• মাসিক পুরষ্কার বিতরণ থাকবে।</li>
        </ul>

        <div className="mt-6">
          <a
            href="https://noyon-academy.web.app/signup"
            className="btn btn-primary w-full"
          >
            ভর্তি ফরম পূরণ করুন
          </a>
        </div>
      </div>
    </section>
  )
}