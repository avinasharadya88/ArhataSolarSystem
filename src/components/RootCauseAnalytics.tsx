import React from 'react';
import { ReturnCategory } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface RootCauseAnalyticsProps {
  distribution: {
    category: ReturnCategory;
    percentage: number;
    count: number;
    color: string;
    description: string;
  }[];
  onSelectCategory?: (category: ReturnCategory) => void;
}

export const RootCauseAnalytics: React.FC<RootCauseAnalyticsProps> = ({
  distribution,
  onSelectCategory,
}) => {
  const chartData = distribution.map((item) => ({
    name: item.category,
    value: item.count,
    color: item.color,
    percentage: item.percentage,
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div>
          <h2 className="text-sm font-bold text-white">Return Root Cause Distribution</h2>
          <p className="text-xs text-slate-400">
            AI Zero-Shot clustering across review text and RMA customer notes
          </p>
        </div>
        <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20 self-start sm:self-auto">
          1,420 Signals Processed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-4 items-center">
        {/* Left: Progress Bars List */}
        <div className="md:col-span-7 space-y-3.5">
          {distribution.map((item) => (
            <div
              key={item.category}
              onClick={() => onSelectCategory && onSelectCategory(item.category)}
              className="group cursor-pointer p-2 rounded-lg hover:bg-slate-800/40 transition"
            >
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium group-hover:text-white transition">
                  {item.category}
                </span>
                <span className="text-slate-400 font-mono">
                  {item.percentage}% ({item.count} returns)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Right: Pie Chart Visualization */}
        <div className="md:col-span-5 h-48 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
                formatter={(value: any, name: any) => [`${value} returns`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
