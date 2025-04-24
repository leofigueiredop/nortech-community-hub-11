
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

interface NotificationSectionProps {
  replyEmail: string;
  onReplyEmailChange: (email: string) => void;
}

const NotificationSection: React.FC<NotificationSectionProps> = ({
  replyEmail,
  onReplyEmailChange
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-gray-500" />
          <CardTitle>Notification Identity</CardTitle>
        </div>
        <CardDescription>Configure how your community appears in notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <Label className="text-base font-semibold mb-2 block">
            Reply-to Email (for member notifications)
          </Label>
          <Input 
            type="email"
            placeholder="Enter reply-to email"
            value={replyEmail}
            onChange={(e) => onReplyEmailChange(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSection;
