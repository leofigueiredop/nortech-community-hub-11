import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, ArrowRightIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalyticsCardProps {
  title: string;
  value: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
  info?: boolean;
}

const AnalyticsCard = ({ title, value, description, trend, info }: AnalyticsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {info && (
          <div className="h-4 w-4 text-muted-foreground cursor-help rounded-full border border-input flex items-center justify-center">
            <span className="text-[10px]">i</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          {trend === 'up' && <ArrowUpIcon className="h-3 w-3 text-green-500" />}
          {trend === 'down' && <ArrowDownIcon className="h-3 w-3 text-red-500" />}
          {trend === 'neutral' && <ArrowRightIcon className="h-3 w-3 text-yellow-500" />}
          {description}
        </p>
      </CardContent>
    </Card>
  );
};

export const OverviewCards = () => {
  const analyticsData = [
    {
      title: "Total Members",
      value: "1,234",
      description: "10.1% increase from last month",
      trend: "up" as const,
      info: true
    },
    {
      title: "Active Members",
      value: "847",
      description: "73% of total members",
      trend: "neutral" as const,
      info: true
    },
    {
      title: "Monthly Views",
      value: "12.5K",
      description: "5.2% decrease from last month",
      trend: "down" as const,
      info: true
    },
    {
      title: "Average Engagement",
      value: "24.3%",
      description: "2.1% increase from last month",
      trend: "up" as const,
      info: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {analyticsData.map((item, index) => (
        <AnalyticsCard key={index} {...item} />
      ))}
    </div>
  );
}; 