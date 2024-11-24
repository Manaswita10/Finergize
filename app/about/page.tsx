import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, Target, Award, HandHeart, ArrowRight } from 'lucide-react';
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { number: "1M+", label: "Rural Users" },
    { label: "Villages Covered", number: "5000+" },
    { number: "₹100Cr+", label: "Total Savings" },
    { number: "98%", label: "Repayment Rate" }
  ];

  const values = [
    {
      icon: <Users className="h-8 w-8 text-blue-400" />,
      title: "Community First",
      description: "Building financial solutions that strengthen rural communities"
    },
    {
      icon: <Target className="h-8 w-8 text-purple-400" />,
      title: "Financial Inclusion",
      description: "Making banking accessible to every village and community"
    },
    {
      icon: <Award className="h-8 w-8 text-green-400" />,
      title: "Trust & Security",
      description: "Ensuring safe and secure financial transactions for all"
    },
    {
      icon: <HandHeart className="h-8 w-8 text-pink-400" />,
      title: "Empowerment",
      description: "Enabling financial independence through education and support"
    }
  ];

  return (
    <main className="min-h-screen bg-black">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black"></div>

      {/* Hero Section */}
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              Revolutionizing Rural Finance
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-8">
              Finergise is on a mission to transform financial services in rural India by combining technology with community-driven approaches.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 p-6 text-center">
                <h3 className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                  {stat.number}
                </h3>
                <p className="text-gray-400">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 p-6">
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Join Our Financial Revolution
            </h2>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}