
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface Attendee {
  email: string;
  name: string;
  present: boolean;
  pointsAwarded: boolean;
}

interface AttendanceListProps {
  attendees: Attendee[];
  onUpdateAttendees: React.Dispatch<React.SetStateAction<Attendee[]>>;
}

const AttendanceList: React.FC<AttendanceListProps> = ({ 
  attendees, 
  onUpdateAttendees 
}) => {
  const { toast } = useToast();
  
  const handleTogglePresence = (index: number) => {
    onUpdateAttendees(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], present: !updated[index].present };
      return updated;
    });
  };
  
  const markAllPresent = () => {
    onUpdateAttendees(prev => prev.map(attendee => ({ ...attendee, present: true })));
    toast({
      title: "Attendance updated",
      description: "All attendees have been marked as present",
    });
  };
  
  if (attendees.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No attendees have been added yet. Import a CSV to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button size="sm" variant="outline" onClick={markAllPresent}>
          Mark All Present
        </Button>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Present</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-24">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendees.map((attendee, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Checkbox 
                    checked={attendee.present} 
                    onCheckedChange={() => handleTogglePresence(index)}
                  />
                </TableCell>
                <TableCell>{attendee.name}</TableCell>
                <TableCell>{attendee.email}</TableCell>
                <TableCell>
                  {attendee.pointsAwarded ? (
                    <span className="text-green-600">✓ Awarded</span>
                  ) : (
                    <span className="text-gray-400">Pending</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AttendanceList;
