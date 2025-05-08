import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { PointsProvider } from '@/context/PointsContext';
import { NotificationsProvider } from '@/context/NotificationsContext';
import { Toaster } from '@/components/ui/toaster';
import { useAuth } from '@/context/AuthContext';
import AdminRoute from '@/components/AdminRoute';

// Import pages
import Index from '@/pages/Index';
import LoginPage from '@/pages/auth/login.page';
import Dashboard from '@/pages/Dashboard';
import Library from '@/pages/Library';
import CourseViewer from '@/pages/CourseViewer';
import LibraryContentManagement from '@/pages/ContentManagement';
import Events from '@/pages/Events';
import EventsCalendar from '@/pages/EventsCalendar';
import Analytics from '@/pages/Analytics';
import ContentCreatorDashboard from '@/pages/ContentCreatorDashboard';

// Import onboarding pages
import Welcome from '@/pages/onboarding/Welcome';
import Community from '@/pages/onboarding/Community';
import CommunityType from '@/pages/onboarding/CommunityType';
import Creator from '@/pages/onboarding/Creator';
import Features from '@/pages/onboarding/Features';
import InviteMembers from '@/pages/onboarding/InviteMembers';
import MembershipPlans from '@/pages/onboarding/MembershipPlans';
import FinalStep from '@/pages/onboarding/FinalStep';

// Import settings components
import SettingsLayout from '@/components/settings/SettingsLayout';
import ProfileSettings from '@/components/settings/ProfileSettings';
import CommunitySettings from '@/components/settings/CommunitySettings';
import UserManagement from '@/components/settings/UserManagement';
import ContentManagement from '@/components/settings/ContentManagement';
import RoleManagement from '@/components/settings/RoleManagement';
import AdvancedSettings from '@/components/settings/AdvancedSettings';
import GeneralSettings from '@/components/settings/GeneralSettings';
import BrandingSettings from '@/components/settings/BrandingSettings';
import DomainSettings from '@/components/settings/DomainSettings';
import MigrationSettings from '@/components/settings/MigrationSettings';

// Import other pages
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
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user || !community) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return <>{children}</>;
};

// Auth route wrapper - prevents authenticated users from accessing auth pages
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, community } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (user && community) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Onboarding route wrapper - allows access until user creation, then requires auth
const OnboardingRoute = ({ children, requireAuth = false }: { children: React.ReactNode, requireAuth?: boolean }) => {
  const { user, isLoading, community } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If route requires auth and user is not authenticated, redirect to login
  if (requireAuth && (!user || !community)) {
    return <Navigate to="/auth/login" replace />;
  }

  // If user is fully authenticated (has community), redirect to dashboard
  if (user && community) {
    return <Navigate to="/dashboard" replace />;
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
              {/* Public route - only Index */}
              <Route path="/" element={<Index />} />
              
              {/* Auth routes */}
              <Route path="/auth/login" element={
                <AuthRoute>
                  <LoginPage />
                </AuthRoute>
              } />
              <Route path="/auth/callback" element={<LoginPage />} />

              {/* Onboarding routes */}
              <Route path="/onboarding">
                <Route index element={
                  <OnboardingRoute>
                    <Welcome />
                  </OnboardingRoute>
                } />
                <Route path="community" element={
                  <OnboardingRoute>
                    <Community />
                  </OnboardingRoute>
                } />
                <Route path="community-type" element={
                  <OnboardingRoute>
                    <CommunityType />
                  </OnboardingRoute>
                } />
                <Route path="creator" element={
                  <OnboardingRoute>
                    <Creator />
                  </OnboardingRoute>
                } />
                <Route path="features" element={
                  <OnboardingRoute requireAuth>
                    <Features />
                  </OnboardingRoute>
                } />
                <Route path="invite" element={
                  <OnboardingRoute requireAuth>
                    <InviteMembers />
                  </OnboardingRoute>
                } />
                <Route path="plans" element={
                  <OnboardingRoute requireAuth>
                    <MembershipPlans />
                  </OnboardingRoute>
                } />
                <Route path="final" element={
                  <OnboardingRoute requireAuth>
                    <FinalStep />
                  </OnboardingRoute>
                } />
              </Route>
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
              <Route path="/course/:id" element={<ProtectedRoute><CourseViewer /></ProtectedRoute>} />
              <Route path="/content" element={<ProtectedRoute><LibraryContentManagement /></ProtectedRoute>} />
              <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
              <Route path="/events/calendar" element={<ProtectedRoute><EventsCalendar /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/creator" element={<ProtectedRoute><ContentCreatorDashboard /></ProtectedRoute>} />
              <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
              <Route path="/discussions" element={<ProtectedRoute><Discussions /></ProtectedRoute>} />
              <Route path="/discussions/:topicId" element={<ProtectedRoute><DiscussionTopic /></ProtectedRoute>} />
              <Route path="/discussions/:topicId/:discussionId" element={<ProtectedRoute><DiscussionDetail /></ProtectedRoute>} />
              <Route path="/members" element={<ProtectedRoute><Members /></ProtectedRoute>} />
              <Route path="/matchmaker" element={<ProtectedRoute><Matchmaker /></ProtectedRoute>} />
              <Route path="/points" element={<ProtectedRoute><PointsDashboard /></ProtectedRoute>} />
              <Route path="/points/store" element={<ProtectedRoute><PointsStore /></ProtectedRoute>} />
              <Route path="/points/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />

              {/* Settings routes - protected + role check */}
              <Route path="/settings" element={
                <ProtectedRoute>
                  <AdminRoute requiredRole="moderator">
                    <SettingsLayout />
                  </AdminRoute>
                </ProtectedRoute>
              }>
                <Route index element={<GeneralSettings />} />
                <Route path="general" element={<GeneralSettings />} />
                <Route path="branding" element={<BrandingSettings />} />
                <Route path="domain" element={<DomainSettings />} />
                <Route path="migration" element={<MigrationSettings />} />
                
                <Route path="profile" element={<ProfileSettings />} />
                <Route path="community" element={<CommunitySettings />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="content" element={<ContentManagement />} />
                <Route path="roles" element={<RoleManagement />} />
                <Route path="advanced" element={<AdvancedSettings />} />
              </Route>
              
              {/* Catch-all route redirects to login if not authenticated */}
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
