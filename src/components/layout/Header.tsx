import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, MessageSquare, Search, Settings, PlusCircle, Eye, ChevronDown, CheckCircle2, Users, Star, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  title?: string;
  children?: React.ReactNode;
}

// Define membership types based on the Nortech Communities pricing structure
const membershipTypes = [
  { id: 'admin', name: 'Admin (You)', description: 'Full access to all features', icon: Users },
  { id: 'basic', name: 'Basic Member', description: 'Community access, standard courses', icon: Users },
  { id: 'advanced', name: 'Advanced Member', description: 'Private groups, advanced gamification', icon: Star },
  { id: 'premium', name: 'White Label Member', description: 'Premium features, dedicated support', icon: Trophy },
];

const Header: React.FC<HeaderProps> = ({ title = "Home", children }) => {
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState('admin');

  const handleViewAsMember = (memberId: string) => {
    setCurrentView(memberId);
    
    toast({
      title: `Viewing as ${membershipTypes.find(m => m.id === memberId)?.name}`,
      description: "You are now viewing your community as this member would see it.",
      duration: 3000,
    });
  };

  return (
    <header className="border-b border-nortech-gray-light dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            {children}
            <span className="font-semibold text-nortech-dark-blue dark:text-white">Nortech Community</span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" 
                  title="View as Member"
                >
                  <Eye size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <DropdownMenuLabel className="text-gray-900 dark:text-white">View as member</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                {membershipTypes.map((type) => (
                  <DropdownMenuItem 
                    key={type.id}
                    className="flex items-start gap-2 py-2 cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleViewAsMember(type.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        <span className="font-medium">{type.name}</span>
                        {currentView === type.id && (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{type.description}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="bg-nortech-light-purple text-nortech-purple rounded-full px-4 py-1.5 text-sm font-semibold"
            >
              Home
            </Link>
            <Link 
              to="/events" 
              className="text-nortech-gray-text hover:text-nortech-dark-blue dark:hover:text-white text-sm font-semibold transition-colors"
            >
              Events
            </Link>
            <Link 
              to="/members" 
              className="text-nortech-gray-text hover:text-nortech-dark-blue dark:hover:text-white text-sm font-semibold transition-colors"
            >
              Members
            </Link>
            <Link 
              to="/courses" 
              className="text-nortech-gray-text hover:text-nortech-dark-blue dark:hover:text-white text-sm font-semibold transition-colors"
            >
              Courses
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search" 
              className="pl-10 pr-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-nortech-purple focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full text-gray-600 dark:text-gray-300">
              <Bell size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full text-gray-600 dark:text-gray-300">
              <MessageSquare size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full text-gray-600 dark:text-gray-300">
              <Settings size={20} />
            </Button>
            
            <div className="w-8 h-8 bg-nortech-purple text-white rounded-full flex items-center justify-center">
              <span className="font-medium text-sm">U</span>
            </div>
          </div>
        </div>
      </div>
      
      {title && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-nortech-gray-light dark:border-gray-800 bg-white dark:bg-gray-900">
          <h1 className="text-xl font-semibold text-nortech-dark-blue dark:text-white">{title}</h1>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-sm text-gray-600 dark:text-gray-300">
              Most recent
            </Button>
            <Button className="bg-nortech-purple hover:bg-nortech-purple/90 text-white flex gap-2">
              <PlusCircle size={18} />
              <span>New post</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
