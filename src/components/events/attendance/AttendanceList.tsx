
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Search, X } from 'lucide-react';

interface Attendee {
  email: string;
  name: string;
  present: boolean;
  pointsAwarded: boolean;
}

interface AttendanceListProps {
  attendees: Attendee[];
}

const AttendanceList: React.FC<AttendanceListProps> = ({ attendees }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredAttendees = attendees.filter(
    attendee => 
      attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search attendees..." 
          className="pl-8" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttendees.length > 0 ? (
              filteredAttendees.map((attendee, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{attendee.name}</TableCell>
                  <TableCell>{attendee.email}</TableCell>
                  <TableCell>
                    {attendee.present ? (
                      <Badge className="bg-green-100 text-green-800 flex w-fit items-center gap-1">
                        <CheckCircle size={12} />
                        Present
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex w-fit items-center gap-1">
                        <X size={12} />
                        Absent
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {attendee.pointsAwarded ? (
                      <Badge className="bg-blue-100 text-blue-800 flex w-fit items-center gap-1">
                        <CheckCircle size={12} />
                        Awarded
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex w-fit items-center gap-1">
                        <Clock size={12} />
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No attendees found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AttendanceList;
