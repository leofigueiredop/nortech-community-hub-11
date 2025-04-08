
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, MessageSquare, Search, Settings, PlusCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Home" }) => {
  const { toast } = useToast();

  const handleViewAsMember = () => {
    toast({
      title: "Viewing as Member",
      description: "You are now viewing your community as a regular member would see it.",
      duration: 3000,
    });
  };

  return (
    <header className="border-b border-nortech-gray-light dark:border-gray-800">
      <div className="h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-nortech-dark-blue dark:text-white">Pablo's Community</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full" 
              onClick={handleViewAsMember}
              title="View as Member"
            >
              <Eye size={14} />
            </Button>
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
