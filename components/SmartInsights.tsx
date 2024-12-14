import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';
import { Transaction } from '@/lib/types';

interface SmartInsightsProps {
  transactions: Transaction[];
  monthlyData: any[];
}

export function SmartInsights({ transactions, monthlyData }: SmartInsightsProps) {
  const generateInsights = () => {
    const insights = [];
    
    // Best saving month
    const bestMonth = monthlyData.reduce((max, curr) => 
      curr.total > max.total ? curr : max, monthlyData[0]);
    
    insights.push({
      type: 'success',
      icon: <TrendingUp className="w-5 h-5 text-green-400" />,
      title: 'Peak Performance',
      description: `Your best saving month was ${bestMonth.month} with ${formatCurrency(bestMonth.total)} saved.`
    });

    // Saving streak
    let currentStreak = 1;
    let maxStreak = 1;
    
    for (let i = 1; i < monthlyData.length; i++) {
      if (monthlyData[i].total >= monthlyData[i-1].total) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    if (maxStreak > 1) {
      insights.push({
        type: 'info',
        icon: <Calendar className="w-5 h-5 text-blue-400" />,
        title: 'Consistent Growth',
        description: `You maintained ${maxStreak} months of consecutive savings growth!`
      });
    }

    // Analyze deposit patterns
    const depositPatterns = transactions
      .filter(tx => tx.type === 'deposit' && tx.status === 'completed')
      .reduce((acc, tx) => {
        const date = new Date(tx.timestamp);
        const dayOfWeek = date.getDay();
        acc[dayOfWeek] = (acc[dayOfWeek] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

    const bestDay = Object.entries(depositPatterns)
      .reduce((max, [day, count]) => count > max[1] ? [day, count] : max, ['0', 0]);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    insights.push({
      type: 'info',
      icon: <Calendar className="w-5 h-5 text-purple-400" />,
      title: 'Saving Pattern',
      description: `You tend to save most frequently on ${days[parseInt(bestDay[0])]}.`
    });

    return insights;
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          Smart Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {generateInsights().map((insight, index) => (
            <div 
              key={index}
              className="flex gap-4 p-4 rounded-lg bg-gray-800/50"
            >
              <div className="mt-1">{insight.icon}</div>
              <div>
                <h4 className="text-sm font-medium text-white">{insight.title}</h4>
                <p className="text-sm text-gray-400">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}