import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageSpinner from "../Components/Spinner";
import { useUserAuth } from "../context/UserAuthContext";

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

  const { user } = useUserAuth();
  const navigate = useNavigate();



  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 sm:px-6  lg:px-8 bg-space-mission-sm sm:bg-space-mission ">
      {/* Background Image with Red Overlay */}
      <div className="absolute inset-0 before:absolute before:inset-0 before:bg-[#C40003] before:opacity-70 before:mix-blend-multiply"></div>

      {/* Header/Navbar */}
      <header className="fixed top-0 left-0 w-full py-4 flex justify-between items-center bg-black px-6 md:px-12 z-50">
        <img src="/company.svg" alt="Alpha Dogs" className="w-10 h-7" />
      </header>

      {/* Main Content */}
      <main className="text-center sm:py-16 pt-24 pb-14 max-w-3xl relative z-10">
        <h1 className="text-2xl md:text-5xl font-bold mb-6 leading-tight">
          Embark On An Epic Space Mission With Giants
        </h1>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-8 ">
          A short description about the platform. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          labore et dolore magna aliqua.
        </p>

        {/* Buttons */}
        <div className="flex sm:flex-row flex-col items-center justify-center gap-4 mb-6">
          {[
            {
              text: user ? "Profile Dashboard" : "Sign Up",
              subtext: user ? "View Your Progress" : "Connect Your X Account",
              onClick: () => user ? navigate('/dashboard') : null
            },
            {
              text: "Get Rewards",
              subtext: "Start earning with your X content",
            },
          ].map((btn, index) => (
            <>
              <button
                key={index}
                onClick={btn.onClick}
                className="relative xl:w-64 justify-center lg:h-24 flex flex-col h-28 items-center sm:w-44 w-60 bg-lightgray border border-newborder4 text-white md:px-6 px-3 py-3 rounded-2xl "
              >
                {index == 0 ? (
                  <div className="flex size-8 flex-row absolute -top-3 rounded-full bg-[#1e1e1e] p-1  text-red-500 text-xl justify-start items-center ">
                    {/* svg  */}
                  </div>
                ) : (
                  <div className="flex size-8 flex-row absolute -top-3 rounded-full bg-[#1e1e1e] p-1  text-red-500 text-xl justify-start items-center ">
                    {/* svg  */}
                  </div>
                )}

                <span className="font-semibold">{btn.text}</span>
                <span className="text-xs text-gray-400">{btn.subtext}</span>
              </button>
              {index === 0 && (
                <div className="py-1 sm:hidden">
                  <svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.5 13L0.138786 0.249999L14.8612 0.25L7.5 13Z" fill="white" />
                  </svg>
                </div>
              )}
            </>
          ))}
        </div>

        {/* Join Button */}
        <button className="bg-red-600 px-8 py-3 w-62  rounded-lg text-white font-bold sm:w-auto">
          Join with X Account
        </button>
        <p className="text-gray-300 text-xs sm:text-sm mt-2">
          By connecting X, you agree to Giants{" "}
          <span className="text-white font-semibold">Terms of Use</span> and
          <span className="text-white font-semibold"> Privacy Policy</span>
        </p>
      </main>

      {/* FAQs Section - Now an Accordion */}
      <section className="w-full max-w-3xl p-4 relative z-10">
        <h2 className="text-2xl font-bold text-center mb-4">FAQs</h2>
        {faqs.map((faq, index) => (
          <div key={index} className="bg-box2 p-4 rounded-lg mb-2">
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
              className={`text-gray-400  overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index
                ? "max-h-40 mt-2 opacity-100"
                : "max-h-0 opacity-0"
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
