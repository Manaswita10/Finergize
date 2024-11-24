import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowRight, Shield, Wallet, Users, BookOpen, TrendingUp, Building, Phone, Clock, CreditCard, AlertCircle, Sparkles } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const features = [
    {
      icon: <Building className="w-12 h-12 text-blue-500/80" />,
      title: "Digital Banking",
      description: "Access banking services right from your community",
      gradient: "from-blue-500/20 via-transparent to-transparent",
      href: "/banking"
    },
    {
      icon: <Users className="w-12 h-12 text-purple-500/80" />,
      title: "Community Savings",
      description: "Join local savings groups and grow together",
      gradient: "from-purple-500/20 via-transparent to-transparent",
      href: "/savings"
    },
    {
      icon: <Wallet className="w-12 h-12 text-emerald-500/80" />,
      title: "Micro Loans",
      description: "Quick access to fair and transparent loans",
      gradient: "from-emerald-500/20 via-transparent to-transparent",
      href: "/loans"
    },
    {
      icon: <Shield className="w-12 h-12 text-pink-500/80" />,
      title: "Secure Transfers",
      description: "Bank-grade security for all transactions",
      gradient: "from-pink-500/20 via-transparent to-transparent",
      href: "/security"
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-orange-500/80" />,
      title: "Growth Analytics",
      description: "Track your financial progress visually",
      gradient: "from-orange-500/20 via-transparent to-transparent",
      href: "/analytics"
    },
    {
      icon: <BookOpen className="w-12 h-12 text-cyan-500/80" />,
      title: "Financial Education",
      description: "Learn about savings and investments",
      gradient: "from-cyan-500/20 via-transparent to-transparent",
      href: "/education"
    }
  ]

  const benefits = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Mobile First",
      description: "Access all services from your phone"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Access",
      description: "Bank anytime, anywhere"
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Easy Payments",
      description: "Simple digital transactions"
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Instant Alerts",
      description: "Real-time transaction updates"
    }
  ]

  return (
    <main className="min-h-screen bg-black">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black"></div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
  <div className="container mx-auto px-4 relative z-10">
    <div className="text-center">
      <div className="mb-8 text-2xl md:text-3xl">
        <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          Welcome to
        </span>
      </div>


     <h1 className="font-bold mb-6">
        <span className="text-7xl md:text-8xl lg:text-9xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text animate-gradient inline-block leading-tight tracking-tighter">
          Finergise
        </span>
     </h1>
      <p className="text-gray-400 text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
        Join millions building a better financial future with secure banking, savings, and community-driven growth.
      </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 text-white">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating elements animation */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text inline-flex items-center gap-2">
              <Sparkles className="w-8 h-8" /> Revolutionary Features
            </h2>
            <p className="text-gray-400 mt-4">Everything you need to manage your finances</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link href={feature.href} key={index} className="cursor-pointer">
                <Card className="group bg-gray-900/50 border-gray-800 hover:border-gray-700 backdrop-blur-sm transition-all duration-300 hover:transform hover:-translate-y-1">
                  <CardHeader>
                    <div className={`p-4 rounded-lg bg-gradient-to-r ${feature.gradient} group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-white mt-4">{feature.title}</CardTitle>
                    <CardDescription className="text-gray-400">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-blue-400 hover:text-blue-300 p-0 flex items-center">
                      Learn more <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                  Why Choose Finergize?
              </h2>
              <p className="text-gray-400 mb-8">
                Experience the future of rural banking with our innovative platform designed specifically for your needs.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-colors">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-gray-400 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-gray-800 backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-blue-500/20">
                        <Users className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Active Users</p>
                        <p className="text-gray-400 text-sm">Growing community</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-blue-400">10K+</p>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-purple-500/20">
                        <Wallet className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Total Savings</p>
                        <p className="text-gray-400 text-sm">Community savings</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-purple-400">₹5Cr+</p>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-pink-500/20">
                        <TrendingUp className="w-6 h-6 text-pink-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Growth Rate</p>
                        <p className="text-gray-400 text-sm">Monthly increase</p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-pink-400">15%</p>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="relative p-8 md:p-12 rounded-2xl overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-gray-800 rounded-2xl"></div>
            
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Ready to Start Your Financial Journey?
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of others who have already taken control of their financial future.
              </p>
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90">
                  Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}