import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { RiHome5Line, RiHome5Fill } from "react-icons/ri";
import { HiOutlineUsers, HiUsers } from "react-icons/hi2";
import { BiTrophy } from "react-icons/bi";
import {
  FaTasks,
  FaTrophy,
  FaTwitter,
  FaTelegram,
  FaDiscord,
  FaMedium,
  FaGithubAlt,
} from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { RiUserFill } from "react-icons/ri";

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
    <nav className="fixed bottom-0 left-0 w-full backdrop-blur-md border-t  bg-cards border-r border-borders2 z-50">
      <div className="max-w-screen-xl flex flex-row justify-between items-center mx-auto px-4">
        <div className="text-sm text-[#666666]">
          © {currentYear} 2MR Labs PTE. LTD.
        </div>
        <div className="grid grid-cols-2 py-2">
          {/* Social Links */}
          <div className="flex justify-between items-center gap-3">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full text-gray-400 hover:text-primary transition-all duration-300"
              >
                <social.icon className="text-xl" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Footer;
