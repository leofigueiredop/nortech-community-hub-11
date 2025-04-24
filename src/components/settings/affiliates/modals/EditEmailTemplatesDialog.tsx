
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Mail, Plus, Copy, Save } from 'lucide-react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface EditEmailTemplatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
}

const sampleTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Welcome Email',
    subject: 'Welcome to our affiliate program!',
    body: `Hi [AFFILIATE_NAME],

Thanks for joining our affiliate program! We're excited to partner with you.

Your unique referral link is: [AFFILIATE_LINK]

You'll earn [COMMISSION_RATE]% on every referral. If you have any questions, please reply to this email.

Best regards,
[YOUR_NAME]
[YOUR_COMPANY]`
  },
  {
    id: '2',
    name: 'Promotion Announcement',
    subject: 'New promotion - earn extra commissions!',
    body: `Hello [AFFILIATE_NAME],

We're excited to announce our latest promotion that can help you earn more!

From [START_DATE] to [END_DATE], we're increasing commissions to [PROMOTION_RATE]% for all new referrals.

Use your referral link: [AFFILIATE_LINK]

Best regards,
[YOUR_NAME]
[YOUR_COMPANY]`
  }
];

const EditEmailTemplatesDialog: React.FC<EditEmailTemplatesDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [templates, setTemplates] = useState(sampleTemplates);
  const [activeTemplate, setActiveTemplate] = useState(templates[0]?.id || '');
  const [isCreating, setIsCreating] = useState(false);
  
  const form = useForm<EmailTemplate>({
    defaultValues: templates.find(t => t.id === activeTemplate) || {
      id: '',
      name: '',
      subject: '',
      body: '',
    }
  });
  
  // When template changes, update form values
  React.useEffect(() => {
    const template = templates.find(t => t.id === activeTemplate);
    if (template) {
      form.reset(template);
    }
  }, [activeTemplate, templates, form]);

  const copyTemplate = (template: EmailTemplate) => {
    navigator.clipboard.writeText(template.body);
    // Could add toast notification here
  };

  const saveTemplate = (data: EmailTemplate) => {
    if (isCreating) {
      // Add new template
      const newTemplate = {
        ...data,
        id: Date.now().toString(),
      };
      setTemplates([...templates, newTemplate]);
      setActiveTemplate(newTemplate.id);
      setIsCreating(false);
    } else {
      // Update existing template
      setTemplates(templates.map(t => 
        t.id === activeTemplate ? { ...t, ...data } : t
      ));
    }
  };

  const createNewTemplate = () => {
    setIsCreating(true);
    form.reset({
      id: '',
      name: '',
      subject: '',
      body: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Email Templates</DialogTitle>
          <DialogDescription>
            Create and manage email templates for your affiliates
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            <Mail className="inline-block mr-1 h-4 w-4" />
            <span>{templates.length} templates available</span>
          </div>
          <Button 
            className="flex items-center gap-2"
            variant="outline"
            onClick={createNewTemplate}
          >
            <Plus size={16} /> Create Template
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 border rounded-md overflow-hidden">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 border-b">
              <h3 className="font-medium">Templates</h3>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${
                    activeTemplate === template.id ? 'bg-purple-50 dark:bg-purple-900/20 border-l-4 border-l-purple-500' : ''
                  }`}
                  onClick={() => {
                    setActiveTemplate(template.id);
                    setIsCreating(false);
                  }}
                >
                  <div className="font-medium">{template.name}</div>
                  <div className="text-xs text-gray-500 truncate">{template.subject}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {isCreating ? 'Create New Template' : 'Edit Template'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(saveTemplate)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Template Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Welcome Email" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Welcome to our affiliate program!" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="body"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Body</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Write your email content here..." 
                              className="min-h-[200px] font-mono text-sm"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Use placeholders like [AFFILIATE_NAME], [AFFILIATE_LINK], [COMMISSION_RATE], etc.
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between pt-2">
                      <Button 
                        type="button" 
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={() => copyTemplate(form.getValues())}
                      >
                        <Copy size={16} /> Copy Template
                      </Button>
                      <Button 
                        type="submit"
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <Save size={16} /> Save Template
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmailTemplatesDialog;
