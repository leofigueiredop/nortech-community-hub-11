
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Trash2, 
  Plus,
  Check,
  Edit,
  CreditCard, 
  Calendar,
  DollarSign,
  Info,
  Eye,
  EyeOff,
  Users,
  Clock,
  Lock,
  CheckCircle2, 
  XCircle
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number | string;
  interval: 'month' | 'quarter' | 'year' | 'one-time';
  description: string;
  features: string[];
  active: boolean;
  trialDays?: number;
  maxMembers?: number;
  retentionDays?: number;
  visibility: 'public' | 'private' | 'invite';
  progressiveContent?: boolean;
}

interface PaymentGateway {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  active: boolean;
}

const SubscriptionSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedGateway, setSelectedGateway] = useState<string | null>(null);

  const [subscriptions, setSubscriptions] = useState<SubscriptionPlan[]>([
    { 
      id: '1', 
      name: 'Basic Plan', 
      price: 29.99, 
      interval: 'month',
      description: 'Access to community features and basic content',
      features: ['Community Access', 'Basic Content', 'Email Support'],
      active: true,
      visibility: 'public'
    },
    { 
      id: '2', 
      name: 'Premium Plan', 
      price: 89.99, 
      interval: 'month',
      description: 'Full access to premium content and features',
      features: ['Everything in Basic', 'Premium Courses', 'Advanced Support', 'Private Groups'],
      active: true,
      trialDays: 7,
      visibility: 'public'
    },
    { 
      id: '3', 
      name: 'Annual Plan', 
      price: 799.99, 
      interval: 'year',
      description: 'Save 25% with our annual subscription',
      features: ['Everything in Premium', '1-on-1 Sessions', 'Priority Support', 'Early Access'],
      active: true,
      trialDays: 14,
      visibility: 'public'
    },
    { 
      id: '4', 
      name: 'VIP Plan', 
      price: 299.99, 
      interval: 'month',
      description: 'Exclusive access to VIP content and mentoring',
      features: ['Everything in Annual', 'Weekly Mentoring', 'Custom Resources', 'Direct Line Support'],
      active: false,
      visibility: 'invite',
      maxMembers: 50
    }
  ]);

  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>([
    {
      id: 'stripe',
      name: 'Stripe',
      icon: <CreditCard className="h-5 w-5 text-blue-500" />,
      connected: true,
      active: true
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: <DollarSign className="h-5 w-5 text-blue-700" />,
      connected: false,
      active: false
    },
    {
      id: 'hotmart',
      name: 'Hotmart',
      icon: <CreditCard className="h-5 w-5 text-red-500" />,
      connected: false,
      active: false
    },
    {
      id: 'asaas',
      name: 'Asaas',
      icon: <CreditCard className="h-5 w-5 text-purple-500" />,
      connected: false,
      active: false
    },
    {
      id: 'lastlink',
      name: 'Lastlink',
      icon: <CreditCard className="h-5 w-5 text-green-500" />,
      connected: false,
      active: false
    },
    {
      id: 'kiwify',
      name: 'Kiwify',
      icon: <CreditCard className="h-5 w-5 text-yellow-500" />,
      connected: false,
      active: false
    }
  ]);

  const [newPlan, setNewPlan] = useState<SubscriptionPlan>({
    id: '',
    name: '',
    price: '',
    interval: 'month',
    description: '',
    features: [''],
    active: true,
    visibility: 'public',
  });

  // Payment gateway functions
  const toggleGatewayActive = (id: string) => {
    setPaymentGateways(prevState => 
      prevState.map(gateway => 
        gateway.id === id 
          ? { ...gateway, active: !gateway.active } 
          : gateway
      )
    );
  };

  // Plan management functions
  const handleAddPlan = () => {
    const newId = Date.now().toString();
    setSubscriptions([...subscriptions, { ...newPlan, id: newId }]);
    resetNewPlan();
    setIsAddingNew(false);
  };

  const handleEditPlan = (id: string) => {
    const planToEdit = subscriptions.find(plan => plan.id === id);
    if (planToEdit) {
      setNewPlan({ ...planToEdit });
      setSelectedPlanId(id);
      setIsEditingPlan(true);
      setIsAddingNew(true);
    }
  };

  const handleUpdatePlan = () => {
    if (!selectedPlanId) return;
    
    setSubscriptions(prevState => 
      prevState.map(plan => 
        plan.id === selectedPlanId 
          ? { ...newPlan, id: selectedPlanId } 
          : plan
      )
    );
    
    resetNewPlan();
    setIsEditingPlan(false);
    setIsAddingNew(false);
    setSelectedPlanId(null);
  };

  const handleDeletePlan = (id: string) => {
    setSelectedPlanId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedPlanId) {
      setSubscriptions(prevState => 
        prevState.filter(plan => plan.id !== selectedPlanId)
      );
    }
    setShowDeleteDialog(false);
    setSelectedPlanId(null);
  };

  const handleTogglePlanActive = (id: string) => {
    setSubscriptions(prevState => 
      prevState.map(plan => 
        plan.id === id 
          ? { ...plan, active: !plan.active } 
          : plan
      )
    );
  };

  const resetNewPlan = () => {
    setNewPlan({
      id: '',
      name: '',
      price: '',
      interval: 'month',
      description: '',
      features: [''],
      active: true,
      visibility: 'public',
    });
  };

  // Feature management
  const addFeature = () => {
    setNewPlan(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    const updatedFeatures = [...newPlan.features];
    updatedFeatures[index] = value;
    
    setNewPlan(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = [...newPlan.features];
    updatedFeatures.splice(index, 1);
    
    setNewPlan(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  const openPaymentDialog = (gatewayId: string) => {
    setSelectedGateway(gatewayId);
    setShowPaymentDialog(true);
  };

  const formatInterval = (interval: string) => {
    switch (interval) {
      case 'month': return '/mês';
      case 'quarter': return '/trimestre';
      case 'year': return '/ano';
      default: return '';
    }
  };

  const getVisibilityIcon = (visibility: 'public' | 'private' | 'invite') => {
    switch (visibility) {
      case 'public': return <Eye className="h-4 w-4 text-green-500" />;
      case 'private': return <Lock className="h-4 w-4 text-orange-500" />;
      case 'invite': return <Users className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Planos de Assinatura</h1>
        <Button 
          onClick={() => {
            setIsAddingNew(!isAddingNew);
            if (!isAddingNew) {
              resetNewPlan();
              setIsEditingPlan(false);
              setSelectedPlanId(null);
            }
          }}
          variant={isAddingNew ? "secondary" : "default"}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isAddingNew ? "Cancelar" : "Adicionar Novo Plano"}
        </Button>
      </div>

      <p className="text-gray-500 dark:text-gray-400">
        Crie e gerencie planos de assinatura para sua comunidade. Estes planos estarão disponíveis para compra pelos seus membros.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Planos Ativos</TabsTrigger>
          <TabsTrigger value="all">Todos os Planos</TabsTrigger>
          <TabsTrigger value="settings">Configurações de Assinatura</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.filter(plan => plan.active).map((plan) => (
              <Card key={plan.id} className="border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      {getVisibilityIcon(plan.visibility)}
                      <span className="text-xs text-gray-500">{plan.visibility === 'public' ? 'Público' : plan.visibility === 'private' ? 'Privado' : 'Convidados'}</span>
                    </div>
                    {plan.trialDays && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        {plan.trialDays} dias de teste
                      </span>
                    )}
                  </div>
                  <CardTitle className="flex justify-between">
                    <span>{plan.name}</span>
                    <span className="text-purple-600">
                      {typeof plan.price === 'number' ? 
                        `R$${plan.price.toFixed(2)}` : 
                        plan.price
                      }
                      <span className="text-sm text-gray-400">{plan.interval !== 'one-time' ? formatInterval(plan.interval) : ''}</span>
                    </span>
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.maxMembers && (
                    <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Users className="h-4 w-4 mr-1" />
                      <span>Limite de {plan.maxMembers} membros</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditPlan(plan.id)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleTogglePlanActive(plan.id)}>
                      <EyeOff className="h-4 w-4 mr-1" />
                      Desativar
                    </Button>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDeletePlan(plan.id)}>
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
            {subscriptions.map((plan) => (
              <Card key={plan.id} className={`border ${plan.active ? 'border-gray-200 dark:border-gray-700' : 'border-gray-300 dark:border-gray-600 opacity-80'}`}>
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      {getVisibilityIcon(plan.visibility)}
                      <span className="text-xs text-gray-500">{plan.visibility === 'public' ? 'Público' : plan.visibility === 'private' ? 'Privado' : 'Convidados'}</span>
                    </div>
                    {plan.trialDays && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        {plan.trialDays} dias de teste
                      </span>
                    )}
                  </div>
                  <CardTitle className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <span>{plan.name}</span>
                      {!plan.active && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">Inativo</span>}
                    </div>
                    <span className="text-purple-600">
                      {typeof plan.price === 'number' ? 
                        `R$${plan.price.toFixed(2)}` : 
                        plan.price
                      }
                      <span className="text-sm text-gray-400">{plan.interval !== 'one-time' ? formatInterval(plan.interval) : ''}</span>
                    </span>
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditPlan(plan.id)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleTogglePlanActive(plan.id)}>
                      {plan.active ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          Ativar
                        </>
                      )}
                    </Button>
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDeletePlan(plan.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Excluir
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-lg">Gateways de Pagamento</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Configure como os membros podem pagar pelas assinaturas</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paymentGateways.map((gateway) => (
                <div 
                  key={gateway.id} 
                  className={`flex items-center justify-between p-4 rounded-lg cursor-pointer
                  ${gateway.connected ? 'bg-white dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-800 border border-dashed'}
                  hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
                  onClick={() => openPaymentDialog(gateway.id)}
                >
                  <div className="flex items-center space-x-3">
                    {gateway.icon}
                    <div>
                      <h4 className="font-medium">{gateway.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {gateway.connected ? 'Conectado' : 'Não conectado'}
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={gateway.active}
                    onCheckedChange={() => toggleGatewayActive(gateway.id)}
                    disabled={!gateway.connected}
                    onClick={e => e.stopPropagation()}
                  />
                </div>
              ))}
              
              <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 border border-dashed rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 h-full min-h-[80px]">
                <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                  <Plus className="h-5 w-5 mb-1" />
                  <span className="text-sm">Adicionar Gateway</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-lg">Período de Teste</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Configure o período de teste gratuito para novos assinantes</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white dark:bg-gray-700 p-4 rounded-lg">
                <div>
                  <h4 className="font-medium">Duração padrão do período de teste</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Definir dias de teste gratuito para todos os planos</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Input 
                    type="number" 
                    className="w-20 h-8" 
                    defaultValue="7"
                    min={0}
                    max={90}
                  />
                  <span className="text-sm">dias</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-white dark:bg-gray-700 p-4 rounded-lg">
                <div>
                  <h4 className="font-medium">Solicitar meio de pagamento</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Requer cartão de crédito ou outra forma de pagamento mesmo durante o teste gratuito</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-lg">Controle de Acesso</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Configure como assinaturas controlam acesso ao conteúdo</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white dark:bg-gray-700 p-4 rounded-lg">
                <div>
                  <h4 className="font-medium">Acesso Padrão ao Conteúdo</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Define como novos conteúdos serão configurados por padrão</p>
                </div>
                <Select defaultValue="mixed">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Livre para Todos</SelectItem>
                    <SelectItem value="paid">Somente Assinantes</SelectItem>
                    <SelectItem value="mixed">Acesso Misto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between bg-white dark:bg-gray-700 p-4 rounded-lg">
                <div>
                  <h4 className="font-medium">Permissões Personalizadas</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Permite criar conjuntos de permissões personalizados para diferentes tipos de conteúdo</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Regras de Acesso em Caso de Conflito</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Define prioridades quando há múltiplas regras de acesso aplicáveis</p>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Checkbox id="access-rule-1" defaultChecked />
                    <Label htmlFor="access-rule-1">Permissões específicas têm prioridade sobre regras globais</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox id="access-rule-2" defaultChecked />
                    <Label htmlFor="access-rule-2">Regras de pagamento têm prioridade sobre regras de função</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox id="access-rule-3" />
                    <Label htmlFor="access-rule-3">Admins sempre têm acesso completo, independentemente das regras</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {isAddingNew && (
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mt-6">
          <h2 className="text-xl font-bold mb-4">
            {isEditingPlan ? "Editar Plano de Assinatura" : "Criar Novo Plano de Assinatura"}
          </h2>
          
          <div className="space-y-6">
            {/* Seção A - Informações do Plano */}
            <div>
              <h3 className="text-md font-medium mb-4 pb-2 border-b">Informações do Plano</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plan-name">Nome do Plano</Label>
                  <Input 
                    id="plan-name" 
                    value={newPlan.name}
                    onChange={e => setNewPlan({...newPlan, name: e.target.value})}
                    placeholder="ex: Plano Básico, Plano Premium"
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="plan-price">Preço</Label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-2 text-gray-500">R$</span>
                      <Input 
                        id="plan-price"
                        type="number"
                        className="pl-8"
                        value={newPlan.price || ''}
                        onChange={e => setNewPlan({...newPlan, price: parseFloat(e.target.value) || ''})}
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="plan-interval">Intervalo de Cobrança</Label>
                    <Select 
                      value={newPlan.interval}
                      onValueChange={(value: 'month' | 'quarter' | 'year' | 'one-time') => setNewPlan({...newPlan, interval: value})}
                      defaultValue="month"
                    >
                      <SelectTrigger className="mt-1">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium">Período de Teste Gratuito</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ofereça dias de teste gratuito</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="number" 
                      className="w-20 h-8" 
                      value={newPlan.trialDays || ''}
                      onChange={e => setNewPlan({...newPlan, trialDays: parseInt(e.target.value) || undefined})}
                      placeholder="0"
                      min="0"
                      max="90"
                    />
                    <span className="text-sm">dias</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium">Status do Plano</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ativar ou desativar este plano</p>
                  </div>
                  <Switch 
                    checked={newPlan.active} 
                    onCheckedChange={(checked) => setNewPlan({...newPlan, active: checked})}
                  />
                </div>
              </div>
            </div>
            
            {/* Seção B - Descrição e Benefícios */}
            <div>
              <h3 className="text-md font-medium mb-4 pb-2 border-b">Descrição e Benefícios</h3>
              <div>
                <Label htmlFor="plan-description">Descrição Curta</Label>
                <Input 
                  id="plan-description"
                  value={newPlan.description}
                  onChange={e => setNewPlan({...newPlan, description: e.target.value})}
                  placeholder="Breve descrição deste plano"
                  className="mt-1"
                />
              </div>
              
              <div className="mt-4">
                <Label className="mb-2 block">Benefícios</Label>
                <div className="space-y-2">
                  {newPlan.features.map((feature, index) => (
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
                        disabled={newPlan.features.length <= 1}
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
            </div>
            
            {/* Seção C - Permissões e Acessos */}
            <div>
              <h3 className="text-md font-medium mb-4 pb-2 border-b">Permissões e Acessos</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="courses-access">Cursos</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      <SelectItem value="basic">Cursos Básicos</SelectItem>
                      <SelectItem value="premium">Cursos Premium</SelectItem>
                      <SelectItem value="all">Todos os Cursos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="events-access">Eventos e Lives</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      <SelectItem value="public">Eventos Públicos</SelectItem>
                      <SelectItem value="premium">Eventos Premium</SelectItem>
                      <SelectItem value="all">Todos os Eventos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="groups-access">Grupos e Chats</Label>
                  <Select defaultValue="public">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      <SelectItem value="public">Grupos Públicos</SelectItem>
                      <SelectItem value="premium">Grupos Premium</SelectItem>
                      <SelectItem value="all">Todos os Grupos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="vip-access">Salas VIP / Mentorias</Label>
                  <Select defaultValue="none">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhum</SelectItem>
                      <SelectItem value="basic">Mentorias Básicas</SelectItem>
                      <SelectItem value="premium">Mentorias Premium</SelectItem>
                      <SelectItem value="all">Todas as Mentorias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-4">
                <Label className="mb-2 block">Biblioteca de Conteúdo</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 p-3 rounded-lg">
                    <Checkbox id="content-pdf" defaultChecked />
                    <Label htmlFor="content-pdf">PDFs</Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 p-3 rounded-lg">
                    <Checkbox id="content-video" defaultChecked />
                    <Label htmlFor="content-video">Vídeos</Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 p-3 rounded-lg">
                    <Checkbox id="content-article" />
                    <Label htmlFor="content-article">Artigos</Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 p-3 rounded-lg">
                    <Checkbox id="content-audio" />
                    <Label htmlFor="content-audio">Áudios</Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 p-3 rounded-lg">
                    <Checkbox id="content-download" />
                    <Label htmlFor="content-download">Downloads</Label>
                  </div>
                  <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 p-3 rounded-lg">
                    <Checkbox id="content-exclusive" />
                    <Label htmlFor="content-exclusive">Exclusivos</Label>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-white dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Resumo de Acessos</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">O que o assinante terá acesso com este plano</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Info className="h-4 w-4 mr-1" />
                    Prévia detalhada
                  </Button>
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Todos os cursos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Eventos premium</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>PDFs e vídeos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <XCircle className="h-4 w-4 text-gray-400" />
                    <span>Salas VIP</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Seção D - Integração de Pagamento */}
            <div>
              <h3 className="text-md font-medium mb-4 pb-2 border-b">Integração de Pagamento</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Selecione as formas de pagamento disponíveis para este plano
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg flex items-center space-x-3 cursor-pointer">
                  <Checkbox id="payment-stripe" defaultChecked />
                  <Label htmlFor="payment-stripe" className="flex items-center cursor-pointer">
                    <CreditCard className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Stripe</span>
                  </Label>
                </div>
                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg flex items-center space-x-3 cursor-pointer">
                  <Checkbox id="payment-paypal" />
                  <Label htmlFor="payment-paypal" className="flex items-center cursor-pointer">
                    <DollarSign className="h-4 w-4 mr-2 text-blue-700" />
                    <span>PayPal</span>
                  </Label>
                </div>
                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg flex items-center space-x-3 cursor-pointer">
                  <Checkbox id="payment-hotmart" />
                  <Label htmlFor="payment-hotmart" className="flex items-center cursor-pointer">
                    <CreditCard className="h-4 w-4 mr-2 text-red-500" />
                    <span>Hotmart</span>
                  </Label>
                </div>
                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg flex items-center space-x-3 cursor-pointer">
                  <Checkbox id="payment-asaas" />
                  <Label htmlFor="payment-asaas" className="flex items-center cursor-pointer">
                    <CreditCard className="h-4 w-4 mr-2 text-purple-500" />
                    <span>Asaas</span>
                  </Label>
                </div>
                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg flex items-center space-x-3 cursor-pointer">
                  <Checkbox id="payment-lastlink" />
                  <Label htmlFor="payment-lastlink" className="flex items-center cursor-pointer">
                    <CreditCard className="h-4 w-4 mr-2 text-green-500" />
                    <span>Lastlink</span>
                  </Label>
                </div>
                <div className="bg-white dark:bg-gray-700 p-3 rounded-lg flex items-center space-x-3 cursor-pointer">
                  <Checkbox id="payment-kiwify" />
                  <Label htmlFor="payment-kiwify" className="flex items-center cursor-pointer">
                    <CreditCard className="h-4 w-4 mr-2 text-yellow-500" />
                    <span>Kiwify</span>
                  </Label>
                </div>
              </div>
            </div>
            
            {/* Seção E - Visibilidade do Plano */}
            <div>
              <h3 className="text-md font-medium mb-4 pb-2 border-b">Visibilidade do Plano</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors
                  ${newPlan.visibility === 'public' 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}
                  `}
                  onClick={() => setNewPlan({...newPlan, visibility: 'public'})}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Público</h4>
                    <Eye className={`h-5 w-5 ${newPlan.visibility === 'public' ? 'text-purple-500' : 'text-gray-400'}`} />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Exibido no site e disponível para qualquer pessoa se inscrever
                  </p>
                </div>
                
                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors
                  ${newPlan.visibility === 'private' 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}
                  `}
                  onClick={() => setNewPlan({...newPlan, visibility: 'private'})}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Privado</h4>
                    <Lock className={`h-5 w-5 ${newPlan.visibility === 'private' ? 'text-purple-500' : 'text-gray-400'}`} />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Disponível apenas via link direto ou token de acesso
                  </p>
                </div>
                
                <div 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors
                  ${newPlan.visibility === 'invite' 
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}
                  `}
                  onClick={() => setNewPlan({...newPlan, visibility: 'invite'})}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Somente Convidados</h4>
                    <Users className={`h-5 w-5 ${newPlan.visibility === 'invite' ? 'text-purple-500' : 'text-gray-400'}`} />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Exclusivo para membros convidados pelo administrador
                  </p>
                </div>
              </div>
            </div>
            
            {/* Seção F - Controle de Acesso */}
            <div>
              <h3 className="text-md font-medium mb-4 pb-2 border-b">Controle de Acesso</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium">Quantidade Máxima de Assinantes</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Limite máximo de membros que podem assinar este plano</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="number" 
                      className="w-24 h-8" 
                      value={newPlan.maxMembers || ''}
                      onChange={e => setNewPlan({...newPlan, maxMembers: parseInt(e.target.value) || undefined})}
                      placeholder="Ilimitado"
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium">Tempo de Acesso Após Cancelamento</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Por quantos dias o membro mantém acesso após cancelar</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input 
                      type="number" 
                      className="w-20 h-8" 
                      value={newPlan.retentionDays || ''}
                      onChange={e => setNewPlan({...newPlan, retentionDays: parseInt(e.target.value) || undefined})}
                      placeholder="0"
                      min="0"
                    />
                    <span className="text-sm">dias</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium">Liberar Conteúdo de Forma Escalonada</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Desbloquear conteúdo gradualmente ao longo do tempo</p>
                </div>
                <Switch 
                  checked={!!newPlan.progressiveContent}
                  onCheckedChange={(checked) => setNewPlan({...newPlan, progressiveContent: checked || undefined})}
                />
              </div>
            </div>
            
            {/* Ações Finais */}
            <div className="flex justify-between space-x-2 mt-6">
              <div className="flex gap-2">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  Prévia do Plano
                </Button>
                <Button variant="outline">
                  Salvar como Rascunho
                </Button>
              </div>
              
              <Button 
                onClick={isEditingPlan ? handleUpdatePlan : handleAddPlan}
                disabled={!newPlan.name || (!newPlan.price && newPlan.price !== 0)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isEditingPlan ? "Atualizar Plano" : "Publicar Plano"}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Plano de Assinatura</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Tem certeza que deseja excluir este plano de assinatura?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600">
              <Trash2 className="h-4 w-4 mr-1" />
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedGateway && `Configurar ${paymentGateways.find(g => g.id === selectedGateway)?.name}`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Conecte sua conta para permitir pagamentos com este provedor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <Label htmlFor="api-key" className="mb-2 block">Chave de API</Label>
            <Input id="api-key" placeholder="Insira sua chave de API aqui" />
            
            <Label htmlFor="webhook-url" className="mt-4 mb-2 block">Webhook URL (opcional)</Label>
            <Input id="webhook-url" placeholder="https://sua-url-de-webhook.com" />
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-700 dark:text-blue-300">
              <p>
                <Info className="h-4 w-4 inline mr-1" />
                Você pode encontrar suas chaves de API no painel do provedor de pagamento.
              </p>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-purple-600">
              Conectar Conta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubscriptionSettings;
