import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = date instanceof Date ? date : new Date(date);
  
  // If the date is invalid, return a placeholder
  if (isNaN(d.getTime())) return "Invalid date";
  
  // Calculate if date is today, yesterday, or this week
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  
  // Check if date is today
  if (dateOnly.getTime() === today.getTime()) {
    return `Today at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Check if date is yesterday
  if (dateOnly.getTime() === yesterday.getTime()) {
    return `Yesterday at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // If date is within the last 7 days
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 6);
  
  if (dateOnly >= oneWeekAgo && dateOnly < today) {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', hour: '2-digit', minute: '2-digit' };
    return d.toLocaleString(undefined, options);
  }
  
  // If date is this year
  if (d.getFullYear() === now.getFullYear()) {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return d.toLocaleString(undefined, options);
  }
  
  // Otherwise full date
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return d.toLocaleString(undefined, options);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function generateUniqueId(prefix = ''): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getInitials(name: string): string {
  if (!name) return '?';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
