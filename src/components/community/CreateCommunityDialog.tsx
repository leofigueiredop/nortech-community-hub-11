import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const categories = [
  { value: 'education', label: 'Educacional' },
  { value: 'crypto', label: 'Cripto' },
  { value: 'health', label: 'Saúde' },
  { value: 'technology', label: 'Tecnologia' },
  { value: 'business', label: 'Negócios' },
];

interface CreateCommunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateCommunityDialog({
  open,
  onOpenChange,
}: CreateCommunityDialogProps) {
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!name || !category) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('newCommunityName', name);
    localStorage.setItem('newCommunityCategory', category);
    
    toast({
      title: "Ótimo!",
      description: "Vamos configurar sua nova comunidade.",
    });
    
    onOpenChange(false);
    navigate('/onboarding/membership-plans');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar nova comunidade</DialogTitle>
          <DialogDescription>
            Configure sua nova comunidade. Você poderá personalizar mais detalhes depois.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome da comunidade</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Minha Comunidade"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate}>
            Criar e Personalizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
