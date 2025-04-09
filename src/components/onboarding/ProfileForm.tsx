
import React from 'react';
import { usePoints } from '@/context/PointsContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

export const ProfileForm: React.FC = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Seu Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <ProfilePointsInfo />
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" placeholder="Seu nome" defaultValue="João Silva" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="seu@email.com" defaultValue="joao@exemplo.com" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Sobre você</Label>
            <Textarea 
              id="bio" 
              placeholder="Uma breve descrição sobre você" 
              defaultValue="Profissional de tecnologia interessado em comunidades digitais e desenvolvimento de carreira."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="interests">Interesses</Label>
            <Input id="interests" placeholder="Ex: Tecnologia, Desenvolvimento, Carreira" defaultValue="Desenvolvimento, AI, Comunidades" />
          </div>
          
          <Button type="submit" className="w-full bg-nortech-purple hover:bg-nortech-purple/90">
            Salvar Perfil
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export const ProfilePointsInfo: React.FC = () => {
  const { totalPoints, getUserLevel } = usePoints();
  const { level, nextLevel, progress } = getUserLevel();

  return (
    <Card className="mb-4 border-nortech-purple/30">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-nortech-purple" />
            <span className="font-medium">Level {level}</span>
          </div>
          <div className="flex items-center">
            <span className="text-lg font-bold text-nortech-purple">{totalPoints}</span>
            <span className="text-xs ml-1 text-muted-foreground">points</span>
          </div>
        </div>
        <Progress value={progress} className="h-2 mt-2" />
        <p className="text-xs text-muted-foreground mt-1 text-right">{progress}% to Level {nextLevel}</p>
      </CardContent>
    </Card>
  );
};
