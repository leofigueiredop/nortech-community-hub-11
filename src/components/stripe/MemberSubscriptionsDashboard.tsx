import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  CreditCard,
  Users,
  Search,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Calendar,
  Filter
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useStripeApi } from '@/hooks/useStripeApi';
import { MemberSubscription } from '@/types/stripe.types';

const MemberSubscriptionsDashboard: React.FC = () => {
  const { community } = useAuth();
  const { toast } = useToast();
  const stripeApi = useStripeApi();
  
  const [subscriptions, setSubscriptions] = useState<MemberSubscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<MemberSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (community?.id) {
      loadSubscriptions();
    }
  }, [community?.id]);

  useEffect(() => {
    filterSubscriptions();
  }, [subscriptions, searchTerm, statusFilter]);

  const loadSubscriptions = async () => {
    if (!community?.id) return;

    try {
      const response = await stripeApi.get(`/stripe/member/subscriptions/${community.id}`);
      if (response.success) {
        setSubscriptions(response.data);
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar assinaturas dos membros',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filterSubscriptions = () => {
    let filtered = subscriptions;

    // Filter by search term (user_id for now, could be enhanced with user names)
    if (searchTerm) {
      filtered = filtered.filter(sub => 
        sub.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.stripe_customer_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(sub => sub.status === statusFilter);
    }

    setFilteredSubscriptions(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Ativo</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />Trial</Badge>;
      case 'past_due':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Vencido</Badge>;
      case 'canceled':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Cancelado</Badge>;
      case 'incomplete':
        return <Badge className="bg-orange-100 text-orange-800"><AlertCircle className="w-3 h-3 mr-1" />Incompleto</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Calculate statistics
  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'active').length,
    trialing: subscriptions.filter(s => s.status === 'trialing').length,
    revenue: subscriptions
      .filter(s => s.status === 'active' || s.status === 'trialing')
      .reduce((sum, s) => sum + s.amount, 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Carregando assinaturas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Assinaturas dos Membros</h1>
        <p className="text-muted-foreground">
          Gerencie e monitore as assinaturas dos membros da sua comunidade
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Assinaturas</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assinaturas Ativas</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Em Trial</p>
                <p className="text-2xl font-bold text-blue-600">{stats.trialing}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Receita Mensal</p>
                <p className="text-2xl font-bold text-green-600">{formatPrice(stats.revenue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por ID do usuário ou customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('active')}
                size="sm"
              >
                Ativos
              </Button>
              <Button
                variant={statusFilter === 'trialing' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('trialing')}
                size="sm"
              >
                Trial
              </Button>
              <Button
                variant={statusFilter === 'canceled' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('canceled')}
                size="sm"
              >
                Cancelados
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Assinaturas ({filteredSubscriptions.length})
          </CardTitle>
          <CardDescription>
            Lista de todas as assinaturas dos membros
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredSubscriptions.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma assinatura encontrada</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca.' 
                  : 'Ainda não há membros com assinaturas ativas.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSubscriptions.map((subscription) => (
                <div key={subscription.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">Usuário: {subscription.user_id}</p>
                        <p className="text-sm text-muted-foreground">
                          Customer: {subscription.stripe_customer_id}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(subscription.status)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Valor</p>
                      <p className="font-medium">{formatPrice(subscription.amount)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Intervalo</p>
                      <p className="font-medium">
                        {subscription.interval_type === 'month' ? 'Mensal' : 'Anual'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Início do Período</p>
                      <p className="font-medium">
                        {subscription.current_period_start 
                          ? formatDate(subscription.current_period_start)
                          : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Próxima Cobrança</p>
                      <p className="font-medium">
                        {subscription.current_period_end 
                          ? formatDate(subscription.current_period_end)
                          : '-'}
                      </p>
                    </div>
                  </div>

                  {subscription.trial_end && (
                    <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                      <p className="text-blue-800">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Trial termina em: {formatDate(subscription.trial_end)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <Button onClick={loadSubscriptions} disabled={stripeApi.loading}>
          {stripeApi.loading ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Atualizando...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar Lista
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MemberSubscriptionsDashboard; 