import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChartIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dados de exemplo - em um cenário real, estes viriam do Supabase
const data = [
  { name: 'Jan', members: 400 },
  { name: 'Feb', members: 300 },
  { name: 'Mar', members: 200 },
  { name: 'Apr', members: 278 },
  { name: 'May', members: 189 },
  { name: 'Jun', members: 239 },
  { name: 'Jul', members: 349 },
];

export const GrowthCharts = () => {
  return (
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
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="members" stroke="#8884d8" fillOpacity={1} fill="url(#colorMembers)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}; 