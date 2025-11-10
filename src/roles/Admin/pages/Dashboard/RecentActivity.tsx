import React from "react";

interface ActivityItem {
  message: string;
  timeAgo: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-[16px] font-[500] font-golos text-gray-900 mb-1">Recent Activity</h3>
      <p className="text-[14px] font-[400] font-golos text-gray-400 mb-4">
        Latest platform Updates and changes
      </p>
      
      {activities.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-[13px] font-[400] font-golos text-gray-500">
          No recent activity yet.
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
              <p className="text-[14px] font-[400] font-golos text-gray-600">{activity.message}</p>
              <p className="text-[12px] font-[400] font-golos text-gray-400 mt-1">{activity.timeAgo}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;

