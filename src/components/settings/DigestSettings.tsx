
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Image, Link, SmilePlus } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from '@/components/ui/card';

const DigestSettings: React.FC = () => {
  const { toast } = useToast();
  const [digestEnabled, setDigestEnabled] = useState(true);
  const [hidePopularPosts, setHidePopularPosts] = useState(false);
  const [hidePopularComments, setHidePopularComments] = useState(false);
  const [hideStats, setHideStats] = useState(false);
  const [hideNewMembers, setHideNewMembers] = useState(false);
  
  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações do digest foram salvas com sucesso.",
    });
  };

  return (
    <Card className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <CardContent className="p-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-nortech-dark-blue">Configurações do digest por email</h2>
          <p className="text-nortech-text-muted">
            Os emails de digest semanal incluem um resumo personalizado dos posts populares, comentários e mais. 
            Cada membro receberá um digest contendo apenas conteúdo dos espaços que participa.
          </p>
        </div>
        
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold text-nortech-dark-blue block">
                Ativar digest semanal
              </Label>
              <p className="text-nortech-text-muted mt-1">
                Se ativado, um digest personalizado será enviado para seus membros às quintas-feiras, começando às 9h. 
                Os emails podem levar de 4 a 5 horas para serem enviados e os membros têm a opção de cancelar a inscrição.
              </p>
            </div>
            <Switch checked={digestEnabled} onCheckedChange={setDigestEnabled} />
          </div>
          
          {digestEnabled && (
            <div className="bg-gray-800 p-6 rounded-xl space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="digest-subject" className="text-base font-semibold text-white">
                    Assunto
                  </Label>
                  <div className="text-gray-400 tooltip-container">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-700 text-xs">?</span>
                    <div className="tooltip">O assunto do email de digest enviado aos membros</div>
                  </div>
                </div>
                <Input 
                  id="digest-subject" 
                  placeholder="Assunto" 
                  className="bg-gray-900 border-gray-700 text-white" 
                  defaultValue="Esta semana na sua Comunidade: 24 - 30 Abril, 2025"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="digest-introduction" className="text-base font-semibold text-white">
                    Introdução
                  </Label>
                  <div className="text-gray-400 tooltip-container">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-700 text-xs">?</span>
                    <div className="tooltip">Este texto será adicionado ao topo de todos os digests</div>
                  </div>
                </div>
                <Textarea 
                  id="digest-introduction" 
                  placeholder="Introdução" 
                  className="bg-gray-900 border-gray-700 text-white min-h-[150px]" 
                  defaultValue="Esta introdução será adicionada ao topo de todos os digests futuros. Você pode definir uma introdução permanente, ou atualizar semanalmente antes das 9h de quinta-feira para usá-la como newsletter."
                />
                <div className="flex gap-3">
                  <Button variant="ghost" size="sm" className="text-gray-400">
                    <Bold size={18} />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400">
                    <Image size={18} />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400">
                    <Link size={18} />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400">
                    <SmilePlus size={18} />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-semibold text-white block">
                      Ocultar posts populares
                    </Label>
                    <p className="text-gray-400 mt-1">
                      Se ativado, a seção de posts populares será ocultada do digest semanal.
                    </p>
                  </div>
                  <Switch checked={hidePopularPosts} onCheckedChange={setHidePopularPosts} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-semibold text-white block">
                      Ocultar comentários populares
                    </Label>
                    <p className="text-gray-400 mt-1">
                      Se ativado, a seção de comentários populares será ocultada do digest semanal.
                    </p>
                  </div>
                  <Switch checked={hidePopularComments} onCheckedChange={setHidePopularComments} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-semibold text-white block">
                      Ocultar estatísticas
                    </Label>
                    <p className="text-gray-400 mt-1">
                      Se ativado, a seção de estatísticas será ocultada do digest semanal.
                    </p>
                  </div>
                  <Switch checked={hideStats} onCheckedChange={setHideStats} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-semibold text-white block">
                      Ocultar novos membros
                    </Label>
                    <p className="text-gray-400 mt-1">
                      Se ativado, a seção de novos membros será ocultada do digest semanal.
                    </p>
                  </div>
                  <Switch checked={hideNewMembers} onCheckedChange={setHideNewMembers} />
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end">
            <Button className="bg-nortech-purple hover:bg-nortech-purple/90" onClick={handleSave}>
              Salvar alterações
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DigestSettings;
