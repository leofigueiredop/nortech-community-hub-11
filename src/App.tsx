import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { PointsProvider } from '@/context/PointsContext';
import { NotificationsProvider } from '@/context/NotificationsContext';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/context/AuthContext';

// Import pages
import LoginPage from '@/pages/auth/login.page';
import Dashboard from '@/pages/Dashboard';
import Library from '@/pages/Library';
import CourseViewer from '@/pages/CourseViewer';
import ContentManagement from '@/pages/ContentManagement';
import Events from '@/pages/Events';
import EventsCalendar from '@/pages/EventsCalendar';
import Analytics from '@/pages/Analytics';
import ContentCreatorDashboard from '@/pages/ContentCreatorDashboard';
import SettingsIndex from '@/pages/settings';
import * as Settings from '@/pages/settings';

// Import pages that were missing routes
import Feed from '@/pages/Feed';
import Discussions from '@/pages/Discussions';
import DiscussionTopic from '@/pages/DiscussionTopic';
import DiscussionDetail from '@/pages/DiscussionDetail';
import Members from '@/pages/Members';
import Matchmaker from '@/pages/Matchmaker';
import PointsDashboard from '@/pages/PointsDashboard';
import PointsStore from '@/pages/PointsStore';
import Leaderboard from '@/pages/Leaderboard';

// Auth-protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, community } = useAuth();
  
  // Check localStorage for a smoother UX (before auth state is fully loaded)
  const hasStoredCommunityId = Boolean(localStorage.getItem('currentCommunityId'));
  
  // Improved fallback auth check
  const hasFallbackAuth = Boolean(user) || Boolean(community) || hasStoredCommunityId;
  
  if (isLoading) {
    // Show loading spinner or skeleton while checking auth
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Only redirect if no auth methods are available
  if (!hasFallbackAuth) {
    console.log('No authentication found, redirecting to login');
    return <Navigate to="/auth/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PointsProvider>
          <NotificationsProvider>
            <Routes>
              {/* Auth pages */}
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/callback" element={<LoginPage />} />
              
              {/* Public routes */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Protected app routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/library" element={
                <ProtectedRoute>
                  <Library />
                </ProtectedRoute>
              } />
              
              <Route path="/course/:id" element={
                <ProtectedRoute>
                  <CourseViewer />
                </ProtectedRoute>
              } />
              
              <Route path="/content" element={
                <ProtectedRoute>
                  <ContentManagement />
                </ProtectedRoute>
              } />
              
              <Route path="/events" element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              } />
              
              <Route path="/events/calendar" element={
                <ProtectedRoute>
                  <EventsCalendar />
                </ProtectedRoute>
              } />
              
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } />
              
              <Route path="/creator" element={
                <ProtectedRoute>
                  <ContentCreatorDashboard />
                </ProtectedRoute>
              } />
              
              {/* Add routes with correct components */}
              <Route path="/posts" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/feed" element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              } />
              
              <Route path="/discussions" element={
                <ProtectedRoute>
                  <Discussions />
                </ProtectedRoute>
              } />
              
              <Route path="/discussions/:topicId" element={
                <ProtectedRoute>
                  <DiscussionTopic />
                </ProtectedRoute>
              } />
              
              <Route path="/discussions/:topicId/:discussionId" element={
                <ProtectedRoute>
                  <DiscussionDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/members" element={
                <ProtectedRoute>
                  <Members />
                </ProtectedRoute>
              } />
              
              <Route path="/matchmaker" element={
                <ProtectedRoute>
                  <Matchmaker />
                </ProtectedRoute>
              } />
              
              <Route path="/points" element={
                <ProtectedRoute>
                  <PointsDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/points/store" element={
                <ProtectedRoute>
                  <PointsStore />
                </ProtectedRoute>
              } />
              
              <Route path="/points/leaderboard" element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              } />
              
              {/* Settings routes */}
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsIndex />
                </ProtectedRoute>
              } />
              
              <Route path="/settings/general" element={
                <ProtectedRoute>
                  <Settings.General />
                </ProtectedRoute>
              } />
              
              <Route path="/settings/branding" element={
                <ProtectedRoute>
                  <Settings.Branding />
                </ProtectedRoute>
              } />
              
              <Route path="/settings/points" element={
                <ProtectedRoute>
                  <Settings.PointsConfiguration />
                </ProtectedRoute>
              } />
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<Navigate to="/auth/login" replace />} />
            </Routes>
            
            <Toaster />
          </NotificationsProvider>
        </PointsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
