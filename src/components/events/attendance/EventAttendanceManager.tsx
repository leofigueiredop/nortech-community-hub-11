
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUploader } from '@/components/library/management/form/FileUploader';
import CSVUploader from './CSVUploader';
import AttendanceList from './AttendanceList';
import BadgeAssignment from './BadgeAssignment';
import { Download, Upload, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePointsTracking } from '@/utils/pointsTracking';

interface EventAttendanceManagerProps {
  eventId: number;
  eventTitle: string;
}

const EventAttendanceManager: React.FC<EventAttendanceManagerProps> = ({ eventId, eventTitle }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [attendees, setAttendees] = useState<Array<{email: string; name: string; present: boolean; pointsAwarded: boolean}>>([]);
  const [pointsValue, setPointsValue] = useState(20); // Default points value
  const { toast } = useToast();
  const { trackEventParticipation } = usePointsTracking();
  
  const handleAttendanceData = (data: Array<{email: string; name: string}>) => {
    // Process the uploaded attendance data
    const processedData = data.map(attendee => ({
      ...attendee,
      present: true,
      pointsAwarded: false
    }));
    
    setAttendees(processedData);
    setActiveTab('review');
    
    toast({
      title: "Attendance data uploaded",
      description: `${data.length} attendees loaded successfully`,
    });
  };
  
  const handleAwardPoints = () => {
    // In a real app, this would make API calls to award points to each attendee
    const updatedAttendees = attendees.map(attendee => ({
      ...attendee,
      pointsAwarded: true
    }));
    
    setAttendees(updatedAttendees);
    
    // For demo purposes, let's assume we award points to the current user
    trackEventParticipation(eventTitle);
    
    toast({
      title: "Points awarded",
      description: `${attendees.length} attendees received ${pointsValue} points each`,
    });
  };
  
  const handleDownloadSample = () => {
    // Create a sample CSV content
    const csvContent = 'email,name\njohn.doe@example.com,John Doe\njane.smith@example.com,Jane Smith';
    
    // Create a blob and download it
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_attendance.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Event Attendance Management</CardTitle>
        <CardDescription>
          Upload attendance, assign points, and manage badges for event attendees
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Attendance</TabsTrigger>
            <TabsTrigger value="review" disabled={attendees.length === 0}>Review & Assign</TabsTrigger>
            <TabsTrigger value="badges" disabled={!attendees.some(a => a.pointsAwarded)}>Assign Badges</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4 py-4">
            <div className="flex justify-end mb-4">
              <Button variant="outline" size="sm" onClick={handleDownloadSample} className="gap-2">
                <Download size={16} />
                Download Sample CSV
              </Button>
            </div>
            
            <CSVUploader onUploadComplete={handleAttendanceData} />
            
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Upload a CSV file with attendee information to mark them as present and award points.</p>
              <p>The CSV should include the following columns: email, name</p>
            </div>
          </TabsContent>
          
          <TabsContent value="review" className="space-y-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <h3 className="text-lg font-medium">Review Attendance</h3>
                <p className="text-sm text-muted-foreground">
                  {attendees.length} attendees loaded
                </p>
              </div>
              <Button onClick={handleAwardPoints} disabled={attendees.length === 0 || attendees.every(a => a.pointsAwarded)} className="gap-2">
                <Upload size={16} />
                Award Points ({pointsValue} each)
              </Button>
            </div>
            
            <AttendanceList attendees={attendees} />
          </TabsContent>
          
          <TabsContent value="badges" className="space-y-4 py-4">
            <BadgeAssignment attendees={attendees} eventTitle={eventTitle} />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t px-6 py-4">
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>{attendees.filter(a => a.present).length} attendees marked present</span>
          </div>
        </div>
        
        {activeTab !== 'upload' && (
          <Button variant="outline" onClick={() => setActiveTab('upload')}>
            Back to Upload
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventAttendanceManager;
