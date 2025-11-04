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
      <h3 className="text-lg font-semibold text-gray-800 mb-1">Recent Activity</h3>
      <p className="text-sm text-gray-600 mb-4">
        Latest platform Updates and changes
      </p>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
            <p className="text-sm font-medium text-gray-800">{activity.message}</p>
            <p className="text-xs text-gray-500 mt-1">{activity.timeAgo}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;

