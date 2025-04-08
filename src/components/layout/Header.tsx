
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, MessageSquare, Search, Settings, PlusCircle, Eye, ChevronDown, CheckCircle2 } from 'lucide-react';
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
}

// Define membership types
const membershipTypes = [
  { id: 'admin', name: 'Admin (You)', description: 'Full access to all features' },
  { id: 'free', name: 'Free Member', description: 'Basic community access' },
  { id: 'premium', name: 'Premium Member', description: 'Access to premium content' },
  { id: 'mentor', name: 'Mentor', description: 'Access to mentorship program' },
];

const Header: React.FC<HeaderProps> = ({ title = "Home" }) => {
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
    <header className="border-b border-nortech-gray-light dark:border-gray-800">
      <div className="h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-nortech-dark-blue dark:text-white">Pablo's Community</span>
            
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
              <DropdownMenuContent align="start" className="w-60">
                <DropdownMenuLabel>View as member</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {membershipTypes.map((type) => (
                  <DropdownMenuItem 
                    key={type.id}
                    className="flex items-start gap-2 py-2 cursor-pointer"
                    onClick={() => handleViewAsMember(type.id)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{type.name}</span>
                        {currentView === type.id && (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{type.description}</p>
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
          </nav>
        </div>
        
        <div className="flex items-center gap-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search" 
              className="pl-10 pr-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-nortech-purple focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MessageSquare size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings size={20} />
            </Button>
            
            <div className="w-8 h-8 bg-nortech-purple text-white rounded-full flex items-center justify-center">
              <span className="font-medium text-sm">U</span>
            </div>
          </div>
        </div>
      </div>
      
      {title && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-nortech-gray-light dark:border-gray-800">
          <h1 className="text-xl font-semibold text-nortech-dark-blue dark:text-white">{title}</h1>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-sm">
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
