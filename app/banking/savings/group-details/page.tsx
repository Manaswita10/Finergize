"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Users, 
  TrendingUp, 
  Calendar, 
  Wallet,
  PiggyBank,
  History
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function GroupDetailsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const groupStats = {
    totalMembers: 15,
    totalSavings: "₹45,000",
    avgContribution: "₹1,000",
    nextCollection: "15 Dec 2024",
    performance: "+12.5%"
  };

  const recentActivities = [
    {
      type: "contribution",
      user: "Rahul S.",
      amount: "₹500",
      date: "2 hours ago"
    },
    {
      type: "withdrawal",
      user: "Priya M.",
      amount: "₹2,000",
      date: "1 day ago"
    },
    {
      type: "join",
      user: "Amit K.",
      date: "2 days ago"
    }
  ];

  return (
    <main className="min-h-screen bg-black pt-24">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black"></div>

      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Weekly Savings Circle</h1>
            <p className="text-gray-400">Group ID: WSC-2024-001</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Users className="h-8 w-8 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Total Members</p>
                  <p className="text-xl font-bold text-white">{groupStats.totalMembers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <PiggyBank className="h-8 w-8 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-400">Total Savings</p>
                  <p className="text-xl font-bold text-white">{groupStats.totalSavings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <TrendingUp className="h-8 w-8 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Performance</p>
                  <p className="text-xl font-bold text-white">{groupStats.performance}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <Calendar className="h-8 w-8 text-red-400" />
                <div>
                  <p className="text-sm text-gray-400">Next Collection</p>
                  <p className="text-xl font-bold text-white">{groupStats.nextCollection}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-900/50 border-gray-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>Group Overview</CardTitle>
                <CardDescription>View group performance and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add charts and detailed statistics here */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest group transactions and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-800">
                      <div className="flex items-center space-x-4">
                        <History className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-sm text-white">{activity.user}</p>
                          <p className="text-xs text-gray-400">{activity.date}</p>
                        </div>
                      </div>
                      {activity.amount && (
                        <p className="text-sm font-medium text-white">{activity.amount}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}