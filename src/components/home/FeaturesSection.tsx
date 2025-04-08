
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  UserCircle2, MessageSquare, Calendar, Video, Graduation, Zap, 
  Badge, FileCode, LineChart, Braces, Shield, Smartphone
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <UserCircle2 className="h-10 w-10 text-blue-500" />,
      title: "Member Profiles",
      description: "Rich, customizable member profiles to showcase your community members."
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-indigo-500" />,
      title: "Discussions",
      description: "Threaded conversations with rich media support and reactions."
    },
    {
      icon: <Calendar className="h-10 w-10 text-purple-500" />,
      title: "Events",
      description: "Host virtual and in-person events with registration and reminders."
    },
    {
      icon: <Video className="h-10 w-10 text-pink-500" />,
      title: "Live Streams",
      description: "Broadcast to your community with integrated chat and recording."
    },
    {
      icon: <Graduation className="h-10 w-10 text-orange-500" />,
      title: "Courses",
      description: "Deliver educational content with lessons, quizzes, and completion tracking."
    },
    {
      icon: <Zap className="h-10 w-10 text-yellow-500" />,
      title: "Gamification",
      description: "Reward engagement with points, badges, and leaderboards."
    },
    {
      icon: <Badge className="h-10 w-10 text-green-500" />,
      title: "Custom Branding",
      description: "Make the platform truly yours with custom colors, logos, and domain."
    },
    {
      icon: <FileCode className="h-10 w-10 text-teal-500" />,
      title: "Custom Code",
      description: "Add advanced customization with custom HTML, CSS, and JavaScript."
    },
    {
      icon: <LineChart className="h-10 w-10 text-cyan-500" />,
      title: "Analytics",
      description: "Track growth, engagement, and revenue with detailed reports."
    },
    {
      icon: <Braces className="h-10 w-10 text-blue-500" />,
      title: "API Access",
      description: "Integrate with your existing systems using our comprehensive API."
    },
    {
      icon: <Shield className="h-10 w-10 text-indigo-500" />,
      title: "Moderation",
      description: "Keep your community safe with powerful moderation tools."
    },
    {
      icon: <Smartphone className="h-10 w-10 text-purple-500" />,
      title: "Mobile Apps",
      description: "Offer branded iOS and Android apps for your community members."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-nortech-dark-blue dark:text-white">
            All-in-one community platform
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need to build, engage, and grow your online community
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
