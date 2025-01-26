import React from "react";
import { motion } from "framer-motion";

const PageSpinner = () => {
  return (
    <div className="fixed left-0 right-0 top-0 bottom-0 flex w-full items-center justify-center z-[60] bg-cards/80 backdrop-blur-sm">
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <motion.img
          alt="daxy"
          src="/stars.png"
          className="w-[200px]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
      <motion.div
        className="absolute"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-[250px] h-[250px] rounded-full border-2 border-accent/30" />
      </motion.div>
    </div>
  );
};

export default PageSpinner;
