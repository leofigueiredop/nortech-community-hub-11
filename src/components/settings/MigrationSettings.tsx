
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ReloadIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
import { api } from '@/api/ApiClient';
import { createSQLFunctions } from '@/api/migrations/createSQLFunctions';
import { useToast } from '@/hooks/use-toast';

const MigrationSettings: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    content: boolean;
    events: boolean;
    discussions: boolean;
    points: boolean;
  } | null>(null);
  const [initialized, setInitialized] = useState(false);

  const fetchMigrationStatus = async () => {
    try {
      const status = await api.migration.getMigrationStatus();
      setStatus(status);
    } catch (error) {
      console.error('Error fetching migration status:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch migration status',
      });
    }
  };

  useEffect(() => {
    fetchMigrationStatus();
  }, []);

  const handleInitialize = async () => {
    setIsLoading(true);
    try {
      await createSQLFunctions();
      setInitialized(true);
      toast({
        title: 'SQL Functions Created',
        description: 'Database functions have been created successfully.',
      });
    } catch (error) {
      console.error('Error initializing:', error);
      toast({
        variant: 'destructive',
        title: 'Initialization Error',
        description: 'Failed to create SQL functions',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMigrate = async (type: 'content' | 'events' | 'discussions' | 'points') => {
    setIsLoading(true);
    try {
      switch (type) {
        case 'content':
          await api.migration.createContentTables();
          break;
        case 'events':
          await api.migration.createEventsTables();
          break;
        case 'discussions':
          await api.migration.createDiscussionTables();
          break;
        case 'points':
          await api.migration.createPointsTables();
          break;
      }
      
      await fetchMigrationStatus();
      
      toast({
        title: 'Migration Successful',
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} tables created successfully.`,
      });
    } catch (error) {
      console.error(`Error migrating ${type}:`, error);
      toast({
        variant: 'destructive',
        title: 'Migration Error',
        description: `Failed to create ${type} tables`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunAllMigrations = async () => {
    setIsLoading(true);
    try {
      if (!initialized) {
        await createSQLFunctions();
        setInitialized(true);
      }
      
      await api.migration.createContentTables();
      await api.migration.createEventsTables();
      await api.migration.createDiscussionTables();
      await api.migration.createPointsTables();
      
      await fetchMigrationStatus();
      
      toast({
        title: 'All Migrations Complete',
        description: 'All database tables have been created successfully.',
      });
    } catch (error) {
      console.error('Error running migrations:', error);
      toast({
        variant: 'destructive',
        title: 'Migration Error',
        description: 'Failed to run all migrations',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Database Migration</CardTitle>
          <CardDescription>
            Create and manage your database tables
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!initialized && (
            <div className="mb-6">
              <Alert className="mb-4 border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>Initialization Required</AlertTitle>
                <AlertDescription>
                  You need to initialize the SQL functions before running migrations.
                </AlertDescription>
              </Alert>
              <Button 
                onClick={handleInitialize}
                disabled={isLoading}
                className="mb-4"
              >
                {isLoading ? (
                  <>
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  'Initialize SQL Functions'
                )}
              </Button>
            </div>
          )}

          <div className="mb-4">
            <Button 
              onClick={handleRunAllMigrations}
              disabled={isLoading || (!initialized && !status)}
              className="w-full mb-4"
            >
              {isLoading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Running Migrations...
                </>
              ) : (
                'Run All Migrations'
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Content Tables</h3>
                <p className="text-sm text-gray-500">content_items, content_categories</p>
              </div>
              <div className="flex items-center">
                {status?.content ? (
                  <span className="flex items-center text-green-600">
                    <CheckCircleIcon className="mr-1 h-5 w-5" />
                    Installed
                  </span>
                ) : (
                  <Button 
                    onClick={() => handleMigrate('content')} 
                    disabled={isLoading || (!initialized && !status)}
                    size="sm"
                  >
                    {isLoading ? 'Installing...' : 'Install'}
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Events Tables</h3>
                <p className="text-sm text-gray-500">events, event_attendees</p>
              </div>
              <div className="flex items-center">
                {status?.events ? (
                  <span className="flex items-center text-green-600">
                    <CheckCircleIcon className="mr-1 h-5 w-5" />
                    Installed
                  </span>
                ) : (
                  <Button 
                    onClick={() => handleMigrate('events')} 
                    disabled={isLoading || (!initialized && !status)}
                    size="sm"
                  >
                    {isLoading ? 'Installing...' : 'Install'}
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Discussions Tables</h3>
                <p className="text-sm text-gray-500">discussion_topics, discussions, discussion_replies</p>
              </div>
              <div className="flex items-center">
                {status?.discussions ? (
                  <span className="flex items-center text-green-600">
                    <CheckCircleIcon className="mr-1 h-5 w-5" />
                    Installed
                  </span>
                ) : (
                  <Button 
                    onClick={() => handleMigrate('discussions')} 
                    disabled={isLoading || (!initialized && !status)}
                    size="sm"
                  >
                    {isLoading ? 'Installing...' : 'Install'}
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Points Tables</h3>
                <p className="text-sm text-gray-500">user_points, rewards, redemptions</p>
              </div>
              <div className="flex items-center">
                {status?.points ? (
                  <span className="flex items-center text-green-600">
                    <CheckCircleIcon className="mr-1 h-5 w-5" />
                    Installed
                  </span>
                ) : (
                  <Button 
                    onClick={() => handleMigrate('points')} 
                    disabled={isLoading || (!initialized && !status)}
                    size="sm"
                  >
                    {isLoading ? 'Installing...' : 'Install'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MigrationSettings;
