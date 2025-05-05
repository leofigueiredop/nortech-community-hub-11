import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { ImageIcon } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

const UserSettingsProfile = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [name, setName] = React.useState(user?.name || '');
  const [bio, setBio] = React.useState(user?.bio || '');
  const [location, setLocation] = React.useState('São Paulo, Brazil');
  const [username, setUsername] = React.useState(user?.email?.split('@')[0] || '');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Com Supabase, temos que atualizar o perfil na tabela community_members
      await updateProfile({
        name,
        bio,
      });
      
      toast({
        title: "Perfil atualizado",
        description: "Suas informações de perfil foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar seu perfil. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <MainLayout title="Configurações de Perfil">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Configurações de Perfil</h1>
        
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6 space-y-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="sm" 
                variant="outline" 
                className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                type="button"
              >
                <ImageIcon className="h-4 w-4" />
                <span className="sr-only">Alterar foto</span>
              </Button>
            </div>
            <div>
              <h2 className="font-semibold text-lg">Foto de perfil</h2>
              <p className="text-sm text-muted-foreground">
                Esta foto será exibida em seu perfil e comentários
              </p>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm">Carregar imagem</Button>
                <Button variant="outline" size="sm">Remover</Button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Nome de usuário</Label>
                <Input 
                  id="username" 
                  value={username}
                  onChange={e => setUsername(e.target.value)} 
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={user?.email || ''} 
                  disabled
                  className="bg-gray-100 dark:bg-slate-800"
                />
                <p className="text-xs text-muted-foreground">
                  Para alterar seu email, acesse a seção de segurança
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input 
                  id="location" 
                  value={location}
                  onChange={e => setLocation(e.target.value)} 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea 
                id="bio" 
                value={bio} 
                onChange={e => setBio(e.target.value)}
                placeholder="Conte um pouco sobre você..."
                rows={4}
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? "Salvando..." : "Salvar alterações"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserSettingsProfile; 