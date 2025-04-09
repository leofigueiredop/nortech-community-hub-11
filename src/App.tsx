
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
import Dashboard from "./pages/Dashboard";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import Discussions from "./pages/Discussions";
import DiscussionTopic from "./pages/DiscussionTopic";
import Courses from "./pages/Courses";
import Events from "./pages/Events";
import LiveStreams from "./pages/LiveStreams";
import Members from "./pages/Members";
import Analytics from "./pages/Analytics";
import CreateSpace from "./pages/CreateSpace";
import AITerminal from "./pages/AITerminal";
import AIMatchmaker from "./pages/AIMatchmaker";
import PointsDashboard from "./pages/PointsDashboard";
import Leaderboard from "./pages/Leaderboard";
import { NotificationsProvider } from "./context/NotificationsContext";
import { PointsProvider } from "./context/PointsContext";

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
import Migration from "./pages/settings/Migration";
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
              <Route path="/onboarding/community" element={<Community />} />
              <Route path="/onboarding/profile" element={<Profile />} />
              <Route path="/onboarding/features" element={<Features />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/create-space" element={<CreateSpace />} />
              
              <Route path="/discussions" element={<Discussions />} />
              <Route path="/discussions/:topicId" element={<DiscussionTopic />} />
              
              <Route path="/courses" element={<Courses />} />
              <Route path="/events" element={<Events />} />
              <Route path="/live-streams" element={<LiveStreams />} />
              <Route path="/members" element={<Members />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/points" element={<PointsDashboard />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/ai-terminal" element={<AITerminal />} />
              <Route path="/ai-matchmaker" element={<AIMatchmaker />} />
              
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
              <Route path="/settings/migration" element={<Migration />} />
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
