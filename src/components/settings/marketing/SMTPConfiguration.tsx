
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SMTPConfiguration: React.FC = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    host: '',
    port: '587',
    senderEmail: '',
    username: '',
    password: '',
    useTLS: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleTestConnection = () => {
    // Validate form
    if (!formData.host || !formData.port || !formData.senderEmail || !formData.username || !formData.password) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // For demo, we'll just toggle the connection state
      const success = Math.random() > 0.3; // 70% success rate
      
      if (success) {
        setIsConnected(true);
        toast({
          title: "Connection Successful",
          description: "Your SMTP server was connected successfully",
        });
      } else {
        setIsConnected(false);
        toast({
          title: "Connection Failed",
          description: "Could not connect to the SMTP server. Please check your credentials.",
          variant: "destructive"
        });
      }
    }, 1500);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-medium">SMTP Configuration</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Configure your own SMTP server to send emails with your domain.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Email Delivery Settings</CardTitle>
          <CardDescription>
            Configure your SMTP settings to send emails from your own domain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="host">SMTP Host</Label>
              <Input 
                id="host" 
                name="host"
                placeholder="e.g., smtp.mailgun.org" 
                value={formData.host}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input 
                id="port" 
                name="port"
                placeholder="587" 
                value={formData.port}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500">Common ports: 25, 587, or 465</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderEmail">Sender Email</Label>
              <Input 
                id="senderEmail" 
                name="senderEmail"
                placeholder="noreply@yourdomain.com" 
                value={formData.senderEmail}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">SMTP Username</Label>
              <Input 
                id="username" 
                name="username"
                placeholder="Your SMTP username" 
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">SMTP Password</Label>
              <Input 
                id="password" 
                name="password"
                type="password" 
                placeholder="Your SMTP password" 
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Switch 
                id="useTLS" 
                name="useTLS"
                checked={formData.useTLS} 
                onCheckedChange={(checked) => setFormData({...formData, useTLS: checked})}
              />
              <Label htmlFor="useTLS">Use SSL/TLS</Label>
            </div>
          </div>
          
          <div className="pt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <>
                  <CheckCircle className="text-green-500 h-5 w-5" />
                  <span className="text-green-600 dark:text-green-400 text-sm font-medium">Connected</span>
                </>
              ) : (
                <>
                  <AlertCircle className="text-gray-400 h-5 w-5" />
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Not connected</span>
                </>
              )}
            </div>
            <Button onClick={handleTestConnection} disabled={isLoading}>
              {isLoading ? "Testing..." : "Test Connection"}
            </Button>
          </div>
          
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
            <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-md">
              <h3 className="text-amber-800 dark:text-amber-300 font-medium">Fallback Information</h3>
              <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
                If left unconfigured, default Nortech infrastructure will be used with sending limits and Nortech branding.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SMTPConfiguration;
