
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Library from '@/pages/Library';
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
import CommunityTemplates from '@/pages/onboarding/CommunityTemplates';
import Creator from '@/pages/onboarding/Creator';
import Migration from '@/pages/onboarding/Migration';
import MembershipPlans from '@/pages/onboarding/MembershipPlans';
import InviteMembers from '@/pages/onboarding/InviteMembers';
import FinalStep from '@/pages/onboarding/FinalStep';
import Leaderboard from '@/pages/Leaderboard';
import Analytics from '@/pages/Analytics';
import ContentCreatorDashboard from '@/pages/ContentCreatorDashboard';
import ContentManagement from '@/pages/ContentManagement';
import Matchmaker from '@/pages/Matchmaker';
import NotFound from '@/pages/NotFound';
import { PointsProvider } from '@/context/PointsContext';
import { NotificationsProvider } from '@/context/NotificationsContext';
import * as Settings from '@/pages/settings';
import LiveStreams from '@/pages/LiveStreams';

function App() {
  return (
    <PointsProvider>
      <NotificationsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/library" element={<Library />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/calendar" element={<EventsCalendar />} />
            <Route path="/events/weekly" element={<EventsWeekly />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/discussions" element={<Discussions />} />
            <Route path="/discussions/:topicId" element={<DiscussionTopic />} />
            <Route path="/discussions/:topicId/:discussionId" element={<DiscussionDetail />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/tag/:tagName" element={<TagPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/members" element={<Members />} />
            <Route path="/create-space" element={<CreateSpace />} />
            <Route path="/matchmaker" element={<Matchmaker />} />
            <Route path="/live-streams" element={<LiveStreams />} />
            
            {/* Points related routes */}
            <Route path="/points" element={<PointsDashboard />} />
            <Route path="/points-dashboard" element={<PointsDashboard />} />
            <Route path="/points/store" element={<PointsStore />} />
            <Route path="/points-store" element={<PointsStore />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            
            <Route path="/onboarding" element={<OnboardingLayout />}>
              <Route path="community-type" element={<CommunityType />} />
              <Route path="community" element={<Community />} />
              <Route path="community-templates" element={<CommunityTemplates />} />
              <Route path="creator" element={<Creator />} />
              <Route path="migration" element={<Migration />} />
              <Route path="membership-plans" element={<MembershipPlans />} />
              <Route path="invite-members" element={<InviteMembers />} />
              <Route path="final-step" element={<FinalStep />} />
            </Route>
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/content-creator-dashboard" element={<ContentCreatorDashboard />} />
            <Route path="/content-management" element={<ContentManagement />} />
            
            {/* Settings routes */}
            <Route path="/settings" element={<Settings.Index />} />
            <Route path="/settings/general" element={<Settings.General />} />
            <Route path="/settings/branding" element={<Settings.Branding />} />
            <Route path="/settings/defaults" element={<Settings.Defaults />} />
            <Route path="/settings/integration" element={<Settings.Integration />} />
            <Route path="/settings/messaging" element={<Settings.Messaging />} />
            <Route path="/settings/mobile" element={<Settings.Mobile />} />
            <Route path="/settings/domain" element={<Settings.Domain />} />
            <Route path="/settings/points-configuration" element={<Settings.PointsConfiguration />} />
            <Route path="/settings/migration" element={<Settings.Migration />} />
            <Route path="/settings/ai-agents" element={<Settings.AIAgents />} />
            <Route path="/settings/notifications" element={<Settings.Notifications />} />
            <Route path="/settings/plans" element={<Settings.Plans />} />
            <Route path="/settings/paywall" element={<Settings.Paywall />} />
            <Route path="/settings/subscriptions" element={<Settings.Subscriptions />} />
            <Route path="/settings/legal" element={<Settings.Legal />} />
            <Route path="/settings/digest" element={<Settings.Digest />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </NotificationsProvider>
    </PointsProvider>
  );
}

export default App;
