import React from 'react';
import { Navigate } from 'react-router-dom';

const UserSettingsIndex = () => {
  return <Navigate to="/profile/settings/profile" replace />;
};

export default UserSettingsIndex; 