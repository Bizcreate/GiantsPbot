import React, { useState } from "react";
import { FaLink } from "react-icons/fa";

const faqs = [
  {
    question: "What is Giants Mission about?",
    answer:
      "Giants Mission rewards users with Points for referring friends and creating content on X.",
  },
  {
    question: "What do the points offer?",
    answer:
      "The more Points earned, the higher your level, the more Token Crates containing BGPS you can claim or get airdropped.",
  },
  {
    question: "How are levels determined?",
    answer:
      "Levels are based on earned Points; each level-up grants you one Token Crate.",
  },
];

const LandingPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center">
      {/* Background Image with Red Overlay */}
      <div className="absolute inset-0 bg-space-mission before:absolute before:inset-0 before:bg-[#C40003] before:opacity-70 before:mix-blend-multiply"></div>

      {/* Header/Navbar - Completely Solid Black */}
      <header className="fixed top-0 left-0 w-full py-3 flex justify-between items-center bg-black z-50">
        <img src="/company.svg" alt="Alpha Dogs" className="w-10 h-7" />
      </header>

      {/* Main Content */}
      <main className="text-center px-4 py-16 max-w-2xl relative z-10">
        <h1 className="text-4xl font-bold mb-4">
          Embark On An Epic Space Mission With Giants
        </h1>
        <p className="text-gray-400 mb-8">
          A short description about the platform. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          {["Sign Up", "Get Rewards"].map((text, index) => (
            <button
              key={index}
              className="relative flex flex-col items-center bg-[#1e1e1e] text-white px-6 py-3 rounded-lg"
            >
              <FaLink className="absolute -top-3 bg-[#1e1e1e] p-1 rounded-full text-red-500 text-xl" />
              <span className="font-semibold">{text}</span>
              <span className="text-xs text-gray-400">
                {index === 0
                  ? "Connect Your X Account"
                  : "Start earning with your X content"}
              </span>
            </button>
          ))}
        </div>

        {/* Join Button */}
        <button className="bg-red-600 px-8 py-3 rounded-lg text-white font-bold">
          Join with X Account
        </button>
        <p className="text-gray-500 text-sm mt-2">
          By connecting X, you agree to Giants{" "}
          <span className="text-white">Terms of Use</span> and{" "}
          <span className="text-white">Privacy Policy</span>
        </p>
      </main>

      {/* FAQs Section - Now an Accordion */}
      <section className="w-full max-w-2xl p-4 relative z-10">
        <h2 className="text-2xl font-bold text-center mb-4">FAQs</h2>
        {faqs.map((faq, index) => (
          <div key={index} className="bg-cards2 p-4 rounded-lg mb-2">
            {/* Question - Click to Toggle */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full text-left font-semibold flex justify-between items-center"
            >
              {index + 1}. {faq.question}
              <span className="text-red-500">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>

            {/* Answer - Show/Hide Based on State */}
            <div
              className={`text-gray-400 overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-40 mt-2" : "max-h-0 opacity-0"
              }`}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default LandingPage;
