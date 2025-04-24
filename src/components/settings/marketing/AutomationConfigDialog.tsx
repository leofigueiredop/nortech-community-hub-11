
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
import { Label } from "@/components/ui/label";
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
  const form = useForm({
    defaultValues: {
      emailSubject: "",
      emailContent: "",
      delay: "24",
    },
  });

  const onSubmit = (data: any) => {
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4">
              {Array.from({ length: automation.steps }).map((_, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-medium">Email {index + 1}</h3>
                  
                  <FormField
                    control={form.control}
                    name={`emailSubject_${index}`}
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
                    name={`emailContent_${index}`}
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
                      name={`delay_${index}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delay after previous email (hours)</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
