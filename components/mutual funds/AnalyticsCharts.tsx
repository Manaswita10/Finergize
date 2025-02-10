import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

interface ChartProps {
  data: any[];
  type: 'line' | 'area' | 'pie';
  height?: number;
  colors?: string[];
  dataKeys: {
    x: string;
    y: string | string[];
  };
  showGrid?: boolean;
  showLegend?: boolean;
  customTooltip?: boolean;
}

const defaultColors = ['#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#EC4899'];

export const AnalyticsChart: React.FC<ChartProps> = ({
  data,
  type,
  height = 300,
  colors = defaultColors,
  dataKeys,
  showGrid = true,
  showLegend = true,
  customTooltip = true
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-gray-700 rounded-lg p-3">
          {label && (
            <div className="text-sm text-gray-400 mb-2">
              {label}
            </div>
          )}
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 py-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm font-medium text-gray-300">
                {entry.name}:
              </span>
              <span className="text-sm text-gray-400">
                {typeof entry.value === 'number' 
                  ? entry.value.toLocaleString()
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const commonProps = {
    width: "100%",
    height: height,
    data: data,
    margin: { top: 5, right: 30, left: 20, bottom: 5 }
  };

  const commonAxisProps = {
    stroke: "#9CA3AF",
    fontSize: 12,
    tickLine: false,
    axisLine: { stroke: "#374151" }
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#374151" 
                vertical={false}
              />
            )}
            <XAxis 
              dataKey={dataKeys.x}
              {...commonAxisProps}
            />
            <YAxis {...commonAxisProps} />
            {customTooltip ? (
              <Tooltip content={<CustomTooltip />} />
            ) : (
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
              />
            )}
            {showLegend && (
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px',
                  fontSize: '12px'
                }}
              />
            )}
            {(Array.isArray(dataKeys.y) ? dataKeys.y : [dataKeys.y]).map(
              (key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              )
            )}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#374151" 
                vertical={false}
              />
            )}
            <XAxis 
              dataKey={dataKeys.x}
              {...commonAxisProps}
            />
            <YAxis {...commonAxisProps} />
            {customTooltip ? (
              <Tooltip content={<CustomTooltip />} />
            ) : (
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
              />
            )}
            {showLegend && (
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px',
                  fontSize: '12px'
                }}
              />
            )}
            {(Array.isArray(dataKeys.y) ? dataKeys.y : [dataKeys.y]).map(
              (key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[index % colors.length]}
                  fill={`url(#colorGradient${index})`}
                  fillOpacity={0.3}
                >
                  <defs>
                    <linearGradient
                      id={`colorGradient${index}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={colors[index % colors.length]}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={colors[index % colors.length]}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                </Area>
              )
            )}
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart {...commonProps}>
            <Pie
              data={data}
              dataKey={Array.isArray(dataKeys.y) ? dataKeys.y[0] : dataKeys.y}
              nameKey={dataKeys.x}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            {customTooltip ? (
              <Tooltip content={<CustomTooltip />} />
            ) : (
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
              />
            )}
            {showLegend && (
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '20px',
                  fontSize: '12px'
                }}
              />
            )}
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      {renderChart()}
    </ResponsiveContainer>
  );
};

export default AnalyticsChart;