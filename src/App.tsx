import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Library from '@/pages/Library';
import CourseViewer from '@/pages/CourseViewer';
import Events from '@/pages/Events';
import EventsCalendar from '@/pages/EventsCalendar';
import EventsWeekly from '@/pages/EventsWeekly';
import CreateEvent from '@/pages/CreateEvent';
import Feed from '@/pages/Feed';
import Discussions from '@/pages/Discussions';
import DiscussionTopic from '@/pages/DiscussionTopic';
import DiscussionDetail from '@/pages/DiscussionDetail';
import CreatePost from '@/pages/CreatePost';
import TagPage from '@/pages/TagPage';
import UserProfile from '@/pages/UserProfile';
import Members from '@/pages/Members';
import CreateSpace from '@/pages/CreateSpace';
import PointsStore from '@/pages/PointsStore';
import PointsDashboard from '@/pages/PointsDashboard';
import OnboardingLayout from '@/pages/OnboardingLayout';
import CommunityType from '@/pages/onboarding/CommunityType';
import Community from '@/pages/onboarding/Community';
import Creator from '@/pages/onboarding/Creator';
import Features from '@/pages/onboarding/Features';
import MembershipPlans from '@/pages/onboarding/MembershipPlans';
import InviteMembers from '@/pages/onboarding/InviteMembers';
import FinalStep from '@/pages/onboarding/FinalStep';
import Welcome from '@/pages/onboarding/Welcome';
import Leaderboard from '@/pages/Leaderboard';
import Analytics from '@/pages/Analytics';
import ContentCreatorDashboard from '@/pages/ContentCreatorDashboard';
import ContentManagement from '@/pages/ContentManagement';
import Matchmaker from '@/pages/Matchmaker';
import NotFound from '@/pages/NotFound';
import { PointsProvider } from '@/context/PointsContext';
import { NotificationsProvider } from '@/context/NotificationsContext';
import { AuthProvider } from '@/context/AuthContext';
import SettingsIndex from '@/pages/settings';
import * as Settings from '@/pages/settings';
import LiveStreams from '@/pages/LiveStreams';
import LoginPage from '@/pages/auth/login.page';
import CallbackPage from '@/pages/auth/callback.page';

// Import User Settings Components that have been transferred
import UserSettingsIndex from '@/pages/user-settings/UserSettingsIndex';
import UserSettingsProfile from '@/pages/user-settings/UserSettingsProfile';
import UserSettingsNotifications from '@/pages/user-settings/UserSettingsNotifications';
import UserSettingsPrivacy from '@/pages/user-settings/UserSettingsPrivacy';

