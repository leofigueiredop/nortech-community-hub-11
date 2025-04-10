
import React from 'react';
import { 
  FileText, 
  Calendar, 
  MessageSquare, 
  Layers, 
  Users, 
  Image, 
  HelpCircle, 
  Inbox, 
  BookOpen,
  FileImage,
  Video,
  Music,
  Sparkles,
  Search,
  Lightbulb,
  LayoutTemplate,
  Wand2
} from 'lucide-react';

export const spaceTypes = [
  { 
    type: 'posts', 
    icon: <FileText className="h-5 w-5 text-nortech-purple" />, 
    title: 'Posts', 
    description: 'Create and share articles, updates and news with your community.',
    category: 'content'
  },
  { 
    type: 'library', 
    icon: <BookOpen className="h-5 w-5 text-nortech-purple" />, 
    title: 'Content Library', 
    description: 'Organize and share rich media content with your community.',
    category: 'content'
  },
  { 
    type: 'course', 
    icon: <Layers className="h-5 w-5 text-nortech-purple" />, 
    title: 'Course', 
    description: 'Create structured learning content with lessons and modules.',
    category: 'content'
  },
  { 
    type: 'gallery', 
    icon: <FileImage className="h-5 w-5 text-nortech-purple" />, 
    title: 'Image Gallery', 
    description: 'Share photos and image collections with your community.',
    category: 'content'
  },
  { 
    type: 'videos', 
    icon: <Video className="h-5 w-5 text-nortech-purple" />, 
    title: 'Video Collection', 
    description: 'Organize and share video content with your members.',
    category: 'content'
  },
  { 
    type: 'podcast', 
    icon: <Music className="h-5 w-5 text-nortech-purple" />, 
    title: 'Podcast', 
    description: 'Create and share audio content and episodes.',
    category: 'content'
  },
  
  { 
    type: 'events', 
    icon: <Calendar className="h-5 w-5 text-nortech-purple" />, 
    title: 'Events', 
    description: 'Schedule and manage in-person or virtual events for your community.',
    category: 'community'
  },
  { 
    type: 'members', 
    icon: <Users className="h-5 w-5 text-nortech-purple" />, 
    title: 'Members Hub', 
    description: 'Create a dedicated space to manage community membership.',
    category: 'community'
  },
  
  { 
    type: 'chat', 
    icon: <MessageSquare className="h-5 w-5 text-nortech-purple" />, 
    title: 'Chat', 
    description: 'Enable real-time conversations between community members.',
    category: 'communication'
  },
  { 
    type: 'support', 
    icon: <Inbox className="h-5 w-5 text-nortech-purple" />, 
    title: 'Support', 
    description: 'Provide help and support for your community members.',
    category: 'communication'
  },
  { 
    type: 'faq', 
    icon: <HelpCircle className="h-5 w-5 text-nortech-purple" />, 
    title: 'FAQ', 
    description: 'Create a space for frequently asked questions and answers.',
    category: 'communication'
  },
  
  { 
    type: 'ai-matchmaker', 
    icon: <Sparkles className="h-5 w-5 text-nortech-purple" />, 
    title: 'AI Matchmaker', 
    description: 'Connect members with shared interests using AI algorithms.',
    category: 'ai'
  },
  { 
    type: 'ai-content', 
    icon: <Wand2 className="h-5 w-5 text-nortech-purple" />, 
    title: 'AI Content Generator', 
    description: 'Create content automatically based on your community needs.',
    category: 'ai'
  },
  { 
    type: 'ai-search', 
    icon: <Search className="h-5 w-5 text-nortech-purple" />, 
    title: 'Smart Search', 
    description: 'AI-powered search to help members find what they need quickly.',
    category: 'ai'
  },
];

export const templateOptions = [
  {
    title: "Community Hub",
    description: "Complete community space with posts, events, and member sections",
    icon: <Users className="h-5 w-5 text-nortech-purple" />
  },
  {
    title: "Learning Academy",
    description: "Educational space with courses, resources, and assessments",
    icon: <BookOpen className="h-5 w-5 text-nortech-purple" />
  },
  {
    title: "Content Creator",
    description: "Publish and monetize articles, videos, and podcasts",
    icon: <FileText className="h-5 w-5 text-nortech-purple" />
  },
  {
    title: "Events Platform",
    description: "Manage registrations, RSVPs, and virtual events",
    icon: <Calendar className="h-5 w-5 text-nortech-purple" />
  }
];
