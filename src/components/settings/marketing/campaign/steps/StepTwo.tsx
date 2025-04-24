
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb, Wand2 } from 'lucide-react';

interface StepTwoProps {
  data: {
    subject: string;
    previewText: string;
    content: string;
  };
  updateData: (data: Partial<typeof data>) => void;
  onNext: () => void;
  onBack: () => void;
}

const StepTwo: React.FC<StepTwoProps> = ({ data, updateData, onNext, onBack }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const handleAISuggestion = () => {
    // In a real application, this would call an AI service
    // For demo purposes, we'll just simulate it
    updateData({
      subject: "🎉 New Content Available in Your Community!",
      previewText: "Explore this month's exclusive resources and upcoming events"
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="subject-line">Subject Line</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
            onClick={handleAISuggestion}
          >
            <Wand2 className="h-3 w-3 mr-1" />
            AI Suggestion
          </Button>
        </div>
        <Input 
          id="subject-line"
          value={data.subject}
          onChange={(e) => updateData({ subject: e.target.value })}
          placeholder="Enter an attention-grabbing subject line"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="preview-text">Preview Text</Label>
        <Input 
          id="preview-text"
          value={data.previewText}
          onChange={(e) => updateData({ previewText: e.target.value })}
          placeholder="Brief text that appears after the subject line in most email clients"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This text appears in the inbox after the subject line. Keep it under 90 characters.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email-content">Email Content</Label>
        <Textarea 
          id="email-content"
          value={data.content}
          onChange={(e) => updateData({ content: e.target.value })}
          placeholder="Write your email content here..."
          className="min-h-[200px]"
          required
        />
      </div>
      
      <Card className="border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-900/20">
        <CardContent className="p-4 flex items-start space-x-3">
          <Lightbulb className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-indigo-700 dark:text-indigo-300">Pro Tip</h4>
            <p className="text-sm text-indigo-600 dark:text-indigo-400">
              Keep your emails concise and include a clear call-to-action. Use images sparingly and ensure your most important content is visible without scrolling.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Preview Email</Button>
      </div>
    </form>
  );
};

export default StepTwo;
