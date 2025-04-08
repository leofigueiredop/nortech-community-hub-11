
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

// Import Settings Pages
import General from "./pages/settings/General";
import Branding from "./pages/settings/Branding";
import Mobile from "./pages/settings/Mobile";
import Defaults from "./pages/settings/Defaults";
import Plans from "./pages/settings/Plans";
import Domain from "./pages/settings/Domain";
import AIAgents from "./pages/settings/AIAgents";
import Messaging from "./pages/settings/Messaging";
import Legal from "./pages/settings/Legal";
import Digest from "./pages/settings/Digest";
import SSO from "./pages/settings/SSO";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          
          {/* Settings Routes */}
          <Route path="/settings/general" element={<General />} />
          <Route path="/settings/branding" element={<Branding />} />
          <Route path="/settings/mobile" element={<Mobile />} />
          <Route path="/settings/defaults" element={<Defaults />} />
          <Route path="/settings/plans" element={<Plans />} />
          <Route path="/settings/domain" element={<Domain />} />
          <Route path="/settings/ai-agents" element={<AIAgents />} />
          <Route path="/settings/messaging" element={<Messaging />} />
          <Route path="/settings/legal" element={<Legal />} />
          <Route path="/settings/digest" element={<Digest />} />
          <Route path="/settings/sso" element={<SSO />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
