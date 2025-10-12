import React from 'react';
import LayoutWrapper from '../layout/LayoutWrapper';

const AdminsPage: React.FC = () => {
  return (
    <LayoutWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admins Management</h1>
          <p className="text-gray-600 mt-1">Manage admin users</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <p className="text-gray-600">Admins management content will be displayed here</p>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default AdminsPage;