import AuthOnboardingLayout from '@/pages/auth/OnboardingLayout';
import Step1CommunityContext from '@/pages/auth/Step1CommunityContext';
import Step2Authentication from '@/pages/auth/Step2Authentication';
import Step3ProfileSetup from '@/pages/auth/Step3ProfileSetup';
import Step4AccessLevel from '@/pages/auth/Step4AccessLevel';
import Step5Interests from '@/pages/auth/Step5Interests';
import Step6Engagement from '@/pages/auth/Step6Engagement';
import Step7Completion from '@/pages/auth/Step7Completion';
import EmailConfirmation from '@/pages/auth/EmailConfirmation';
import { PrivateRoute } from '@/components/PrivateRoute';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PointsProvider>
          <NotificationsProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/callback" element={<CallbackPage />} />
              
              {/* Protected Routes */}
              <Route path="/platform" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/library" element={
                <PrivateRoute>
                  <Library />
                </PrivateRoute>
              } />
              
              {/* Course Viewer Routes */}
              <Route path="/course/:courseId" element={
                <PrivateRoute>
                  <CourseViewer />
                </PrivateRoute>
              } />
              <Route path="/course/:courseId/:lessonId" element={
                <PrivateRoute>
                  <CourseViewer />
                </PrivateRoute>
              } />
              
              {/* Content Management Route */}
              <Route path="/content-management" element={
                <PrivateRoute>
                  <ContentManagement />
                </PrivateRoute>
              } />
              
              {/* Events Routes */}
              <Route path="/events" element={
                <PrivateRoute>
                  <Events />
                </PrivateRoute>
              } />
              <Route path="/events/calendar" element={
                <PrivateRoute>
                  <EventsCalendar />
                </PrivateRoute>
              } />
              <Route path="/events/weekly" element={
                <PrivateRoute>
                  <EventsWeekly />
                </PrivateRoute>
              } />
              <Route path="/create-event" element={
                <PrivateRoute>
                  <CreateEvent />
                </PrivateRoute>
              } />
              
              {/* Community Routes */}
              <Route path="/feed" element={
                <PrivateRoute>
                  <Feed />
                </PrivateRoute>
              } />
              <Route path="/discussions" element={
                <PrivateRoute>
                  <Discussions />
                </PrivateRoute>
              } />
              <Route path="/discussions/:topicId" element={
                <PrivateRoute>
                  <DiscussionTopic />
                </PrivateRoute>
              } />
              <Route path="/discussions/:topicId/:discussionId" element={
                <PrivateRoute>
                  <DiscussionDetail />
                </PrivateRoute>
              } />
              <Route path="/create-post" element={
                <PrivateRoute>
                  <CreatePost />
                </PrivateRoute>
              } />
              <Route path="/tag/:tagName" element={
                <PrivateRoute>
                  <TagPage />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              } />
              <Route path="/members" element={
                <PrivateRoute>
                  <Members />
                </PrivateRoute>
              } />
              <Route path="/create-space" element={
                <PrivateRoute>
                  <CreateSpace />
                </PrivateRoute>
              } />
              <Route path="/matchmaker" element={
                <PrivateRoute>
                  <Matchmaker />
                </PrivateRoute>
              } />
              <Route path="/live-streams" element={
                <PrivateRoute>
                  <LiveStreams />
                </PrivateRoute>
              } />
              
              {/* Points & Rewards Routes */}
              <Route path="/points" element={
                <PrivateRoute>
                  <PointsDashboard />
                </PrivateRoute>
              } />
              <Route path="/points-dashboard" element={
                <PrivateRoute>
                  <PointsDashboard />
                </PrivateRoute>
              } />
              <Route path="/points/store" element={
                <PrivateRoute>
                  <PointsStore />
                </PrivateRoute>
              } />
              <Route path="/points-store" element={
                <PrivateRoute>
                  <PointsStore />
                </PrivateRoute>
              } />
              <Route path="/leaderboard" element={
                <PrivateRoute>
                  <Leaderboard />
                </PrivateRoute>
              } />
              
              {/* Auth Routes */}
              <Route path="/auth" element={<AuthOnboardingLayout />}>
                <Route path="" element={<Step1CommunityContext />} />
                <Route path=":communityId" element={<Step1CommunityContext />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="confirm-email" element={<EmailConfirmation />} />
                <Route path="profile-setup" element={<Step3ProfileSetup />} />
                <Route path="access-level" element={<Step4AccessLevel />} />
                <Route path="interests" element={<Step5Interests />} />
                <Route path="engagement" element={<Step6Engagement />} />
                <Route path="completion" element={<Step7Completion />} />
              </Route>
              
              {/* Onboarding Routes */}
              <Route path="/onboarding" element={
                <PrivateRoute>
                  <OnboardingLayout />
                </PrivateRoute>
              }>
                <Route path="" element={<Welcome />} />
                <Route path="creator" element={<Creator />} />
                <Route path="community-type" element={<CommunityType />} />
                <Route path="community" element={<Community />} />
                <Route path="features" element={<Features />} />
                <Route path="membership-plans" element={<MembershipPlans />} />
                <Route path="invite-members" element={<InviteMembers />} />
                <Route path="final-step" element={<FinalStep />} />
              </Route>
              
              {/* Analytics and Dashboard Routes */}
              <Route path="/analytics" element={
                <PrivateRoute>
                  <Analytics />
                </PrivateRoute>
              } />
              <Route path="/content-creator-dashboard" element={
                <PrivateRoute>
                  <ContentCreatorDashboard />
                </PrivateRoute>
              } />
              
              {/* Settings Routes */}
              <Route path="/settings" element={
                <PrivateRoute>
                  <SettingsIndex />
                </PrivateRoute>
              } />
              <Route path="/settings/general" element={
                <PrivateRoute>
                  <Settings.General />
                </PrivateRoute>
              } />
              <Route path="/settings/branding" element={
                <PrivateRoute>
                  <Settings.Branding />
                </PrivateRoute>
              } />
              <Route path="/settings/integration" element={
                <PrivateRoute>
                  <Settings.Integration />
                </PrivateRoute>
              } />
              <Route path="/settings/domain" element={
                <PrivateRoute>
                  <Settings.Domain />
                </PrivateRoute>
              } />
              <Route path="/settings/points-configuration" element={
                <PrivateRoute>
                  <Settings.PointsConfiguration />
                </PrivateRoute>
              } />
              <Route path="/settings/migration" element={
                <PrivateRoute>
                  <Settings.Migration />
                </PrivateRoute>
              } />
              <Route path="/settings/ai-agents" element={
                <PrivateRoute>
                  <Settings.AIAgents />
                </PrivateRoute>
              } />
              <Route path="/settings/notifications" element={
                <PrivateRoute>
                  <Settings.Notifications />
                </PrivateRoute>
              } />
              <Route path="/settings/plans" element={
                <PrivateRoute>
                  <Settings.Plans />
                </PrivateRoute>
              } />
              <Route path="/settings/paywall" element={
                <PrivateRoute>
                  <Settings.Paywall />
                </PrivateRoute>
              } />
              <Route path="/settings/subscriptions" element={
                <PrivateRoute>
                  <Settings.Subscriptions />
                </PrivateRoute>
              } />
              <Route path="/settings/legal" element={
                <PrivateRoute>
                  <Settings.Legal />
                </PrivateRoute>
              } />
              <Route path="/settings/marketing" element={
                <PrivateRoute>
                  <Settings.Marketing />
                </PrivateRoute>
              } />
              <Route path="/settings/posts" element={
                <PrivateRoute>
                  <Settings.Posts />
                </PrivateRoute>
              } />
              <Route path="/settings/spaces" element={
                <PrivateRoute>
                  <Settings.Spaces />
                </PrivateRoute>
              } />
              <Route path="/settings/moderation" element={
                <PrivateRoute>
                  <Settings.Moderation />
                </PrivateRoute>
              } />
              <Route path="/settings/workflows" element={
                <PrivateRoute>
                  <Settings.Workflows />
                </PrivateRoute>
              } />
              <Route path="/settings/analytics" element={
                <PrivateRoute>
                  <Settings.Analytics />
                </PrivateRoute>
              } />
              <Route path="/settings/affiliates" element={
                <PrivateRoute>
                  <Settings.Affiliates />
                </PrivateRoute>
              } />
              
              <Route path="/confirm-email" element={<EmailConfirmation />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </NotificationsProvider>
        </PointsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
