
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useDiscussions } from '@/hooks/useDiscussions';
import { DiscussionTopic } from '@/types/discussion';

const CreateTopicDialog = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const { createTopic } = useDiscussions();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast({
        title: 'Campo obrigatório',
        description: 'O título do tópico é obrigatório.',
        variant: 'destructive'
      });
      return;
    }
    
    setLoading(true);
    try {
      const topicData: Partial<DiscussionTopic> = {
        title,
        description,
        is_private: isPrivate,
        is_featured: isFeatured,
        icon: 'MessageSquare',
        color: 'blue',
        access_level: 'free'
      };
      
      await createTopic(topicData);
      
      toast({
        title: 'Tópico criado',
        description: 'O tópico foi criado com sucesso!'
      });
      
      // Reset form and close dialog
      setTitle('');
      setDescription('');
      setIsPrivate(false);
      setIsFeatured(false);
      setOpen(false);
    } catch (error) {
      console.error('Erro ao criar tópico:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao criar o tópico.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Button onClick={() => setOpen(true)}>Novo Tópico</Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar novo tópico</DialogTitle>
            <DialogDescription>
              Adicione um novo tópico de discussão para a comunidade.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ex: Perguntas frequentes" 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Uma breve descrição sobre o tópico" 
                  rows={3}
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="is-private" 
                    checked={isPrivate}
                    onChange={e => setIsPrivate(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="is-private">Tópico privado</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox"
                    id="is-featured"
                    checked={isFeatured}
                    onChange={e => setIsFeatured(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="is-featured">Destacado</Label>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Criando...' : 'Criar Tópico'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateTopicDialog;
