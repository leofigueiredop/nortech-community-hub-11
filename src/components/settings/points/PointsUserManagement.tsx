
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, EditIcon, RotateCcw, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

// Mock user data
const mockUsers = [
  { id: 1, name: 'João Silva', email: 'joao@example.com', totalPoints: 750, level: 3 },
  { id: 2, name: 'Maria Souza', email: 'maria@example.com', totalPoints: 1250, level: 4 },
  { id: 3, name: 'Carlos Ferreira', email: 'carlos@example.com', totalPoints: 350, level: 2 },
  { id: 4, name: 'Ana Oliveira', email: 'ana@example.com', totalPoints: 2100, level: 5 },
  { id: 5, name: 'Pedro Santos', email: 'pedro@example.com', totalPoints: 90, level: 1 }
];

const PointsUserManagement: React.FC = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editedPoints, setEditedPoints] = useState<number | ''>('');
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditedPoints(user.totalPoints);
  };
  
  const handleSavePoints = () => {
    if (selectedUser && editedPoints !== '') {
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, totalPoints: Number(editedPoints) } 
          : user
      );
      
      setUsers(updatedUsers);
      setSelectedUser(null);
      
      toast({
        title: "Points updated",
        description: `Updated points for ${selectedUser.name} to ${editedPoints}.`
      });
    }
  };
  
  const handleResetPoints = (userId: number) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, totalPoints: 0 } : user
    );
    
    setUsers(updatedUsers);
    
    const user = users.find(u => u.id === userId);
    
    toast({
      title: "Points reset",
      description: `Reset points for ${user?.name} to 0.`
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Points Management</CardTitle>
        <CardDescription>
          Modify or reset individual user point balances
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Total Points</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.level}</TableCell>
                      <TableCell>{user.totalPoints}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditUser(user)}
                              >
                                <EditIcon className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit User Points</DialogTitle>
                                <DialogDescription>
                                  Update the points balance for {user.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="user-points">Total Points</Label>
                                  <Input
                                    id="user-points"
                                    type="number"
                                    min="0"
                                    value={editedPoints}
                                    onChange={(e) => setEditedPoints(e.target.value === '' ? '' : Number(e.target.value))}
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                  <Button onClick={handleSavePoints}>Save Changes</Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleResetPoints(user.id)}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsUserManagement;
