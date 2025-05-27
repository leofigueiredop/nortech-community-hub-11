import React, { useState } from 'react';
import SettingsLayout from '@/components/settings/SettingsLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Settings, 
  Eye, 
  EyeOff, 
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Users,
  Grid3X3,
  List,
  Layout,
  MessageSquare,
  BookOpen,
  Calendar,
  Handshake,
  Award,
  BarChart2,
  HelpCircle,
  Store,
  Mail,
  Share2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import SpaceSettingsDialog from '@/components/settings/spaces/SpaceSettingsDialog';
import { Space } from '@/components/settings/spaces/types';

const Spaces: React.FC = () => {
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [spaces, setSpaces] = useState<Space[]>([
    {
      id: '1',
      name: 'Feed',
      description: 'Core',
      type: 'feed',
      icon: '📰',
      color: '#4F46E5',
      isPrivate: false,
      memberCount: 0,
      isActive: true,
      template: 'feed'
    },
    {
      id: '2',
      name: 'Discussions',
      description: 'Community',
      type: 'forum',
      icon: '💬',
      color: '#16A34A',
      isPrivate: false,
      memberCount: 0,
      isActive: true,
      template: 'forum'
    },
    {
      id: '3',
      name: 'Content Library',
      description: 'Core',
      type: 'course',
      icon: '📚',
      color: '#DC2626',
      isPrivate: false,
      memberCount: 0,
      isActive: true,
      template: 'course'
    },
    {
      id: '4',
      name: 'Courses',
      description: 'Education',
      type: 'course',
      icon: '🎓',
      color: '#7C3AED',
      isPrivate: false,
      memberCount: 0,
      isActive: true,
      template: 'course'
    },
    {
      id: '5',
      name: 'Events',
      description: 'Community',
      type: 'project',
      icon: '📅',
      color: '#EA580C',
      isPrivate: false,
      memberCount: 0,
      isActive: true,
      template: 'project'
    },
    {
      id: '6',
      name: 'Matchmaker',
      description: 'Community',
      type: 'qa',
      icon: '🤝',
      color: '#0891B2',
      isPrivate: false,
      memberCount: 0,
      isActive: false,
      template: 'qa'
    },
    {
      id: '7',
      name: 'Points & Rewards',
      description: 'Engagement',
      type: 'project',
      icon: '🏆',
      color: '#CA8A04',
      isPrivate: false,
      memberCount: 0,
      isActive: true,
      template: 'project'
    },
    {
      id: '8',
      name: 'Members',
      description: 'Community',
      type: 'forum',
      icon: '👥',
      color: '#16A34A',
      isPrivate: false,
      memberCount: 0,
      isActive: true,
      template: 'forum'
    },
    {
      id: '9',
      name: 'Analytics',
      description: 'Analytics',
      type: 'project',
      icon: '📊',
      color: '#7C3AED',
      isPrivate: false,
      memberCount: 0,
      isActive: true,
      template: 'project'
    },
    {
      id: '10',
      name: 'Settings',
      description: 'Core',
      type: 'project',
      icon: '⚙️',
      color: '#6B7280',
      isPrivate: false,
      memberCount: 0,
      isActive: true,
      template: 'project'
    },
    {
      id: '11',
      name: 'Affiliates',
      description: 'Monetization',
      type: 'project',
      icon: '🔗',
      color: '#F59E0B',
      isPrivate: false,
      memberCount: 0,
      isActive: true,
      template: 'project',
      isSoon: true
    },
    {
      id: '12',
      name: 'Support',
      description: 'Core',
      type: 'qa',
      icon: '❓',
      color: '#10B981',
      isPrivate: false,
      memberCount: 0,
      isActive: true,
      template: 'qa'
    },
    {
      id: '13',
      name: 'Marketplace',
      description: 'Monetization',
      type: 'project',
      icon: '🏪',
      color: '#8B5CF6',
      isPrivate: false,
      memberCount: 0,
      isActive: true,
      template: 'project',
      isSoon: true
    },
    {
      id: '14',
      name: 'Newsletter',
      description: 'Marketing',
      type: 'project',
      icon: '📧',
      color: '#EC4899',
      isPrivate: false,
      memberCount: 0,
      isActive: true,
      template: 'project',
      isSoon: true
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSpace, setEditingSpace] = useState<Space | undefined>();

  const handleCreateSpace = () => {
    setEditingSpace(undefined);
    setIsDialogOpen(true);
  };

  const handleEditSpace = (space: Space) => {
    setEditingSpace(space);
    setIsDialogOpen(true);
  };

  const handleSaveSpace = (spaceData: Partial<Space>) => {
    if (editingSpace) {
      setSpaces(prev => prev.map(space => 
        space.id === editingSpace.id 
          ? { ...space, ...spaceData }
          : space
      ));
    } else {
      const newSpace: Space = {
        id: Date.now().toString(),
        memberCount: 0,
        isActive: true,
        ...spaceData
      } as Space;
      setSpaces(prev => [...prev, newSpace]);
    }
  };

  const handleDeleteSpace = (spaceId: string) => {
    setSpaces(prev => prev.filter(space => space.id !== spaceId));
  };

  const handleDuplicateSpace = (space: Space) => {
    const duplicatedSpace: Space = {
      ...space,
      id: Date.now().toString(),
      name: `${space.name} (Copy)`,
      memberCount: 0
    };
    setSpaces(prev => [...prev, duplicatedSpace]);
  };

  const handleToggleVisibility = (spaceId: string) => {
    setSpaces(prev => prev.map(space =>
      space.id === spaceId
        ? { ...space, isPrivate: !space.isPrivate }
        : space
    ));
  };

  const handleToggleStatus = (spaceId: string) => {
    setSpaces(prev => prev.map(space =>
      space.id === spaceId
        ? { ...space, isActive: !space.isActive }
        : space
    ));
  };

  const getAccessLabel = (space: Space) => {
    if (space.name === 'Courses' || space.name === 'Analytics' || space.name === 'Affiliates' || space.name === 'Newsletter') {
      return 'Premium';
    }
    return 'Free';
  };

  const getPermissionsLabel = (space: Space) => {
    if (space.name === 'Matchmaker' || space.name === 'Affiliates' || space.name === 'Newsletter') {
      return 'Creator Only';
    }
    if (space.name === 'Courses' || space.name === 'Analytics' || space.name === 'Settings') {
      return 'Admin Only';
    }
    return 'All Members';
  };

  const getSpaceIcon = (spaceName: string) => {
    switch (spaceName) {
      case 'Feed':
        return <Layout size={20} className="text-primary" />;
      case 'Discussions':
        return <MessageSquare size={20} className="text-primary" />;
      case 'Content Library':
        return <BookOpen size={20} className="text-primary" />;
      case 'Courses':
        return <BookOpen size={20} className="text-primary" />;
      case 'Events':
        return <Calendar size={20} className="text-primary" />;
      case 'Matchmaker':
        return <Handshake size={20} className="text-primary" />;
      case 'Points & Rewards':
        return <Award size={20} className="text-primary" />;
      case 'Members':
        return <Users size={20} className="text-primary" />;
      case 'Analytics':
        return <BarChart2 size={20} className="text-primary" />;
      case 'Settings':
        return <Settings size={20} className="text-primary" />;
      case 'Affiliates':
        return <Share2 size={20} className="text-primary" />;
      case 'Support':
        return <HelpCircle size={20} className="text-primary" />;
      case 'Marketplace':
        return <Store size={20} className="text-primary" />;
      case 'Newsletter':
        return <Mail size={20} className="text-primary" />;
      default:
        return <Settings size={20} className="text-primary" />;
    }
  };

  const SpaceActions = ({ space }: { space: Space }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleEditSpace(space)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleDuplicateSpace(space)}>
          <Copy className="h-4 w-4 mr-2" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleToggleVisibility(space.id)}>
          {space.isPrivate ? (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Make Public
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Make Private
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => handleDeleteSpace(space.id)}
          className="text-red-600 dark:text-red-400"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <SettingsLayout activeSection="spaces" title="Spaces Configuration">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Spaces Configuration</h2>
            <p className="text-muted-foreground">
              Configure which spaces are available and who can access them
            </p>
          </div>
          <Button onClick={handleCreateSpace} className="bg-indigo-600 hover:bg-indigo-700">
            Show Preview
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Manage Spaces</CardTitle>
                <CardDescription>
                  Configure visibility, access permissions, and labels for each space
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  <List className="h-4 w-4 mr-1" />
                  Table View
                </Button>
                <Button
                  variant={viewMode === 'card' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('card')}
                >
                  <Grid3X3 className="h-4 w-4 mr-1" />
                  Card View
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'table' ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Space</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Custom Name</TableHead>
                    <TableHead>Access</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {spaces.map((space) => (
                    <TableRow key={space.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getSpaceIcon(space.name)}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{space.name}</span>
                              {space.isSoon && (
                                <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                                  Soon
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{space.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={space.isActive}
                          onCheckedChange={() => handleToggleStatus(space.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{space.name}</span>
                          <Edit className="h-3 w-3 text-gray-400" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={getAccessLabel(space) === 'Premium' ? 'default' : 'secondary'}
                          className={getAccessLabel(space) === 'Free' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {getAccessLabel(space)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{getPermissionsLabel(space)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <SpaceActions space={space} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {spaces.map((space) => (
                  <Card key={space.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          {getSpaceIcon(space.name)}
                          <div>
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-base">{space.name}</CardTitle>
                              {space.isSoon && (
                                <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">
                                  Soon
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{space.description}</p>
                          </div>
                        </div>
                        <SpaceActions space={space} />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Status</span>
                          <Switch
                            checked={space.isActive}
                            onCheckedChange={() => handleToggleStatus(space.id)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Access</span>
                          <Badge 
                            variant={getAccessLabel(space) === 'Premium' ? 'default' : 'secondary'}
                            className={getAccessLabel(space) === 'Free' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {getAccessLabel(space)}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Permissions</span>
                          <span className="text-sm">{getPermissionsLabel(space)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <SpaceSettingsDialog
          space={editingSpace}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSaveSpace}
        />
      </div>
    </SettingsLayout>
  );
};

export default Spaces;
