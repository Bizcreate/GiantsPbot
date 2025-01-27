import React from "react";

export const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`${sizeClasses[size]} animate-spin ${className}`}>
      <div className="h-full w-full border-4 border-t-accent border-r-accent border-b-accent border-l-transparent rounded-full" />
    </div>
  );
};
