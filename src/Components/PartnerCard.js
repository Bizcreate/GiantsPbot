import React from "react";
import { motion } from "framer-motion";

const PartnerCard = ({ companyImage, name, description, projectLink }) => {
  return (
    <motion.div
      whileHover="hover"
      initial="initial"
      className="relative h-[200px] w-full group"
    >
      {/* Background Image with Gradient Overlay */}
      <motion.div
        className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden"
        variants={{
          hover: { scale: 1.05 },
          initial: { scale: 1 },
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Updated gradient overlay with ambient colors */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-accent/10 via-transparent to-transparent z-10" />
        <motion.img
          src={companyImage}
          alt={name}
          className="w-full h-full object-cover"
          variants={{
            hover: { scale: 1.1 },
            initial: { scale: 1 },
          }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-20 h-full flex flex-col justify-end p-8"
        variants={{
          hover: { y: -10 },
          initial: { y: 0 },
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Softer glowing circle behind title */}
        <motion.div
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[200%] h-[200px] bg-accent/10 rounded-full blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          variants={{
            hover: { scale: 1.2 },
            initial: { scale: 0.8 },
          }}
        />

        {/* Title with softer animation */}
        <div className="overflow-hidden">
          <motion.h3
            className="text-primary font-medium text-2xl mb-3"
            variants={{
              hover: { y: 0 },
              initial: { y: 20 },
            }}
          >
            {name}
          </motion.h3>
        </div>

        {/* Description with softer fade */}
        <motion.p
          className="text-gray-300/90 text-sm mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          variants={{
            hover: { y: 0, opacity: 1 },
            initial: { y: 20, opacity: 0 },
          }}
        >
          {description}
        </motion.p>

        {/* Link with subtle animation */}
        {projectLink && (
          <motion.a
            href={projectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent/90 font-normal text-sm group/link"
            variants={{
              hover: { x: 0, opacity: 1 },
              initial: { x: -20, opacity: 0 },
            }}
          >
            <span className="relative">
              Explore Partner
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent/70 group-hover/link:w-full transition-all duration-300" />
            </span>
            <motion.span
              variants={{
                hover: { x: 5 },
                initial: { x: 0 },
              }}
            >
              →
            </motion.span>
          </motion.a>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PartnerCard;
