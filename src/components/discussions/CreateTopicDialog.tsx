
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useDiscussions } from '@/hooks/useDiscussions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateTopicDialogProps {
  onSuccess?: () => void;
}

const CreateTopicDialog: React.FC<CreateTopicDialogProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const { createTopic } = useDiscussions();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('MessageSquare');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description) {
      toast({
        title: "Campos incompletos",
        description: "Por favor preencha todos os campos obrigatórios.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    createTopic({
      name,
      description,
      icon,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      createdBy: 'user1', // In a real app, this would be the current user's ID
    });
    
    toast({
      title: "Tópico criado",
      description: `Seu tópico "${name}" foi criado com sucesso`,
      duration: 3000,
    });
    
    setOpen(false);
    setName('');
    setDescription('');
    setIcon('MessageSquare');
    
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="flex items-center gap-2 bg-nortech-purple hover:bg-nortech-purple/90"
        >
          <Plus size={16} />
          <span>Criar Tópico</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Tópico</DialogTitle>
          <DialogDescription>
            Crie um novo tópico de discussão para a comunidade.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Tópico</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite um nome para o tópico"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva do que se trata este tópico"
              required
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon">Ícone</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um ícone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MessageSquare">Discussão</SelectItem>
                <SelectItem value="TrendingUp">Crescimento</SelectItem>
                <SelectItem value="Users">Comunidade</SelectItem>
                <SelectItem value="Clock">Tempo</SelectItem>
                <SelectItem value="BookOpen">Aprendizado</SelectItem>
                <SelectItem value="Briefcase">Trabalho</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-nortech-purple hover:bg-nortech-purple/90">
              Criar Tópico
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTopicDialog;
