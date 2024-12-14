"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Users, 
  TrendingUp,
  PiggyBank,
  Plus,
  ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function MyGroupsPage() {
  const router = useRouter();

  const myGroups = [
    {
      id: "wsc-001",
      name: "Weekly Savings Circle",
      type: "Weekly",
      members: 15,
      totalSavings: "₹45,000",
      nextContribution: "15 Dec 2024",
      performance: "+12.5%"
    },
    {
      id: "dsg-002",
      name: "Daily Savings Group",
      type: "Daily",
      members: 12,
      totalSavings: "₹25,000",
      nextContribution: "Tomorrow",
      performance: "+8.2%"
    }
  ];

  return (
    <main className="min-h-screen bg-black pt-24">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black"></div>

      <div className="container mx-auto px-4">
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
              <h1 className="text-2xl font-bold text-white">My Savings Groups</h1>
              <p className="text-gray-400">Manage your group savings</p>
            </div>
          </div>
          <Button 
            className="bg-gradient-to-r from-blue-500 to-purple-500"
            onClick={() => router.push('/banking/savings/join')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Join New Group
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myGroups.map((group) => (
            <Card 
              key={group.id} 
              className="bg-gray-900/50 border-gray-800 hover:border-gray-700 cursor-pointer"
              onClick={() => router.push(`/banking/savings/group-details/${group.id}`)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {group.type === "Weekly" ? (
                      <Users className="h-8 w-8 text-purple-400" />
                    ) : (
                      <PiggyBank className="h-8 w-8 text-blue-400" />)}
                      <div>
                        <CardTitle className="text-xl text-white">{group.name}</CardTitle>
                        <CardDescription>{group.type} Group</CardDescription>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Total Members</p>
                      <p className="text-lg font-semibold text-white">{group.members}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Total Savings</p>
                      <p className="text-lg font-semibold text-white">{group.totalSavings}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Next Contribution</p>
                      <p className="text-lg font-semibold text-white">{group.nextContribution}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Performance</p>
                      <p className="text-lg font-semibold text-green-400">{group.performance}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    );
  }