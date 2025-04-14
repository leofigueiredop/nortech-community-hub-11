
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

interface CreateDiscussionDialogProps {
  topicId: string;
  topicName: string;
  onSuccess?: () => void;
}

const CreateDiscussionDialog: React.FC<CreateDiscussionDialogProps> = ({ topicId, topicName, onSuccess }) => {
  const { toast } = useToast();
  const { createDiscussion } = useDiscussions();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [format, setFormat] = useState<'discussion' | 'question'>('discussion');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
      toast({
        title: "Campos incompletos",
        description: "Por favor preencha todos os campos obrigatórios.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // Parse tags from comma-separated string
    const tagsList = tags.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    // Mock author data - in a real app, this would come from auth context
    const author = {
      id: 'user1',
      name: 'Carlos Silva',
      avatar: '/placeholder.svg',
      level: 3,
      xp: 250
    };
    
    createDiscussion(topicId, {
      title,
      description,
      author,
      tags: tagsList,
      format
    });
    
    toast({
      title: "Discussão criada",
      description: `Sua discussão "${title}" foi criada no tópico ${topicName}`,
      duration: 3000,
    });
    
    setOpen(false);
    setTitle('');
    setDescription('');
    setTags('');
    setFormat('discussion');
    
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
          <span>Iniciar Discussão</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Nova Discussão em {topicName}</DialogTitle>
          <DialogDescription>
            Crie uma nova discussão para compartilhar com a comunidade.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite um título claro e conciso"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="format">Formato</Label>
            <Select value={format} onValueChange={(value: 'discussion' | 'question') => setFormat(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="discussion">Discussão Geral</SelectItem>
                <SelectItem value="question">Pergunta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione mais detalhes sobre sua discussão"
              required
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Ex: Carreira, Desenvolvimento, Iniciantes"
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-nortech-purple hover:bg-nortech-purple/90">
              Publicar Discussão
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDiscussionDialog;
