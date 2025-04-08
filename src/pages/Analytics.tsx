
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowDownIcon, 
  ArrowRightIcon, 
  ArrowUpIcon, 
  UsersIcon, 
  EyeIcon, 
  GlobeIcon, 
  LineChartIcon,
  MessageSquareIcon 
} from 'lucide-react';
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Legend, 
  Line, 
  LineChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';

const data = [
  { name: 'Jan', members: 400, visitors: 240, engagement: 140 },
  { name: 'Feb', members: 300, visitors: 139, engagement: 221 },
  { name: 'Mar', members: 200, visitors: 980, engagement: 229 },
  { name: 'Apr', members: 278, visitors: 390, engagement: 200 },
  { name: 'May', members: 189, visitors: 480, engagement: 218 },
  { name: 'Jun', members: 239, visitors: 380, engagement: 250 },
  { name: 'Jul', members: 349, visitors: 430, engagement: 210 },
];

const sourceData = [
  { name: 'Direct', value: 40 },
  { name: 'Organic Search', value: 30 },
  { name: 'Referral', value: 20 },
  { name: 'Social Media', value: 10 },
];

const engagementData = [
  { name: 'Posts', value: 40 },
  { name: 'Comments', value: 30 },
  { name: 'Reactions', value: 20 },
  { name: 'Shares', value: 10 },
];

interface AnalyticsCardProps {
  title: string;
  value: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
  info: boolean;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, value, description, trend, info }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
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

const Analytics: React.FC = () => {
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
    <MainLayout title="Analytics">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-6">Analytics</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {analyticsData.map((item, index) => (
              <AnalyticsCard
                key={index}
                title={item.title}
                value={item.value}
                description={item.description}
                trend={item.trend}
                info={item.info}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <LineChartIcon className="h-5 w-5" />
                  Member Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area type="monotone" dataKey="members" stroke="#8884d8" fillOpacity={1} fill="url(#colorMembers)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <EyeIcon className="h-5 w-5" />
                  Visitor Traffic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="visitors" stroke="#8884d8" />
                      <Line type="monotone" dataKey="engagement" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GlobeIcon className="h-5 w-5" />
                  Traffic Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sourceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquareIcon className="h-5 w-5" />
                  Engagement Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={engagementData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics;
