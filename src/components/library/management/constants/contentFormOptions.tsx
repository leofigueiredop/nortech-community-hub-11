
import { FileText, Film, Headphones, Image, Link, BookOpen } from "lucide-react";
import { ContentFormat } from "@/types/library";

export const contentFormatOptions = [
  {
    value: "video" as ContentFormat,
    label: "Video",
    icon: <Film className="h-4 w-4 mr-2" />,
    description: "Upload or link to a video"
  },
  {
    value: "youtube" as ContentFormat,
    label: "YouTube",
    icon: <Film className="h-4 w-4 mr-2" />,
    description: "Link to a YouTube video"
  },
  {
    value: "vimeo" as ContentFormat,
    label: "Vimeo",
    icon: <Film className="h-4 w-4 mr-2" />,
    description: "Link to a Vimeo video"
  },
  {
    value: "audio" as ContentFormat,
    label: "Audio",
    icon: <Headphones className="h-4 w-4 mr-2" />,
    description: "Upload or link to audio content"
  },
  {
    value: "pdf" as ContentFormat,
    label: "PDF",
    icon: <FileText className="h-4 w-4 mr-2" />,
    description: "Upload a PDF document"
  },
  {
    value: "text" as ContentFormat,
    label: "Text",
    icon: <FileText className="h-4 w-4 mr-2" />,
    description: "Create a text document"
  },
  {
    value: "gdoc" as ContentFormat,
    label: "Google Doc",
    icon: <FileText className="h-4 w-4 mr-2" />,
    description: "Link to a Google Document"
  },
  {
    value: "image" as ContentFormat,
    label: "Image",
    icon: <Image className="h-4 w-4 mr-2" />,
    description: "Upload an image"
  },
  {
    value: "course" as ContentFormat,
    label: "Course",
    icon: <BookOpen className="h-4 w-4 mr-2" />,
    description: "Create a structured course"
  },
  {
    value: "link" as ContentFormat,
    label: "External Link",
    icon: <Link className="h-4 w-4 mr-2" />,
    description: "Link to external content"
  },
  {
    value: "url" as ContentFormat,
    label: "URL",
    icon: <Link className="h-4 w-4 mr-2" />,
    description: "Link to a URL"
  }
];

export const accessLevelOptions = [
  { value: "free", label: "Free", description: "Available to all users" },
  { value: "premium", label: "Premium", description: "Available only to premium subscribers" },
  { value: "unlockable", label: "Points Unlockable", description: "Can be unlocked using points" }
];

export const tagOptions = [
  "beginner",
  "intermediate",
  "advanced",
  "tutorial",
  "guide",
  "reference",
  "api",
  "integration",
  "code",
  "design",
  "user-experience",
  "marketing",
  "analytics",
  "security",
  "best-practices",
  "case-study",
  "quick-start",
  "deep-dive",
  "how-to",
  "tips-and-tricks"
];
