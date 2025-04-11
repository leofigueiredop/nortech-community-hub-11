
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Community from "./pages/onboarding/Community";
import Profile from "./pages/onboarding/Profile";
import Features from "./pages/onboarding/Features";
import Creator from "./pages/onboarding/Creator";
import Migration from "./pages/onboarding/Migration";
import CommunityType from "./pages/onboarding/CommunityType";
import CommunityTemplates from "./pages/onboarding/CommunityTemplates";
import InviteMembers from "./pages/onboarding/InviteMembers";
import MembershipPlans from "./pages/onboarding/MembershipPlans";
import FinalStep from "./pages/onboarding/FinalStep";
import Dashboard from "./pages/Dashboard";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import Discussions from "./pages/Discussions";
import DiscussionTopic from "./pages/DiscussionTopic";
import Library from "./pages/Library";
import Events from "./pages/Events";
import EventsWeekly from "./pages/EventsWeekly";
import EventsCalendar from "./pages/EventsCalendar";
import Members from "./pages/Members";
import Analytics from "./pages/Analytics";
import CreateSpace from "./pages/CreateSpace";
import AITerminal from "./pages/AITerminal";
import AIMatchmaker from "./pages/AIMatchmaker";
import PointsDashboard from "./pages/PointsDashboard";
import PointsStore from "./pages/PointsStore";
import Leaderboard from "./pages/Leaderboard";
import { NotificationsProvider } from "./context/NotificationsContext";
import { PointsProvider } from "./context/PointsContext";
import ContentManagement from "./pages/ContentManagement";
import CourseCreate from "./pages/CourseCreate";
import CourseEdit from "./pages/CourseEdit";
import Courses from "./pages/Courses";
import TagPage from "./pages/TagPage";
import UserProfile from "./pages/UserProfile";
import CreateEvent from "./pages/CreateEvent";

// Import settings pages
import SettingsIndex from "./pages/settings/Index";
import General from "./pages/settings/General";
import Branding from "./pages/settings/Branding";
import Mobile from "./pages/settings/Mobile";
import Defaults from "./pages/settings/Defaults";
import Plans from "./pages/settings/Plans";
import Subscriptions from "./pages/settings/Subscriptions";
import Domain from "./pages/settings/Domain";
import AIAgents from "./pages/settings/AIAgents";
import Messaging from "./pages/settings/Messaging";
import Notifications from "./pages/settings/Notifications";
import Legal from "./pages/settings/Legal";
import Digest from "./pages/settings/Digest";
import SSO from "./pages/settings/SSO";
import Integration from "./pages/settings/Integration";
import MigrationSettings from "./pages/settings/Migration";
import Paywall from "./pages/settings/Paywall";
import PointsConfiguration from "./pages/settings/PointsConfiguration";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <NotificationsProvider>
      <PointsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/onboarding/creator" element={<Creator />} />
              <Route path="/onboarding/migration" element={<Migration />} />
              <Route path="/onboarding/community-type" element={<CommunityType />} />
              <Route path="/onboarding/community-templates" element={<CommunityTemplates />} />
              <Route path="/onboarding/invite-members" element={<InviteMembers />} />
              <Route path="/onboarding/membership-plans" element={<MembershipPlans />} />
              <Route path="/onboarding/final-step" element={<FinalStep />} />
              <Route path="/onboarding/community" element={<Community />} />
              <Route path="/onboarding/profile" element={<Profile />} />
              <Route path="/onboarding/features" element={<Features />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/create-space" element={<CreateSpace />} />
              
              <Route path="/discussions" element={<Discussions />} />
              <Route path="/discussions/:topicId" element={<DiscussionTopic />} />
              
              <Route path="/library" element={<Library />} />
              <Route path="/library/manage" element={<ContentManagement />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:courseId" element={<Courses />} />
              <Route path="/courses/create" element={<CourseCreate />} />
              <Route path="/courses/edit/:courseId" element={<CourseEdit />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/weekly" element={<EventsWeekly />} />
              <Route path="/events/calendar" element={<EventsCalendar />} />
              <Route path="/events/create" element={<CreateEvent />} />
              <Route path="/members" element={<Members />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/points" element={<PointsDashboard />} />
              <Route path="/points/store" element={<PointsStore />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/ai-terminal" element={<AITerminal />} />
              <Route path="/ai-matchmaker" element={<AIMatchmaker />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/profile/:userId" element={<UserProfile />} />
              
              <Route path="/tags/:tagName" element={<TagPage />} />
              
              <Route path="/settings" element={<SettingsIndex />} />
              <Route path="/settings/general" element={<General />} />
              <Route path="/settings/branding" element={<Branding />} />
              <Route path="/settings/mobile" element={<Mobile />} />
              <Route path="/settings/defaults" element={<Defaults />} />
              <Route path="/settings/plans" element={<Plans />} />
              <Route path="/settings/subscriptions" element={<Subscriptions />} />
              <Route path="/settings/domain" element={<Domain />} />
              <Route path="/settings/ai-agents" element={<AIAgents />} />
              <Route path="/settings/messaging" element={<Messaging />} />
              <Route path="/settings/notifications" element={<Notifications />} />
              <Route path="/settings/legal" element={<Legal />} />
              <Route path="/settings/digest" element={<Digest />} />
              <Route path="/settings/sso" element={<SSO />} />
              <Route path="/settings/integration" element={<Integration />} />
              <Route path="/settings/migration" element={<MigrationSettings />} />
              <Route path="/settings/paywall" element={<Paywall />} />
              <Route path="/settings/points" element={<PointsConfiguration />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </PointsProvider>
    </NotificationsProvider>
  </QueryClientProvider>
);

export default App;
