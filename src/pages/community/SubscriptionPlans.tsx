import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MemberSubscriptionPlans from '@/components/stripe/MemberSubscriptionPlans';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubscriptionPlans: React.FC = () => {
  const { communityId } = useParams<{ communityId: string }>();
  const { community, user } = useAuth();

  if (!communityId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <h1 className="text-xl font-semibold mb-2">Comunidade não encontrada</h1>
            <p className="text-muted-foreground mb-4">
              O ID da comunidade não foi fornecido.
            </p>
            <Button asChild>
              <Link to="/communities">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar às Comunidades
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-xl font-semibold mb-2">Login Necessário</h1>
            <p className="text-muted-foreground mb-4">
              Você precisa estar logado para visualizar os planos de assinatura.
            </p>
            <Button asChild>
              <Link to="/login">
                Fazer Login
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to={`/community/${communityId}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar à Comunidade
          </Link>
        </Button>
      </div>

      {/* Subscription Plans Component */}
      <MemberSubscriptionPlans 
        communityId={communityId} 
        communityName={community?.name}
      />
    </div>
  );
};

export default SubscriptionPlans; 