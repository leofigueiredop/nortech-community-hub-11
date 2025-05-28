import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { PointsProvider } from '@/context/PointsContext';
import { NotificationsProvider } from '@/context/NotificationsContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/context/AuthContext';

// Import pages
import Index from '@/pages/Index';
import LoginPage from '@/pages/auth/login.page';
import InviteAccept from '@/pages/auth/InviteAccept';
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
import CreatePost from '@/pages/CreatePost';
import Discussions from '@/pages/Discussions';
import DiscussionTopic from '@/pages/DiscussionTopic';
import DiscussionDetail from '@/pages/DiscussionDetail';
import Members from '@/pages/Members';
import Matchmaker from '@/pages/Matchmaker';
import PointsPage from '@/pages/PointsPage';
import PointsStore from '@/pages/PointsStore';
import Leaderboard from '@/pages/Leaderboard';

// Import onboarding pages
import Welcome from '@/pages/onboarding/Welcome';
import Creator from '@/pages/onboarding/Creator';
import Community from '@/pages/onboarding/Community';
import CommunityType from '@/pages/onboarding/CommunityType';
import Features from '@/pages/onboarding/Features';
import MembershipPlans from '@/pages/onboarding/MembershipPlans';
import InviteMembers from '@/pages/onboarding/InviteMembers';
import FinalStep from '@/pages/onboarding/FinalStep';

// Auth-protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, community } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return <>{children}</>;
};

// Auth-aware route that redirects to dashboard if already authenticated
const AuthAwareRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <PointsProvider>
            <NotificationsProvider>
              <Routes>
                {/* Public landing page - always accessible */}
                <Route path="/" element={<Index />} />
                
                {/* Onboarding Routes */}
                <Route path="/onboarding">
                  <Route path="welcome" element={<Welcome />} />
                  <Route path="creator" element={<Creator />} />
                  <Route path="community" element={<Community />} />
                  <Route path="type" element={<CommunityType />} />
                  <Route path="features" element={<Features />} />
                  <Route path="plans" element={<MembershipPlans />} />
                  <Route path="invite" element={<InviteMembers />} />
                  <Route path="final" element={<FinalStep />} />
                </Route>
                
                {/* Auth routes - redirect to dashboard if already authenticated */}
                <Route path="/auth/login" element={
                  <AuthAwareRoute>
                    <LoginPage />
                  </AuthAwareRoute>
                } />
                <Route path="/auth/callback" element={
                  <AuthAwareRoute>
                    <LoginPage />
                  </AuthAwareRoute>
                } />
                
                {/* Invite acceptance route - accessible to both authenticated and unauthenticated users */}
                <Route path="/invite" element={<InviteAccept />} />
                
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
                
                <Route path="/create-post" element={
                  <ProtectedRoute>
                    <CreatePost />
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
                    <PointsPage />
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
                
                <Route path="/settings/domain" element={
                  <ProtectedRoute>
                    <Settings.Domain />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings/migration" element={
                  <ProtectedRoute>
                    <Settings.Migration />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings/marketing" element={
                  <ProtectedRoute>
                    <Settings.Marketing />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings/posts" element={
                  <ProtectedRoute>
                    <Settings.Posts />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings/spaces" element={
                  <ProtectedRoute>
                    <Settings.Spaces />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings/moderation" element={
                  <ProtectedRoute>
                    <Settings.Moderation />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings/workflows" element={
                  <ProtectedRoute>
                    <Settings.Workflows />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings/ai-agents" element={
                  <ProtectedRoute>
                    <Settings.AIAgents />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings/points-configuration" element={
                  <ProtectedRoute>
                    <Settings.PointsConfiguration />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings/plans" element={
                  <ProtectedRoute>
                    <Settings.Plans />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings/billing" element={
                  <ProtectedRoute>
                    <Settings.Billing />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings/subscriptions" element={
                  <ProtectedRoute>
                    <Settings.Subscriptions />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings/paywall" element={
                  <ProtectedRoute>
                    <Settings.Paywall />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings/analytics" element={
                  <ProtectedRoute>
                    <Settings.Analytics />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings/affiliates" element={
                  <ProtectedRoute>
                    <Settings.Affiliates />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings/legal" element={
                  <ProtectedRoute>
                    <Settings.Legal />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings/notifications" element={
                  <ProtectedRoute>
                    <Settings.Notifications />
                  </ProtectedRoute>
                } />
                
                {/* Catch-all route for 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <Toaster />
            </NotificationsProvider>
          </PointsProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
