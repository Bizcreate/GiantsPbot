import React from "react";
import { motion } from "framer-motion";

const InfoCard = ({ title, value, icon: Icon, description }) => {
  return (
    <div className="bg-cards p-6 rounded-xl border border-borders2 hover:border-accent/40 transition-all h-[180px] cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-accent text-lg font-medium">{title}</h3>
        <Icon className="text-accent text-xl" />
      </div>
      <p className="text-cardtext text-2xl font-bold mb-2">{value}</p>
      {description && <p className="text-dimtext text-sm">{description}</p>}
    </div>
  );
};

export default InfoCard;
