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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLocation } from 'react-router-dom';

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
        <h1 className="text-2xl font-bold">Subscription Plans</h1>
        <Button 
          onClick={() => setIsAddingNew(!isAddingNew)}
          variant={isAddingNew ? "secondary" : "default"}
          className="bg-nortech-purple hover:bg-nortech-purple/90"
        >
          {isAddingNew ? "Cancel" : "Add New Plan"}
        </Button>
      </div>

      <p className="text-gray-500 dark:text-gray-400">
        Create and manage subscription plans for your community. These plans will be available for purchase by your members.
      </p>

      {fromLibrary && (
        <Card className="border-2 border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-purple-500" />
              Premium Content Access
            </CardTitle>
            <CardDescription>
              Unlock all premium content in the library including PDFs, videos, and downloadable resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg flex items-center gap-3">
                <FileText className="h-6 w-6 text-purple-500" />
                <div>
                  <div className="font-medium">Premium PDFs</div>
                  <div className="text-xs text-muted-foreground">Downloadable guides</div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg flex items-center gap-3">
                <FileVideo className="h-6 w-6 text-purple-500" />
                <div>
                  <div className="font-medium">Exclusive Videos</div>
                  <div className="text-xs text-muted-foreground">In-depth tutorials</div>
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 p-3 rounded-lg flex items-center gap-3">
                <Download className="h-6 w-6 text-purple-500" />
                <div>
                  <div className="font-medium">All Downloads</div>
                  <div className="text-xs text-muted-foreground">Save for offline use</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
              Subscribe Monthly - $9.99
            </Button>
            <Button variant="outline" className="w-full sm:w-auto border-purple-300 text-purple-700 hover:bg-purple-100">
              One-Time Access - $49.99
            </Button>
          </CardFooter>
        </Card>
      )}

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Plans</TabsTrigger>
          <TabsTrigger value="all">All Plans</TabsTrigger>
          <TabsTrigger value="settings">Subscription Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.filter(sub => sub.active).map((subscription) => (
              <Card key={subscription.id} className="border border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    <span>{subscription.name}</span>
                    <span className="text-nortech-purple">
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
                    {subscription.active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteSubscription(subscription.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
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
                    <span className="text-nortech-purple">
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
                    {subscription.active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteSubscription(subscription.id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
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
                <h3 className="font-medium text-lg">Payment Gateways</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Configure how members can pay for subscriptions</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium">Credit/Debit Card (Stripe)</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Accept credit and debit card payments</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <div>
                    <h4 className="font-medium">Crypto Payments</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Accept cryptocurrency payments</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <div>
                    <h4 className="font-medium">Free Trial Period</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Offer a free trial for new subscribers</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Input 
                    type="number" 
                    className="w-20 h-8" 
                    defaultValue="7"
                  />
                  <span className="text-sm">days</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium text-lg">Access Control</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Configure how subscriptions control access to content</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="defaultAccess" className="font-medium">Default Content Access</Label>
                <Select defaultValue="free">
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free for All</SelectItem>
                    <SelectItem value="paid">Paid Members Only</SelectItem>
                    <SelectItem value="mixed">Mixed Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Allow Custom Permission Sets</Label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Create custom permission sets for different content types</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {isAddingNew && (
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg mt-6">
          <h2 className="text-xl font-bold mb-4">Create New Subscription Plan</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plan-name">Plan Name</Label>
                <Input 
                  id="plan-name" 
                  value={newSubscription.name}
                  onChange={e => setNewSubscription({...newSubscription, name: e.target.value})}
                  placeholder="e.g. Basic Plan, Premium Plan"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="plan-price">Price</Label>
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
                  <Label htmlFor="plan-interval">Billing Interval</Label>
                  <Select 
                    value={newSubscription.interval}
                    onValueChange={value => setNewSubscription({...newSubscription, interval: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="month">Monthly</SelectItem>
                      <SelectItem value="year">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="plan-description">Description</Label>
              <Input 
                id="plan-description"
                value={newSubscription.description}
                onChange={e => setNewSubscription({...newSubscription, description: e.target.value})}
                placeholder="Brief description of this plan"
              />
            </div>
            
            <div>
              <Label className="mb-2 block">Features</Label>
              <div className="space-y-2">
                {newSubscription.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input 
                      value={feature}
                      onChange={e => updateFeature(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
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
                  Add Feature
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsAddingNew(false)}>Cancel</Button>
              <Button 
                onClick={handleAddSubscription}
                disabled={!newSubscription.name || newSubscription.price <= 0}
                className="bg-nortech-purple hover:bg-nortech-purple/90"
              >
                Create Plan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionSettings;
