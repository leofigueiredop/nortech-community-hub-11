
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Trash2, 
  Plus,
  Check,
  DollarSign, 
  Calendar,
  CreditCard,
  FileText,
  FileVideo,
  Download,
  Lock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'react-router-dom';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';

const SubscriptionSettings: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState([
    { 
      id: '1', 
      name: 'Basic Plan', 
      price: 149.99, 
      interval: 'month',
      description: 'Access to community features and basic courses',
      features: ['Community Access', 'Basic Courses', 'Email Support'],
      active: true
    },
    { 
      id: '2', 
      name: 'Premium Plan', 
      price: 299.99, 
      interval: 'month',
      description: 'Full access to all premium content and features',
      features: ['Everything in Basic', 'Premium Courses', 'Advanced Support', 'Private Groups'],
      active: true
    },
    { 
      id: '3', 
      name: 'Annual Plan', 
      price: 2999.99, 
      interval: 'year',
      description: 'Save 15% with our annual subscription',
      features: ['Everything in Premium', '1-on-1 Sessions', 'Priority Support', 'Early Access'],
      active: true
    }
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    price: 0,
    interval: 'month',
    description: '',
    features: ['']
  });

  const handleAddSubscription = () => {
    setSubscriptions([...subscriptions, {
      id: Date.now().toString(),
      ...newSubscription,
      active: true
    }]);
    setNewSubscription({
      name: '',
      price: 0,
      interval: 'month',
      description: '',
      features: ['']
    });
    setIsAddingNew(false);
  };

  const handleDeleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setSubscriptions(subscriptions.map(sub => 
      sub.id === id ? { ...sub, active: !sub.active } : sub
    ));
  };

  const addFeature = () => {
    setNewSubscription({
      ...newSubscription,
      features: [...newSubscription.features, '']
    });
  };

  const updateFeature = (index: number, value: string) => {
    const updatedFeatures = [...newSubscription.features];
    updatedFeatures[index] = value;
    setNewSubscription({
      ...newSubscription,
      features: updatedFeatures
    });
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = [...newSubscription.features];
    updatedFeatures.splice(index, 1);
    setNewSubscription({
      ...newSubscription,
      features: updatedFeatures
    });
  };

  const location = useLocation();
  const fromLibrary = location.state?.fromLibrary;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Planos de Assinatura</h1>
        <Button 
          onClick={() => setIsAddingNew(!isAddingNew)}
          variant={isAddingNew ? "secondary" : "default"}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isAddingNew ? "Cancelar" : "Adicionar Novo Plano"}
        </Button>
      </div>

      <p className="text-gray-500 dark:text-gray-400">
        Crie e gerencie planos de assinatura para sua comunidade. Estes planos estarão disponíveis para compra pelos seus membros.
      </p>

      {fromLibrary && (
        <Card className="border-2 border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-purple-500" />
              Acesso a Conteúdo Premium
            </CardTitle>
            <CardDescription>
              Desbloqueie todo conteúdo premium na biblioteca incluindo PDFs, vídeos e recursos para download
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg flex items-center gap-3">
                <FileText className="h-6 w-6 text-purple-500" />
                <div>
                  <div className="font-medium">PDFs Premium</div>
                  <div className="text-xs text-muted-foreground">Guias para download</div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg flex items-center gap-3">
                <FileVideo className="h-6 w-6 text-purple-500" />
                <div>
                  <div className="font-medium">Vídeos Exclusivos</div>
                  <div className="text-xs text-muted-foreground">Tutoriais detalhados</div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg flex items-center gap-3">
                <Download className="h-6 w-6 text-purple-500" />
                <div>
                  <div className="font-medium">Todos os Downloads</div>
                  <div className="text-xs text-muted-foreground">Salve para uso offline</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
              Assinatura Mensal - R$29,99
            </Button>
            <Button variant="outline" className="w-full sm:w-auto border-purple-300 text-purple-700 hover:bg-purple-100">
              Acesso Único - R$149,99
            </Button>
          </CardFooter>
        </Card>
      )}

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Planos Ativos</TabsTrigger>
          <TabsTrigger value="all">Todos os Planos</TabsTrigger>
          <TabsTrigger value="settings">Configurações de Assinatura</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.filter(sub => sub.active).map((subscription) => (
              <Card key={subscription.id} className="border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    <span>{subscription.name}</span>
                    <span className="text-purple-600">
                      {subscription.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      <span className="text-sm text-gray-400">/{subscription.interval}</span>
                    </span>
                  </CardTitle>
                  <CardDescription>{subscription.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {subscription.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleToggleActive(subscription.id)}>
                    {subscription.active ? "Desativar" : "Ativar"}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteSubscription(subscription.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id} className={`border ${subscription.active ? 'border-gray-200 dark:border-gray-700' : 'border-gray-300 dark:border-gray-600 opacity-70'}`}>
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    <span>{subscription.name}</span>
                    <span className="text-purple-600">
                      {subscription.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      <span className="text-sm text-gray-400">/{subscription.interval}</span>
                    </span>
                  </CardTitle>
                  <CardDescription>{subscription.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {subscription.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleToggleActive(subscription.id)}>
                    {subscription.active ? "Desativar" : "Ativar"}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteSubscription(subscription.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-lg">Gateways de Pagamento</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Configure como os membros podem pagar pelas assinaturas</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium">Cartão de Crédito/Débito (Stripe)</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Aceite pagamentos com cartão de crédito e débito</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <div>
                    <h4 className="font-medium">Pagamentos com Crypto</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Aceite pagamentos com criptomoedas</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <div>
                    <h4 className="font-medium">Período de Teste Gratuito</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ofereça um período de teste gratuito para novos assinantes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Input 
                    type="number" 
                    className="w-20 h-8" 
                    defaultValue="7"
                  />
                  <span className="text-sm">dias</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-lg">Controle de Acesso</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Configure como assinaturas controlam acesso ao conteúdo</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="defaultAccess" className="font-medium">Acesso Padrão ao Conteúdo</Label>
                <Select defaultValue="free">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Livre para Todos</SelectItem>
                    <SelectItem value="paid">Somente Membros Pagantes</SelectItem>
                    <SelectItem value="mixed">Acesso Misto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Permitir Conjuntos de Permissões Personalizados</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Crie conjuntos de permissões personalizados para diferentes tipos de conteúdo</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {isAddingNew && (
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mt-6">
          <h2 className="text-xl font-bold mb-4">Criar Novo Plano de Assinatura</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plan-name">Nome do Plano</Label>
                <Input 
                  id="plan-name" 
                  value={newSubscription.name}
                  onChange={e => setNewSubscription({...newSubscription, name: e.target.value})}
                  placeholder="ex: Plano Básico, Plano Premium"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plan-price">Preço</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">R$</span>
                    <Input 
                      id="plan-price"
                      type="number"
                      className="pl-8"
                      value={newSubscription.price || ''}
                      onChange={e => setNewSubscription({...newSubscription, price: parseFloat(e.target.value)})}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="plan-interval">Intervalo de Cobrança</Label>
                  <Select 
                    value={newSubscription.interval}
                    onValueChange={value => setNewSubscription({...newSubscription, interval: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Mensal</SelectItem>
                      <SelectItem value="quarter">Trimestral</SelectItem>
                      <SelectItem value="year">Anual</SelectItem>
                      <SelectItem value="one-time">Pagamento Único</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="plan-description">Descrição</Label>
              <Input 
                id="plan-description"
                value={newSubscription.description}
                onChange={e => setNewSubscription({...newSubscription, description: e.target.value})}
                placeholder="Breve descrição deste plano"
              />
            </div>
            
            <div>
              <Label className="mb-2 block">Benefícios</Label>
              <div className="space-y-2">
                {newSubscription.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input 
                      value={feature}
                      onChange={e => updateFeature(index, e.target.value)}
                      placeholder={`Benefício ${index + 1}`}
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      type="button"
                      onClick={() => removeFeature(index)}
                      disabled={newSubscription.features.length <= 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  size="sm"
                  type="button"
                  onClick={addFeature}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar Benefício
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddingNew(false)}>Cancelar</Button>
              <Button 
                onClick={handleAddSubscription}
                disabled={!newSubscription.name || newSubscription.price <= 0}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Criar Plano
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionSettings;
