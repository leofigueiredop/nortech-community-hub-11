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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTopicCreated?: () => void;
}

const CreateTopicDialog: React.FC<CreateTopicDialogProps> = ({ open, onOpenChange, onTopicCreated }) => {
  const { toast } = useToast();
  const { createTopic } = useDiscussions();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('MessageSquare');
  const [selectedIcon, setSelectedIcon] = useState('MessageSquare');
  const [selectedColor, setSelectedColor] = useState('blue');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedAccessLevel, setSelectedAccessLevel] = useState('free');
  const [openState, setOpenState] = useState(open);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your topic",
        variant: "destructive",
      });
      return;
    }
    
    // Create topic object
    const newTopic: Partial<DiscussionTopic> = {
      title,
      description,
      icon: selectedIcon,
      color: selectedColor,
      is_featured: false,
      is_private: isPrivate,
      access_level: selectedAccessLevel as 'free' | 'premium' | 'premium_plus',
      community_id: 'current-community-id' // This should be replaced with actual community ID
    };
    
    // Mock API call
    createTopic(newTopic)
      .then(() => {
        toast({
          title: "Topic created",
          description: "Your new discussion topic has been created successfully",
        });
        onTopicCreated?.();
        onOpenChange(false);
        resetForm();
      })
      .catch((error) => {
        toast({
          title: "Error creating topic",
          description: error.message,
          variant: "destructive",
        });
      });
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setIcon('MessageSquare');
    setSelectedIcon('MessageSquare');
    setSelectedColor('blue');
    setIsPrivate(false);
    setSelectedAccessLevel('free');
  };

  return (
    <Dialog open={openState} onOpenChange={setOpenState}>
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
            <Label htmlFor="title">Nome do Tópico</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
