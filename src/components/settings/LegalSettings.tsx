
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from '@/components/ui/textarea';
import { Copy, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from '@/components/ui/card';

const LegalSettings: React.FC = () => {
  const { toast } = useToast();
  const [customTerms, setCustomTerms] = useState(false);
  const [privacyOption, setPrivacyOption] = useState('template');
  const [termsEditorOpen, setTermsEditorOpen] = useState(false);
  const [privacyEditorOpen, setPrivacyEditorOpen] = useState(false);
  
  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas configurações foram salvas com sucesso",
    });
  };
  
  const copyUrl = (type: 'terms' | 'privacy') => {
    const url = `https://nortech.community/legal/${type}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copiado",
      description: `O link para os ${type === 'terms' ? 'termos de serviço' : 'política de privacidade'} foi copiado para a área de transferência.`,
    });
  };

  return (
    <Card className="bg-gray-900 rounded-2xl text-white shadow-lg overflow-hidden">
      <CardContent className="p-8">
        <h2 className="text-xl font-semibold mb-8">Gerencie os avisos legais da sua comunidade</h2>
        
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Label htmlFor="legal-email" className="text-base font-semibold text-white block mb-2">
                Email jurídico
              </Label>
              <p className="text-gray-400 mb-2">
                Este email será exibido nos termos de uso e política de privacidade da sua comunidade.
              </p>
            </div>
            <div>
              <Input 
                id="legal-email" 
                placeholder="legal@suacomunidade.com" 
                className="bg-gray-800 border-gray-700 text-white" 
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Label htmlFor="legal-address" className="text-base font-semibold text-white block mb-2">
                Endereço jurídico
              </Label>
              <p className="text-gray-400 mb-2">
                Este endereço será exibido nos termos de uso e política de privacidade da sua comunidade.
              </p>
            </div>
            <div>
              <Input 
                id="legal-address" 
                placeholder="Rua Exemplo, 123 - Cidade, Estado, CEP" 
                className="bg-gray-800 border-gray-700 text-white" 
              />
            </div>
          </div>
          
          <div className="h-px bg-gray-800 my-8"></div>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Termos de serviço</h3>
              <p className="text-gray-400 mt-1">
                Novos membros precisarão concordar com estes termos para poder se cadastrar na sua comunidade.
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="text-white border-gray-700 flex items-center gap-2"
                onClick={() => copyUrl('terms')}
              >
                <Copy size={16} /> Copiar URL
              </Button>
              <Button variant="outline" className="text-white border-gray-700 flex items-center gap-2">
                <ExternalLink size={16} /> Visualizar
              </Button>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Switch 
              id="custom-terms" 
              checked={customTerms}
              onCheckedChange={setCustomTerms}
            />
            <div>
              <Label htmlFor="custom-terms" className="text-base font-semibold text-white block">
                Adicionar termos personalizados ao contrato de serviço
              </Label>
              <p className="text-gray-400 mt-1">
                Seus termos personalizados serão exibidos no final como Anexo A.
              </p>
              {customTerms && (
                <Button 
                  variant="outline" 
                  className="mt-3 text-white border-gray-700"
                  onClick={() => setTermsEditorOpen(true)}
                >
                  Editar termos personalizados
                </Button>
              )}
            </div>
          </div>
          
          <div className="h-px bg-gray-800 my-8"></div>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Política de privacidade</h3>
              <p className="text-gray-400 mt-1">
                Novos membros precisarão concordar com esta política para poder se cadastrar na sua comunidade.
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="text-white border-gray-700 flex items-center gap-2"
                onClick={() => copyUrl('privacy')}
              >
                <Copy size={16} /> Copiar URL
              </Button>
              <Button variant="outline" className="text-white border-gray-700 flex items-center gap-2">
                <ExternalLink size={16} /> Visualizar
              </Button>
            </div>
          </div>
          
          <RadioGroup value={privacyOption} onValueChange={setPrivacyOption}>
            <div className="flex items-start gap-3 mb-4">
              <RadioGroupItem value="template" id="template" className="mt-1" />
              <div>
                <Label htmlFor="template" className="text-base font-semibold text-white block">
                  Usar modelo de política de privacidade da Nortech
                </Label>
                <p className="text-gray-400 mt-1">
                  Nossa política padrão abrange os requisitos legais mais comuns.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 mb-4">
              <RadioGroupItem value="custom" id="custom" className="mt-1" />
              <div>
                <Label htmlFor="custom" className="text-base font-semibold text-white block">
                  Criar sua própria política de privacidade (Recomendado)
                </Label>
                <p className="text-gray-400 mt-1">
                  Personalize completamente sua política de privacidade.
                </p>
                {privacyOption === 'custom' && (
                  <Button 
                    variant="outline" 
                    className="mt-3 text-white border-gray-700"
                    onClick={() => setPrivacyEditorOpen(true)}
                  >
                    Editar política de privacidade
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <RadioGroupItem value="link" id="link" className="mt-1" />
              <div>
                <Label htmlFor="link" className="text-base font-semibold text-white block">
                  Fornecer um link para sua própria página de política de privacidade
                </Label>
                {privacyOption === 'link' && (
                  <Input 
                    placeholder="https://seusite.com/privacidade" 
                    className="mt-3 bg-gray-800 border-gray-700 text-white" 
                  />
                )}
              </div>
            </div>
          </RadioGroup>
          
          <div className="flex justify-end">
            <Button className="bg-nortech-purple hover:bg-nortech-purple/90" onClick={handleSave}>
              Salvar alterações
            </Button>
          </div>
        </div>
        
        {/* Editor Modal for Terms of Service */}
        <Dialog open={termsEditorOpen} onOpenChange={setTermsEditorOpen}>
          <DialogContent className="bg-gray-900 text-white max-w-4xl">
            <DialogHeader>
              <DialogTitle>Editar termos personalizados</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea 
                placeholder="Insira seus termos personalizados aqui..." 
                className="min-h-[300px] bg-gray-800 border-gray-700 text-white" 
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setTermsEditorOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  className="bg-nortech-purple hover:bg-nortech-purple/90"
                  onClick={() => {
                    setTermsEditorOpen(false);
                    toast({
                      title: "Termos atualizados",
                      description: "Os termos personalizados foram atualizados com sucesso."
                    });
                  }}
                >
                  Salvar termos
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Editor Modal for Privacy Policy */}
        <Dialog open={privacyEditorOpen} onOpenChange={setPrivacyEditorOpen}>
          <DialogContent className="bg-gray-900 text-white max-w-4xl">
            <DialogHeader>
              <DialogTitle>Editar política de privacidade</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea 
                placeholder="Insira sua política de privacidade aqui..." 
                className="min-h-[300px] bg-gray-800 border-gray-700 text-white" 
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setPrivacyEditorOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  className="bg-nortech-purple hover:bg-nortech-purple/90"
                  onClick={() => {
                    setPrivacyEditorOpen(false);
                    toast({
                      title: "Política atualizada",
                      description: "A política de privacidade foi atualizada com sucesso."
                    });
                  }}
                >
                  Salvar política
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default LegalSettings;
