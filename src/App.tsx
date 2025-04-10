
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Feed from './pages/Feed';
import { PointsProvider } from './context/PointsContext';
import { NotificationsProvider } from './context/NotificationsContext';

// Create simple placeholder components for missing pages
const Placeholder: React.FC<{ name: string }> = ({ name }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">{name} Page</h1>
      <p className="text-gray-600">This page is under construction</p>
    </div>
  );
};

// Placeholder pages
const Explore = () => <Placeholder name="Explore" />;
const Spaces = () => <Placeholder name="Spaces" />;
const LearningPath = () => <Placeholder name="Learning" />;
const Notifications = () => <Placeholder name="Notifications" />;
const Activity = () => <Placeholder name="Activity" />;

function App() {
  return (
    <NotificationsProvider>
      <PointsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/spaces" element={<Spaces />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/learning" element={<LearningPath />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/activity" element={<Activity />} />
          </Routes>
        </Router>
      </PointsProvider>
    </NotificationsProvider>
  );
}

export default App;
