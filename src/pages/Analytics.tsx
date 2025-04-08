
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const memberData = [
  { name: 'Jan', total: 12 },
  { name: 'Feb', total: 18 },
  { name: 'Mar', total: 25 },
  { name: 'Apr', total: 42 },
  { name: 'May', total: 65 },
  { name: 'Jun', total: 78 },
];

const activityData = [
  { name: 'Mon', posts: 4, comments: 12, streams: 1 },
  { name: 'Tue', posts: 6, comments: 18, streams: 0 },
  { name: 'Wed', posts: 5, comments: 15, streams: 1 },
  { name: 'Thu', posts: 8, comments: 25, streams: 0 },
  { name: 'Fri', posts: 10, comments: 30, streams: 2 },
  { name: 'Sat', posts: 12, comments: 20, streams: 1 },
  { name: 'Sun', posts: 8, comments: 15, streams: 0 },
];

const deviceData = [
  { name: 'Desktop', value: 65 },
  { name: 'Mobile', value: 30 },
  { name: 'Tablet', value: 5 },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

const timeData = [
  { time: '12-2 AM', value: 5 },
  { time: '2-4 AM', value: 3 },
  { time: '4-6 AM', value: 2 },
  { time: '6-8 AM', value: 8 },
  { time: '8-10 AM', value: 15 },
  { time: '10 AM-12 PM', value: 25 },
  { time: '12-2 PM', value: 35 },
  { time: '2-4 PM', value: 42 },
  { time: '4-6 PM', value: 38 },
  { time: '6-8 PM', value: 30 },
  { time: '8-10 PM', value: 20 },
  { time: '10 PM-12 AM', value: 10 },
];

const StatCard = ({ title, value, description, trend, info }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
            {title}
            {info && (
              <Info className="ml-1" size={14} />
            )}
          </CardTitle>
          {trend && (
            <div className={`flex items-center ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="ml-1 text-xs">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

const Analytics = () => {
  return (
    <MainLayout title="Analytics">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Analytics</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={16} />
            <span>Last 30 days</span>
          </div>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard 
                title="Total Members" 
                value="148" 
                description="All-time community members"
                trend={12}
                info={true}
              />
              <StatCard 
                title="Active Members (30 days)" 
                value="86" 
                description="58% of total members"
                trend={8}
                info={true}
              />
              <StatCard 
                title="MAU (30 days)" 
                value="42%" 
                description="Monthly active users"
                trend={-3}
                info={true}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard 
                title="Daily Active Members (30 days)" 
                value="32" 
                description="22% of total members"
                trend={5}
                info={true}
              />
              <StatCard 
                title="Inactive Members (30 days)" 
                value="62" 
                description="42% of total members"
                trend={-8}
                info={true}
              />
              <StatCard 
                title="Invitations Pending" 
                value="15" 
                description="Sent in the last 30 days"
                info={true}
              />
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Growth Trend</CardTitle>
                <CardDescription>New members per month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={memberData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Day & Time (90 days)</CardTitle>
                <CardDescription>When your community is most active</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Activity by Day</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={activityData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="posts" fill="#8884d8" name="Posts" />
                      <Bar dataKey="comments" fill="#82ca9d" name="Comments" />
                      <Bar dataKey="streams" fill="#ffc658" name="Streams" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Activity by Time</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={timeData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.3} />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" name="Activity" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Member Growth</CardTitle>
                  <CardDescription>New members per month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={memberData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Device Distribution</CardTitle>
                  <CardDescription>What devices members use</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Content Engagement</CardTitle>
                <CardDescription>Engagement across different content types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={[
                      { name: 'Posts', views: 2456, likes: 1234, comments: 865 },
                      { name: 'Courses', views: 1876, likes: 954, comments: 542 },
                      { name: 'Streams', views: 1543, likes: 876, comments: 324 },
                      { name: 'Discussions', views: 1234, likes: 765, comments: 687 },
                      { name: 'Events', views: 987, likes: 546, comments: 231 },
                    ]}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#8884d8" name="Views" />
                    <Bar dataKey="likes" fill="#82ca9d" name="Likes" />
                    <Bar dataKey="comments" fill="#ffc658" name="Comments" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Engagement</CardTitle>
                <CardDescription>User activity throughout the week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={activityData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="posts" stroke="#8884d8" name="Posts" />
                    <Line type="monotone" dataKey="comments" stroke="#82ca9d" name="Comments" />
                    <Line type="monotone" dataKey="streams" stroke="#ffc658" name="Streams" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Analytics;
