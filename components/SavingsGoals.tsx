import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Plus, Target, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SavingsGoal } from '@/lib/types';

interface SavingsGoalsProps {
  goals: SavingsGoal[];
  onAddGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
}

export function SavingsGoals({ goals, onAddGoal }: SavingsGoalsProps) {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const hasShownConfetti = useRef<Set<string>>(new Set());

  const calculateProgress = (goal: SavingsGoal) => {
    const progress = (goal.current / goal.target) * 100;
    if (progress >= 100 && !hasShownConfetti.current.has(goal.id)) {
      hasShownConfetti.current.add(goal.id);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    return Math.min(progress, 100);
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="w-5 h-5" />
          Savings Goals
        </CardTitle>
        <button 
          onClick={() => setShowAddGoal(true)}
          className="p-2 rounded-full bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
        >
          <Plus className="w-4 h-4 text-blue-400" />
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="relative">
              <div className="flex justify-between mb-2">
                <div>
                  <h4 className="text-sm font-medium text-white">{goal.name}</h4>
                  <p className="text-xs text-gray-400">
                    Due {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">
                    {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {calculateProgress(goal).toFixed(1)}%
                  </p>
                </div>
              </div>
              <Progress 
                value={calculateProgress(goal)} 
                className="h-2 bg-gray-800"
              />
              {goal.current >= goal.target && (
                <Trophy className="absolute -right-6 top-0 w-4 h-4 text-yellow-400 animate-bounce" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}