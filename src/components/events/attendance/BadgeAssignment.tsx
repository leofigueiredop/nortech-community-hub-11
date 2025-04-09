
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Award, Check, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Badge types with preset colors
const BADGE_TYPES = [
  { id: 'event-attendee', label: 'Event Attendee', color: 'bg-blue-100 text-blue-800' },
  { id: 'speaker', label: 'Speaker', color: 'bg-purple-100 text-purple-800' },
  { id: 'volunteer', label: 'Volunteer', color: 'bg-green-100 text-green-800' },
  { id: 'organizer', label: 'Organizer', color: 'bg-amber-100 text-amber-800' },
  { id: 'vip', label: 'VIP', color: 'bg-red-100 text-red-800' },
];

interface BadgeAssignmentProps {
  attendees: Array<{email: string; name: string; present: boolean; pointsAwarded: boolean}>;
  eventTitle: string;
}

const BadgeAssignment: React.FC<BadgeAssignmentProps> = ({ attendees, eventTitle }) => {
  const [selectedBadges, setSelectedBadges] = useState<string[]>(['event-attendee']);
  const [customBadge, setCustomBadge] = useState('');
  const { toast } = useToast();
  
  const handleBadgeToggle = (badgeId: string) => {
    if (selectedBadges.includes(badgeId)) {
      setSelectedBadges(selectedBadges.filter(id => id !== badgeId));
    } else {
      setSelectedBadges([...selectedBadges, badgeId]);
    }
  };
  
  const handleAddCustomBadge = () => {
    if (!customBadge.trim()) return;
    
    // Create a kebab-case id from the custom badge label
    const customId = `custom-${customBadge.trim().toLowerCase().replace(/\s+/g, '-')}`;
    
    if (!BADGE_TYPES.some(badge => badge.id === customId)) {
      // This would normally add to a database
      console.log(`Added custom badge: ${customBadge}`);
      setSelectedBadges([...selectedBadges, customId]);
    }
    
    setCustomBadge('');
  };
  
  const handleAssignBadges = () => {
    if (selectedBadges.length === 0) {
      toast({
        title: "No badges selected",
        description: "Please select at least one badge to assign",
        variant: "destructive"
      });
      return;
    }
    
    // Get count of attendees who will receive badges (those who are present and received points)
    const eligibleAttendees = attendees.filter(a => a.present && a.pointsAwarded);
    
    if (eligibleAttendees.length === 0) {
      toast({
        title: "No eligible attendees",
        description: "There are no attendees who can receive badges",
        variant: "destructive"
      });
      return;
    }
    
    // This would normally make API calls to assign badges
    const badgeLabels = selectedBadges.map(id => 
      BADGE_TYPES.find(badge => badge.id === id)?.label || id
    );
    
    toast({
      title: "Badges assigned",
      description: `Assigned ${badgeLabels.join(', ')} badges to ${eligibleAttendees.length} attendees`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Select Badges to Assign</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose badges to assign to attendees who were present and received points
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {BADGE_TYPES.map(badge => (
            <Card 
              key={badge.id}
              className={`cursor-pointer transition-all ${
                selectedBadges.includes(badge.id) 
                  ? 'border-primary ring-2 ring-primary/20' 
                  : ''
              }`}
              onClick={() => handleBadgeToggle(badge.id)}
            >
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award size={16} className="text-muted-foreground" />
                  <Badge className={badge.color}>{badge.label}</Badge>
                </div>
                {selectedBadges.includes(badge.id) && (
                  <Check size={16} className="text-primary" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="custom-badge">Add Custom Badge</Label>
          <div className="flex gap-2">
            <Input 
              id="custom-badge"
              placeholder="Enter custom badge name"
              value={customBadge}
              onChange={(e) => setCustomBadge(e.target.value)}
            />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleAddCustomBadge}
              disabled={!customBadge.trim()}
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="border-t pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Assignment Summary</h4>
            <p className="text-sm text-muted-foreground">
              {attendees.filter(a => a.present && a.pointsAwarded).length} attendees will receive {selectedBadges.length} badges
            </p>
          </div>
          <Button onClick={handleAssignBadges} disabled={selectedBadges.length === 0}>
            Assign Badges
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BadgeAssignment;
