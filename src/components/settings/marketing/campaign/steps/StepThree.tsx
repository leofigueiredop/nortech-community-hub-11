
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Send, AlertTriangle, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface StepThreeProps {
  data: {
    subject: string;
    previewText: string;
    content: string;
  };
  updateData: (data: Partial<typeof data>) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepThree: React.FC<StepThreeProps> = ({ data, updateData, onNext, onBack }) => {
  const { toast } = useToast();
  const [testEmail, setTestEmail] = useState('');
  const [spamCheckResult, setSpamCheckResult] = useState<null | {
    score: number;
    issues: string[];
  }>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSendTest = () => {
    if (!testEmail || !testEmail.includes('@')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Test Email Sent",
        description: `A test email has been sent to ${testEmail}`,
      });
      setIsLoading(false);
    }, 1500);
  };
  
  const handleSpamCheck = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // This is mock data - in a real app this would be from an actual spam check service
      setSpamCheckResult({
        score: 2.1,
        issues: [
          "Subject line contains possible trigger word ('FREE')",
          "Consider reducing the number of exclamation marks"
        ]
      });
      setIsLoading(false);
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="desktop" className="w-full">
        <TabsList className="grid grid-cols-2 w-48 mb-4">
          <TabsTrigger value="desktop">Desktop</TabsTrigger>
          <TabsTrigger value="mobile">Mobile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="desktop" className="border rounded-md p-4">
          <div className="max-w-2xl mx-auto bg-white shadow-md">
            <div className="border-b p-3">
              <p className="font-medium">Subject: {data.subject || "[No subject]"}</p>
              <p className="text-gray-500 text-sm">{data.previewText || "[No preview text]"}</p>
            </div>
            <div className="p-4 min-h-[300px]">
              {data.content ? (
                <div dangerouslySetInnerHTML={{ __html: data.content }} />
              ) : (
                <p className="text-gray-500 italic">No content added yet.</p>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="mobile" className="border rounded-md p-4">
          <div className="max-w-[375px] mx-auto bg-white shadow-md border rounded-lg overflow-hidden">
            <div className="border-b p-3">
              <p className="font-medium">Subject: {data.subject || "[No subject]"}</p>
              <p className="text-gray-500 text-sm">{data.previewText || "[No preview text]"}</p>
            </div>
            <div className="p-3 min-h-[400px]">
              {data.content ? (
                <div dangerouslySetInnerHTML={{ __html: data.content }} />
              ) : (
                <p className="text-gray-500 italic">No content added yet.</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="space-y-4 pt-4">
        <Label>Test Your Email</Label>
        <div className="flex gap-3">
          <Input
            placeholder="Enter your email address"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
          <Button 
            onClick={handleSendTest} 
            disabled={isLoading}
          >
            <Send className="h-4 w-4 mr-2" />
            Send Test
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Label>Spam Check</Label>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSpamCheck}
              disabled={isLoading}
            >
              Run Check
            </Button>
          </div>
          
          {spamCheckResult && (
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-medium mr-2">Score:</span>
                <span className={
                  spamCheckResult.score < 2 ? "text-green-600" : 
                  spamCheckResult.score < 4 ? "text-amber-600" : 
                  "text-red-600"
                }>{spamCheckResult.score}/10</span>
                
                {spamCheckResult.score < 2 ? (
                  <span className="ml-2 flex items-center text-green-600 text-sm">
                    <Check className="h-4 w-4 mr-1" /> Low spam risk
                  </span>
                ) : (
                  <span className="ml-2 flex items-center text-amber-600 text-sm">
                    <AlertTriangle className="h-4 w-4 mr-1" /> Moderate spam risk
                  </span>
                )}
              </div>
              
              {spamCheckResult.issues.length > 0 && (
                <div className="text-sm space-y-1">
                  <p className="font-medium">Suggested improvements:</p>
                  <ul className="list-disc pl-5">
                    {spamCheckResult.issues.map((issue, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300">{issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back to Editor
        </Button>
        <Button onClick={onNext}>Continue to Schedule</Button>
      </div>
    </div>
  );
};

export default StepThree;
