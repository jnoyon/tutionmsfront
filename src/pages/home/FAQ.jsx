import Accordion from "../../components/Accordion";

export default function FAQ() {
  return (
    <div className="border border-gray-200 p-2 rounded-md">
      <h2 className="text-center text-2xl font-bold mb-2"> <span className="text-red-500">প্র</span>শ্নোত্তর</h2>
      <Accordion
        heading="প্রতিদিন কয়টি ক্লাস হবে?"
        content="প্রতিদিন ২-৩টি ক্লাস হবে। ইংরেজি ক্লাস প্রতিদিনই থাকবে।"
      />
      <Accordion
        heading="মোবাইল না থাকলে অনলাইনে এক্সাম কিভাবে দিবো?"
        content="মোবাইল থাকা বাধ্যতামূলক নয়। আপনার বাসায় যদি কারও মোবাইল না থাকে তাহলে অনলাইন পরীক্ষাগুলো না দিলেও সমস্যা নেই।"
      />
    </div>
  );
}
