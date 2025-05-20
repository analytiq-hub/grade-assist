import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface DashboardMetricCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
  suffix?: string;
}

const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({ 
  title, 
  value, 
  change, 
  icon,
  color,
  suffix = '',
}) => {
  const isPositive = change > 0;
  
  return (
    <div className="card p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <span className={`p-2 rounded-md ${color}`}>
          {icon}
        </span>
        <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? (
            <>
              <ArrowUpRight size={16} className="mr-1" />
              +{change}%
            </>
          ) : (
            <>
              <ArrowDownRight size={16} className="mr-1" />
              {change}%
            </>
          )}
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}{suffix}</p>
    </div>
  );
};

export default DashboardMetricCard;