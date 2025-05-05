import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import SettingsMenu from '@/components/settings/SettingsMenu';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const SettingsIndex: React.FC = () => {
  return (
    <MainLayout title="Settings">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Community Settings</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Configure and customize your Nortech community experience
            </p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search settings..."
              className="pl-9 bg-white dark:bg-gray-800"
            />
          </div>
        </div>
        
        <SettingsMenu />
      </div>
    </MainLayout>
  );
};

export default SettingsIndex;
