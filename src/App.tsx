import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import Spaces from './pages/Spaces';
import Feed from './pages/Feed';
import LearningPath from './pages/Learning';
import Notifications from './pages/Notifications';
import Activity from './pages/Activity';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/spaces" element={<Spaces />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/learning" element={<LearningPath />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/activity" element={<Activity />} />
      </Routes>
    </Router>
  );
}

export default App;
