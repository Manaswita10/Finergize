import { DateRange } from '@/lib/types';

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const calculateGrowthRate = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

export const getDateRangePresets = () => [
  {
    label: 'Last 7 days',
    range: {
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      to: new Date()
    }
  },
  {
    label: 'Last 30 days',
    range: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date()
    }
  },
  {
    label: 'Last 90 days',
    range: {
      from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      to: new Date()
    }
  },
  {
    label: 'This year',
    range: {
      from: new Date(new Date().getFullYear(), 0, 1),
      to: new Date()
    }
  }
];

export const isWithinRange = (date: string, range: DateRange): boolean => {
  const timestamp = new Date(date).getTime();
  return timestamp >= range.from.getTime() && timestamp <= range.to.getTime();
};