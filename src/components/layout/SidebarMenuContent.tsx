import React from 'react';
import { CommunitySwitcher } from '@/components/community/CommunitySwitcher';
import { Home, Book, Users, Settings, Plus, GraduationCap, Calendar, MessageSquare } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useViewContext } from './MainLayout';

const SidebarMenuContent = () => {
  const { viewAs } = useViewContext();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <CommunitySwitcher />
      </div>
      <nav className="flex-1 px-2 py-4">
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 rounded-md hover:bg-secondary hover:text-secondary-foreground ${
                  isActive ? 'bg-secondary text-secondary-foreground font-medium' : 'text-muted-foreground'
                }`
              }
            >
              <Home className="w-4 h-4 mr-2" />
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/library"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 rounded-md hover:bg-secondary hover:text-secondary-foreground ${
                  isActive ? 'bg-secondary text-secondary-foreground font-medium' : 'text-muted-foreground'
                }`
              }
            >
              <Book className="w-4 h-4 mr-2" />
              <span>Library</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/members"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 rounded-md hover:bg-secondary hover:text-secondary-foreground ${
                  isActive ? 'bg-secondary text-secondary-foreground font-medium' : 'text-muted-foreground'
                }`
              }
            >
              <Users className="w-4 h-4 mr-2" />
              <span>Members</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/courses"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 rounded-md hover:bg-secondary hover:text-secondary-foreground ${
                  isActive ? 'bg-secondary text-secondary-foreground font-medium' : 'text-muted-foreground'
                }`
              }
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              <span>Courses</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/events"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 rounded-md hover:bg-secondary hover:text-secondary-foreground ${
                  isActive ? 'bg-secondary text-secondary-foreground font-medium' : 'text-muted-foreground'
                }`
              }
            >
              <Calendar className="w-4 h-4 mr-2" />
              <span>Events</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/chat"
              className={({ isActive }) =>
                `flex items-center px-2 py-2 rounded-md hover:bg-secondary hover:text-secondary-foreground ${
                  isActive ? 'bg-secondary text-secondary-foreground font-medium' : 'text-muted-foreground'
                }`
              }
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              <span>Chat</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      {viewAs === 'admin' && (
        <div className="border-t border-border p-3">
          <Button variant="secondary" size="sm" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>
      )}
      <div className="border-t border-border p-3">
        <NavLink
          to="/settings/general"
          className={({ isActive }) =>
            `flex items-center px-2 py-2 rounded-md hover:bg-secondary hover:text-secondary-foreground ${
              isActive ? 'bg-secondary text-secondary-foreground font-medium' : 'text-muted-foreground'
            }`
          }
        >
          <Settings className="w-4 h-4 mr-2" />
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
  );
};

export default SidebarMenuContent;
