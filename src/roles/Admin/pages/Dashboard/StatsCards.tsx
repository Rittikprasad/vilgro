import React from "react";
import Totalspos from "../../../../assets/svg/Totalspos.svg";
import Newspos from "../../../../assets/svg/Newspos.svg";

interface StatCardData {
  title: string;
  value: string;
  gradient?: boolean;
}

interface StatsCardsProps {
  data: StatCardData[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((stat, index) => (
        <div
          key={index}
          className={`${
            index === 0
              ? "text-white rounded-lg p-4 shadow-sm"
              : "bg-white rounded-lg p-4 shadow-sm"
          }`}
          style={
            index === 0
              ? {
                  background: "linear-gradient(92.06deg, #46B753 0.02%, #E0DC32 100.02%)",
                }
              : undefined
          }
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              {index === 0 ? (
                <img src={Totalspos} alt="Total SPOs" className="w-12 h-12" />
              ) : (
                <img src={Newspos} alt="New SPOs" className="w-12 h-12" />
              )}
            </div>
            <div className="flex-1">
              <h3 className={`text-[14px] font-[400] font-golos ${index === 0 ? "text-white" : "text-gray-800"}`}>
                {stat.title}
              </h3>
              <p className={`text-2xl font-bold ${index === 0 ? "text-white" : "text-[#46B753]"}`}>
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;

