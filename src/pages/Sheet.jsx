export default function Sheet() {
  const resources = [
    {
      title: "Grammar in Real Life",
      description:
        "গ্রামার ইন রিয়েল লাইফ মূলত ইংরেজি গ্রামার শেখার একটি সহায়ক গ্রন্থ। এই বইটি বাস্তব জীবনে ইংরেজি ব্যবহারের দক্ষতা গড়ে তুলতে সহায়ক হবে।",
      link: "/grammar.pdf",
    },
    {
      title: "English Writing Workbook",
      description: "for HSC Students: Paragraphs, Compositions, Reports & More",
      link: "/writing.pdf",
    },
    {
      title: "Foundation of Narration",
      description: "for SSC & HSC Students",
      link: "https://docs.google.com/document/d/1k-McAvCwWbYG9k_TH6avGpFZE_K4-0ACurLwKppnyjI/edit?usp=sharing",
    },
  ];

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-20 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
        📚 English Learning Resources
      </h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {resources.map((res, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-6 flex flex-col justify-between group"
          >
            <div>
              <h2 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-red-500 transition-colors duration-300">
                {res.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4">{res.description}</p>
            </div>
            <a
              href={res.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-center bg-red-500 text-white font-medium py-2 px-4 rounded-full w-full hover:bg-red-600 transition-colors duration-300"
            >
              পড়ুন
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
