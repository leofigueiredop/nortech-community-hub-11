
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown, Settings, Moon, Palette, Keyboard, Eye, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import InviteMemberDialog from '@/components/members/InviteMemberDialog';
import { useRealMembers } from '@/hooks/useRealMembers';

const SettingsPopover: React.FC = () => {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const { inviteMember, loadAllMembers } = useRealMembers();

  const handleInviteMember = async (email: string, role: string, plan: string) => {
    await inviteMember(email, role);
    loadAllMembers();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 text-white">
          <span className="font-semibold">Pablo's Community</span>
          <ChevronDown size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-gray-900 border-gray-700">
        <div className="p-0">
          <div className="flex flex-col">
            <Link 
              to="/settings/general" 
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Settings size={20} />
              <span className="text-sm font-medium">Settings</span>
            </Link>
            
            <div className="h-px bg-gray-800 my-2"></div>
            
            <Link 
              to="/settings/theme" 
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Moon size={20} />
              <span className="text-sm font-medium">Switch to light mode</span>
            </Link>
            
            <Link 
              to="/settings/customize" 
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Palette size={20} />
              <span className="text-sm font-medium">Customize theme</span>
            </Link>
            
            <Link 
              to="/settings/shortcuts" 
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Keyboard size={20} />
              <span className="text-sm font-medium">Keyboard shortcuts</span>
            </Link>
            
            <div className="h-px bg-gray-800 my-2"></div>
            
            <Link 
              to="/settings/view-as" 
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              <Eye size={20} />
              <span className="text-sm font-medium">View as</span>
            </Link>
            
            <button 
              onClick={() => setInviteDialogOpen(true)}
              className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white w-full text-left"
            >
              <UserPlus size={20} />
              <span className="text-sm font-medium">Invite member</span>
            </button>
          </div>
        </div>
      </PopoverContent>
      
      <InviteMemberDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        onInvite={handleInviteMember}
      />
    </Popover>
  );
};

export default SettingsPopover;
