
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

interface FormData {
  revenue: string;
  goal: string;
  referral: string;
}

const ProfileForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    revenue: '',
    goal: '',
    referral: '',
  });
  const navigate = useNavigate();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/onboarding/features');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-nortech-purple rounded-lg flex items-center justify-center">
            <span className="text-white text-4xl font-bold">C</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Tell us a bit about yourself</h2>
        <p className="text-center text-muted-foreground mb-8">
          We'd love to give you the best onboarding experience!
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="revenue">What is your annual revenue?</Label>
            <Select 
              value={formData.revenue} 
              onValueChange={(value) => handleSelectChange('revenue', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select one (amounts in USD)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-50k">Under $50,000</SelectItem>
                <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
                <SelectItem value="500k-1m">$500,000 - $1 million</SelectItem>
                <SelectItem value="over-1m">Over $1 million</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goal">What are you hoping to achieve with Nortech?</Label>
            <Select 
              value={formData.goal} 
              onValueChange={(value) => handleSelectChange('goal', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select one" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="build-community">Build a community</SelectItem>
                <SelectItem value="sell-courses">Sell courses or memberships</SelectItem>
                <SelectItem value="customer-engagement">Improve customer engagement</SelectItem>
                <SelectItem value="content-creation">Create and share content</SelectItem>
                <SelectItem value="events">Host virtual events</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="referral">How did you hear about Nortech?</Label>
            <Textarea
              id="referral"
              name="referral"
              value={formData.referral}
              onChange={handleTextChange}
              placeholder="Tell us how you found us"
              rows={3}
            />
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button type="submit" className="bg-nortech-purple hover:bg-nortech-purple/90">
              Next
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
