
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Mail, Clock, ArrowRight } from "lucide-react";

interface EmailConfig {
  subject: string;
  content: string;
  delayHours?: number;
}

interface AutomationFormData {
  emails: EmailConfig[];
}

interface AutomationConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  automation: {
    title: string;
    description: string;
    steps: number;
  };
}

const AutomationConfigDialog: React.FC<AutomationConfigDialogProps> = ({
  isOpen,
  onClose,
  automation
}) => {
  const form = useForm<AutomationFormData>({
    defaultValues: {
      emails: Array(automation.steps).fill({
        subject: "",
        content: "",
        delayHours: 24,
      }),
    },
  });

  const onSubmit = (data: AutomationFormData) => {
    console.log("Automation configuration:", data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configure {automation.title}</DialogTitle>
          <DialogDescription>
            Customize the email sequence for {automation.description.toLowerCase()}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              {Array.from({ length: automation.steps }).map((_, index) => (
                <div key={index} className="relative">
                  {/* Journey Timeline */}
                  {index > 0 && (
                    <div className="absolute -top-6 left-8 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>+{form.getValues().emails[index]?.delayHours || 24}h after Email {index}</span>
                    </div>
                  )}
                  
                  <div className="p-4 border rounded-lg space-y-4 bg-card">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">Email {index + 1}</h3>
                    </div>

                    <FormField
                      control={form.control}
                      name={`emails.${index}.subject`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter email subject" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`emails.${index}.content`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Write your email content..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {index > 0 && (
                      <FormField
                        control={form.control}
                        name={`emails.${index}.delayHours`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Delay after previous email (hours)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>

                  {/* Journey Arrow */}
                  {index < automation.steps - 1 && (
                    <div className="flex justify-center my-2">
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Configuration</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AutomationConfigDialog;
