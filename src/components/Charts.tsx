'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

interface ChartProps {
  data: any[];
}

export function SuccessRateChart({ data }: ChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#9ca3af" tick={{fill: '#6b7280'}} />
          <YAxis stroke="#9ca3af" tick={{fill: '#6b7280'}} tickFormatter={(value) => `${value}%`} />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="successRate" 
            stroke="#16a34a" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#16a34a', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            name="Hatch Success Rate (%)" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SalesRevenueChart({ data }: ChartProps) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#9ca3af" tick={{fill: '#6b7280'}} />
          <YAxis stroke="#9ca3af" tick={{fill: '#6b7280'}} tickFormatter={(value) => `$${value}`} />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: any) => {
              if (typeof value === 'number') {
                return [`$${value.toFixed(2)}`, 'Revenue'];
              }
              return [value, 'Revenue'];
            }}
          />
          <Bar dataKey="revenue" fill="#d97706" radius={[4, 4, 0, 0]} name="Total Revenue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
