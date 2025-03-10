"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Users,
  Plus,
  TrendingUp,
  Calendar,
  Wallet,
  Settings,
  UserPlus,
  MessageSquare
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SavingsGroup {
  id: string;
  name: string;
  members: number;
  totalSavings: number;
  monthlyContribution: number;
  nextContribution: string;
  progress: number;
}

export default function GroupsPage() {
  const router = useRouter();
  const [newGroupName, setNewGroupName] = useState("");

  const groups: SavingsGroup[] = [
    {
      id: "1",
      name: "Village Savings Circle",
      members: 12,
      totalSavings: 24000,
      monthlyContribution: 2000,
      nextContribution: "2024-04-01",
      progress: 75
    },
    {
      id: "2",
      name: "Farmers Association",
      members: 8,
      totalSavings: 16000,
      monthlyContribution: 1500,
      nextContribution: "2024-04-05",
      progress: 60
    },
    {
      id: "3",
      name: "Women's Self Help",
      members: 15,
      totalSavings: 30000,
      monthlyContribution: 1000,
      nextContribution: "2024-04-10",
      progress: 90
    }
  ];

  const handleCreateGroup = () => {
    // Handle group creation
  };

  return (
    <main className="min-h-screen bg-black pt-24">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black"></div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-4"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Savings Groups</h1>
              <p className="text-gray-400">Manage your community savings</p>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800">
              <DialogHeader>
                <DialogTitle>Create New Savings Group</DialogTitle>
                <DialogDescription>
                  Start a new savings group with your community
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Group Name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="bg-gray-800/50 border-gray-700"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Monthly Contribution Amount"
                    className="bg-gray-800/50 border-gray-700"
                  />
                </div>
                <Button 
                  className="w-full"
                  onClick={handleCreateGroup}
                >
                  Create Group
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

       {/* Groups Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card key={group.id} className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-white">{group.name}</span>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {group.members} members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Total Savings */}
                  <div className="bg-gray-800/30 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Total Savings</span>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      ₹{group.totalSavings.toLocaleString()}
                    </div>
                  </div>

                  {/* Monthly Contribution */}
                  <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                    <div>
                      <p className="text-gray-400 text-sm">Monthly Contribution</p>
                      <p className="text-white font-medium">₹{group.monthlyContribution}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Wallet className="h-4 w-4 mr-1" />
                      Contribute
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Monthly Progress</span>
                      <span className="text-white">{group.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${group.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Next Contribution */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      Next Contribution
                    </div>
                    <span className="text-white">
                      {new Date(group.nextContribution).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button variant="outline" className="text-sm">
                      <UserPlus className="h-4 w-4 mr-1" />
                      Invite
                    </Button>
                    <Button variant="outline" className="text-sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Chat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Create New Group Card */}
          <Dialog>
            <DialogTrigger asChild>
              <Card className="bg-gray-900/50 border-gray-800 border-dashed cursor-pointer hover:bg-gray-800/30 transition-colors">
                <CardContent className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-400">
                  <Plus className="h-12 w-12 mb-4" />
                  <p className="text-lg font-medium">Create New Group</p>
                  <p className="text-sm text-center mt-2">
                    Start a new savings group with your community
                  </p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-800">
              <DialogHeader>
                <DialogTitle>Create New Savings Group</DialogTitle>
                <DialogDescription>
                  Set up your group's saving goals and rules
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Group Name</label>
                  <Input
                    placeholder="Enter group name"
                    className="bg-gray-800/50 border-gray-700"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Monthly Contribution</label>
                  <Input
                    type="number"
                    placeholder="Amount in ₹"
                    className="bg-gray-800/50 border-gray-700"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Group Description</label>
                  <Input
                    placeholder="Describe your group's purpose"
                    className="bg-gray-800/50 border-gray-700"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Contribution Day</label>
                  <Input
                    type="date"
                    className="bg-gray-800/50 border-gray-700"
                  />
                </div>
                <Button className="w-full">
                  Create Group
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Recent Activity */}
        <Card className="bg-gray-900/50 border-gray-800 mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your groups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  group: "Village Savings Circle",
                  action: "New contribution",
                  amount: "₹2,000",
                  time: "2 hours ago"
                },
                {
                  group: "Farmers Association",
                  action: "New member joined",
                  amount: null,
                  time: "Yesterday"
                },
                {
                  group: "Women's Self Help",
                  action: "Goal reached",
                  amount: "₹30,000",
                  time: "2 days ago"
                }
              ].map((activity, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                >
                  <div>
                    <p className="text-white font-medium">{activity.group}</p>
                    <p className="text-gray-400 text-sm">{activity.action}</p>
                  </div>
                  <div className="text-right">
                    {activity.amount && (
                      <p className="text-green-500 font-medium">{activity.amount}</p>
                    )}
                    <p className="text-gray-400 text-sm">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}