import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/api/ApiClient';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';

const MigrationSettings: React.FC = () => {
  const { toast } = useToast();
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [migrationStatuses, setMigrationStatuses] = useState({
    content: false,
    events: false,
    discussions: false,
    points: false
  });

  useEffect(() => {
    checkMigrationStatus();
  }, []);

  const checkMigrationStatus = async () => {
    try {
      if (api.migration.getMigrationStatus) {
        const migrated = await api.migration.getMigrationStatus();
        const statusObj = {
          content: migrated,
          events: migrated,
          discussions: migrated,
          points: migrated
        };
        setMigrationStatuses(statusObj);
      }
    } catch (error) {
      console.error('Error checking migration status:', error);
    }
  };

  const handleMigrate = async () => {
    try {
      setIsMigrating(true);
      setMigrationProgress(10);

      await api.migration.runMigrations();
      setMigrationProgress(50);

      let allMigrated = true;

      if (!migrationStatuses.content && api.migration.createContentTables) {
        await api.migration.createContentTables();
        setMigrationStatuses(prev => ({ ...prev, content: true }));
      }

      if (!migrationStatuses.events && api.migration.createEventsTables) {
        await api.migration.createEventsTables();
        setMigrationStatuses(prev => ({ ...prev, events: true }));
      }

      if (!migrationStatuses.discussions && api.migration.createDiscussionTables) {
        await api.migration.createDiscussionTables();
        setMigrationStatuses(prev => ({ ...prev, discussions: true }));
      }

      if (!migrationStatuses.points && api.migration.createPointsTables) {
        await api.migration.createPointsTables();
        setMigrationStatuses(prev => ({ ...prev, points: true }));
      }

      setMigrationProgress(100);

      toast({
        title: "Migration Complete",
        description: "The database schema has been successfully migrated."
      });

      setTimeout(() => {
        setIsMigrating(false);
        setMigrationProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Migration failed:', error);
      setIsMigrating(false);
      setMigrationProgress(0);
      toast({
        title: "Migration Failed",
        description: "There was an error during the migration process.",
        variant: "destructive"
      });
    }
  };

  const runSpecificMigrations = async () => {
    try {
      setIsMigrating(true);
      setMigrationProgress(25);

      if (!migrationStatuses.content && api.migration.createContentTables) await api.migration.createContentTables();
      if (!migrationStatuses.events && api.migration.createEventsTables) await api.migration.createEventsTables();
      if (!migrationStatuses.discussions && api.migration.createDiscussionTables) await api.migration.createDiscussionTables();
      if (!migrationStatuses.points && api.migration.createPointsTables) await api.migration.createPointsTables();

      await checkMigrationStatus();
      setMigrationProgress(100);

      toast({
        title: "Selective Migration Complete",
        description: "The selected tables have been successfully migrated."
      });

      setTimeout(() => {
        setIsMigrating(false);
        setMigrationProgress(0);
      }, 1000);
    } catch (error) {
      console.error('Selective migration failed:', error);
      setIsMigrating(false);
      setMigrationProgress(0);
      toast({
        title: "Migration Failed",
        description: "There was an error during the selective migration process.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Migrations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Run database migrations to update your schema to the latest version. This may be needed after updating the platform.
        </p>
        
        {isMigrating && (
          <div className="space-y-2 my-4">
            <Progress value={migrationProgress} className="h-2" />
            <p className="text-sm text-center">{migrationProgress}% Complete</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="content-tables" 
                checked={migrationStatuses.content}
                onCheckedChange={(checked) => 
                  setMigrationStatuses(prev => ({ ...prev, content: !!checked }))
                }
              />
              <label 
                htmlFor="content-tables" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Content Tables {migrationStatuses.content && '✓'}
              </label>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="events-tables" 
                checked={migrationStatuses.events}
                onCheckedChange={(checked) => 
                  setMigrationStatuses(prev => ({ ...prev, events: !!checked }))
                }
              />
              <label 
                htmlFor="events-tables" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Events Tables {migrationStatuses.events && '✓'}
              </label>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="discussions-tables" 
                checked={migrationStatuses.discussions}
                onCheckedChange={(checked) => 
                  setMigrationStatuses(prev => ({ ...prev, discussions: !!checked }))
                }
              />
              <label 
                htmlFor="discussions-tables" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Discussions Tables {migrationStatuses.discussions && '✓'}
              </label>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="points-tables" 
                checked={migrationStatuses.points}
                onCheckedChange={(checked) => 
                  setMigrationStatuses(prev => ({ ...prev, points: !!checked }))
                }
              />
              <label 
                htmlFor="points-tables" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Points & Rewards Tables {migrationStatuses.points && '✓'}
              </label>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-2 sm:flex-row">
          <Button 
            onClick={handleMigrate} 
            disabled={isMigrating}
            className="flex-1"
          >
            Run All Migrations
          </Button>
          <Button 
            onClick={runSpecificMigrations}
            disabled={isMigrating}
            variant="outline"
            className="flex-1"
          >
            Run Selected Migrations
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MigrationSettings;
export const fixMigrationReferences = () => {
  console.log('Use api.migration instead of api.migrations');
};

