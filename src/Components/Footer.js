import React from "react";
import {
  FaTwitter,
  FaTelegram,
  FaDiscord,
  FaMedium,
  FaGithubAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaTwitter, url: "https://x.com/giants_planet", title: "Twitter" },
    { icon: FaTelegram, url: "https://t.me/giantsplanet", title: "Telegram" },
    {
      icon: FaDiscord,
      url: "https://discord.com/invite/giants-planet",
      title: "Discord",
    },
    {
      icon: FaMedium,
      url: "https://medium.com/@giantsplanet",
      title: "Medium",
    },
    {
      icon: FaGithubAlt,
      url: "https://giants-planet.gitbook.io/diary-of-an-explorer-en/introduction/giants-planet",
      title: "Gitbook",
    },
  ];

  return (
    <>
      {/* Spacer div to prevent content from being hidden */}
      <div className="h-16" /> {/* Adjust height to match footer height */}
      <nav className="fixed bottom-0 left-0 w-full backdrop-blur-md border-t bg-lightgray border-r border-borders2 z-50 px-4 md:px-7">
        <div className="flex flex-row justify-between items-center h-16 text-center md:text-left">
          <div className="text-[9px]  sm:text-sm text-[#666666] ">
            © {currentYear} 2MR Labs PTE. LTD.
          </div>
          <div className="py-2">
            <div className="flex justify-center md:justify-end items-center gap-1 md:gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="sm:p-2 p-1  rounded-md bg-iconcolor text-gray-400 hover:text-primary transition-all duration-300"
                >
                  <social.icon className="md:text-xl text-sm" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Footer;
