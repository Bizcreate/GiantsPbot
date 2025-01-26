import React from "react";
import { motion } from "framer-motion";
import {
  FaTwitter,
  FaTelegram,
  FaDiscord,
  FaMedium,
  FaGithubAlt,
} from "react-icons/fa";

const SocialLinks = () => {
  const socialLinks = [
    { icon: FaTwitter, url: "https://x.com/giants_planet", name: "Twitter" },
    { icon: FaTelegram, url: "https://t.me/giantsplanet", name: "Telegram" },
    {
      icon: FaDiscord,
      url: "https://discord.com/invite/giants-planet",
      name: "Discord",
    },
    { icon: FaMedium, url: "https://medium.com/@giantsplanet", name: "Medium" },
    {
      icon: FaGithubAlt,
      url: "https://giants-planet.gitbook.io/diary-of-an-explorer-en/introduction/giants-planet",
      name: "Gitbook",
    },
  ];

  return (
    <div className="flex justify-end gap-6">
      <div className="flex items-center gap-2">
        <span className="text-gray-500 mr-7">Follow us</span>
        {socialLinks.map((social, index) => (
          <motion.a
            key={index}
            href={social.url}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 bg-cards rounded-full text-gray-500 hover:bg-accent hover:text-white transition-all duration-300"
          >
            <social.icon className="text-2xl" />
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default SocialLinks;
