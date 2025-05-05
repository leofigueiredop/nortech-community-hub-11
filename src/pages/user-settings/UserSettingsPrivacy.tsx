import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Eye, Download, Lock } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

const UserSettingsPrivacy = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [showPoints, setShowPoints] = useState(true);
  const [showCompletedCourses, setShowCompletedCourses] = useState(true);
  const [allowDataCollection, setAllowDataCollection] = useState(true);
  const [downloadRequested, setDownloadRequested] = useState(false);
  
  // Simula carregar configurações do Supabase
  useEffect(() => {
    // Em um cenário real: 
    // const loadPrivacySettings = async () => {
    //   const { data, error } = await supabase
    //     .from('user_privacy_settings')
    //     .select('*')
    //     .eq('user_id', user.id)
    //     .single();
    //   
    //   if (data) {
    //     setProfileVisibility(data.profile_visibility);
    //     setShowPoints(data.show_points);
    //     setShowCompletedCourses(data.show_completed_courses);
    //     setAllowDataCollection(data.allow_data_collection);
    //   }
    // };
    // 
    // loadPrivacySettings();
    
    console.log("Carregando configurações de privacidade para:", user?.id);
  }, [user]);
  
  const handleVisibilityChange = async (value: string) => {
    setIsLoading(true);
    
    try {
      setProfileVisibility(value);
      
      // Em um cenário real:
      // await supabase
      //  .from('user_privacy_settings')
      //  .update({ profile_visibility: value })
      //  .eq('user_id', user.id);
      
      toast({
        title: "Visibilidade do perfil atualizada",
        description: `Seu perfil agora está ${value === 'public' ? 'público' : value === 'members-only' ? 'visível apenas para membros' : 'privado'}.`,
      });
    } catch (error) {
      console.error("Erro ao atualizar visibilidade:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar suas configurações de privacidade.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleSetting = async (setting: string, value: boolean) => {
    setIsLoading(true);
    
    try {
      switch(setting) {
        case 'showPoints':
          setShowPoints(value);
          break;
        case 'showCompletedCourses':
          setShowCompletedCourses(value);
          break;
        case 'allowDataCollection':
          setAllowDataCollection(value);
          break;
      }
      
      // Em um cenário real:
      // await supabase
      //  .from('user_privacy_settings')
      //  .update({ [setting]: value })
      //  .eq('user_id', user.id);
      
      toast({
        title: "Configuração atualizada",
        description: "Suas preferências de privacidade foram atualizadas.",
      });
    } catch (error) {
      console.error("Erro ao atualizar configuração:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar suas configurações de privacidade.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownloadData = async () => {
    setDownloadRequested(true);
    
    try {
      // Em um cenário real:
      // await supabase
      //  .from('data_export_requests')
      //  .insert({ user_id: user.id, status: 'pending' });
      
      toast({
        title: "Exportação de dados solicitada",
        description: "Seus dados serão preparados para download. Isso pode levar alguns minutos.",
      });
      
      // Simula o tempo de espera para a exportação ficar pronta
      setTimeout(() => {
        setDownloadRequested(false);
        
        toast({
          title: "Exportação de dados pronta",
          description: "Sua exportação de dados está pronta para download.",
          variant: "default",
        });
      }, 5000);
    } catch (error) {
      console.error("Erro ao solicitar exportação:", error);
      toast({
        title: "Erro na solicitação",
        description: "Não foi possível processar sua solicitação de exportação de dados.",
        variant: "destructive",
      });
      setDownloadRequested(false);
    }
  };
  
  return (
    <MainLayout title="Configurações de Privacidade">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Configurações de Privacidade</h1>
        
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-500" />
                <h2 className="text-xl font-semibold">Visibilidade do Perfil</h2>
              </div>
              
              <RadioGroup 
                value={profileVisibility} 
                onValueChange={handleVisibilityChange}
                disabled={isLoading}
              >
                <div className="flex items-start space-x-3 py-2">
                  <RadioGroupItem value="public" id="public" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="public" className="font-medium">
                      Público
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Qualquer pessoa pode ver seu perfil, conquistas e contribuições de conteúdo.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 py-2">
                  <RadioGroupItem value="members-only" id="members-only" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="members-only" className="font-medium">
                      Apenas Membros
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Apenas os membros da comunidade podem ver seu perfil e atividades.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 py-2">
                  <RadioGroupItem value="private" id="private" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="private" className="font-medium">
                      Privado
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Apenas você e os administradores podem ver suas informações de perfil.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-amber-500" />
                <h2 className="text-xl font-semibold">Informações do Perfil</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mostrar pontos e nível</p>
                    <p className="text-sm text-muted-foreground">
                      Exibir seus pontos e nível em seu perfil público
                    </p>
                  </div>
                  <Switch 
                    checked={showPoints} 
                    onCheckedChange={(value) => handleToggleSetting('showPoints', value)} 
                    disabled={isLoading}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Mostrar cursos concluídos</p>
                    <p className="text-sm text-muted-foreground">
                      Exibir seus cursos concluídos e certificados em seu perfil
                    </p>
                  </div>
                  <Switch 
                    checked={showCompletedCourses} 
                    onCheckedChange={(value) => handleToggleSetting('showCompletedCourses', value)} 
                    disabled={isLoading}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Consentimento de coleta de dados</p>
                    <p className="text-sm text-muted-foreground">
                      Permitir que coletemos dados de uso anonimizados para melhorar sua experiência
                    </p>
                  </div>
                  <Switch 
                    checked={allowDataCollection} 
                    onCheckedChange={(value) => handleToggleSetting('allowDataCollection', value)} 
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-purple-500" />
                <h2 className="text-xl font-semibold">Seus Dados</h2>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm mb-4">
                  Sua privacidade é importante para nós. Você pode solicitar uma cópia de todos os seus dados pessoais de acordo com os regulamentos de proteção de dados.
                </p>
                <Button 
                  onClick={handleDownloadData}
                  disabled={downloadRequested || isLoading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {downloadRequested ? "Preparando dados..." : "Solicitar exportação de dados"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default UserSettingsPrivacy; 