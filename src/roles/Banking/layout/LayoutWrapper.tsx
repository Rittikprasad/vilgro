import React from "react";
import Navbar from "./Navbar";

interface BankingLayoutWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const BankingLayoutWrapper: React.FC<BankingLayoutWrapperProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`min-h-screen bg-[#F8F6F0] ${className}`}>
      <Navbar />

      <main className="px-16 py-4">{children}</main>
    </div>
  );
};

export default BankingLayoutWrapper;

