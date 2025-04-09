
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Medal, Award } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  level: number;
}

// Mock data for the leaderboard
const LEADERBOARD_USERS: LeaderboardUser[] = [
  {
    id: '1',
    name: 'Maria Silva',
    avatar: '/placeholder.svg',
    points: 1250,
    level: 5
  },
  {
    id: '2',
    name: 'João Santos',
    avatar: '/placeholder.svg',
    points: 980,
    level: 4
  },
  {
    id: '3',
    name: 'Ana Oliveira',
    avatar: '/placeholder.svg',
    points: 875,
    level: 4
  },
  {
    id: '4',
    name: 'Pedro Costa',
    avatar: '/placeholder.svg',
    points: 720,
    level: 3
  },
  {
    id: '5',
    name: 'Beatriz Martins',
    avatar: '/placeholder.svg',
    points: 650,
    level: 3
  },
  {
    id: '6',
    name: 'Carlos Ferreira',
    avatar: '/placeholder.svg',
    points: 520,
    level: 2
  },
  {
    id: '7',
    name: 'Sofia Rodrigues',
    avatar: '/placeholder.svg',
    points: 480,
    level: 2
  },
  {
    id: '8',
    name: 'Lucas Pereira',
    avatar: '/placeholder.svg',
    points: 420,
    level: 2
  },
  {
    id: '9',
    name: 'Mariana Alves',
    avatar: '/placeholder.svg',
    points: 350,
    level: 1
  },
  {
    id: '10',
    name: 'Gabriel Ribeiro',
    avatar: '/placeholder.svg',
    points: 310,
    level: 1
  }
];

const LeaderboardComponent: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Ranking da Comunidade</CardTitle>
            <CardDescription>Usuários com mais pontos na plataforma</CardDescription>
          </div>
          <Trophy className="h-6 w-6 text-nortech-purple" />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Posição</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead className="text-right">Pontos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {LEADERBOARD_USERS.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center justify-center">
                    {index === 0 ? (
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    ) : index === 1 ? (
                      <Medal className="h-5 w-5 text-gray-400" />
                    ) : index === 2 ? (
                      <Medal className="h-5 w-5 text-amber-700" />
                    ) : (
                      <span className="font-medium text-muted-foreground">{index + 1}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-nortech-purple" />
                    <span>{user.level}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold">{user.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LeaderboardComponent;
