"use client";

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Wallet, Users, BookOpen, TrendingUp, Building, Phone, Clock, CreditCard, AlertCircle, Sparkles } from "lucide-react"
import Link from "next/link"
import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

// Hover Effect Components
const HoverCard = ({
  className,
  children
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-black/20 border border-transparent dark:border-white/[0.1] group-hover:border-slate-700/50 relative z-20",
        className
      )}>
      <div className="relative z-50">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const CardTitle = ({
  className,
  children
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};

const CardDescription = ({
  className,
  children
}) => {
  return (
    <p className={cn("mt-4 text-zinc-400 tracking-wide leading-relaxed text-sm", className)}>
      {children}
    </p>
  );
};

export default function Home() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isCTAHovered, setIsCTAHovered] = useState(false);

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
      title: "Mutual Funds",
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
  ];

  const benefits = [
    {
      icon: <Phone className="w-6 h-6 text-blue-400" />,
      title: "Mobile First",
      description: "Access all services from your phone"
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-400" />,
      title: "24/7 Access",
      description: "Bank anytime, anywhere"
    },
    {
      icon: <CreditCard className="w-6 h-6 text-blue-400" />,
      title: "Easy Payments",
      description: "Simple digital transactions"
    },
    {
      icon: <AlertCircle className="w-6 h-6 text-blue-400" />,
      title: "Instant Alerts",
      description: "Real-time transaction updates"
    }
  ];

  return (
    <main className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      {/* Grid background with reduced opacity */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(26,26,26,0.6)_1px,transparent_1px),linear-gradient(to_bottom,rgba(26,26,26,0.6)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      {/* Left to right gradient light effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-transparent pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="mb-8 text-2xl md:text-3xl">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                Welcome to
              </span>
            </div>

            {/* Enhanced Lamp Effect */}
            <div className="relative w-full max-w-4xl mx-auto mb-8">
              <div className="absolute left-0 right-0 top-2">
                {/* Main light bar */}
                <div className="h-1 bg-cyan-400 rounded-full shadow-[0_0_20px_2px_rgba(34,211,238,0.3)] relative z-10" />
                
                {/* Glow effects */}
                <div className="absolute -top-6 left-0 right-0 h-32 bg-gradient-to-b from-cyan-500/20 via-cyan-500/10 to-transparent blur-xl" />
                <div className="absolute -top-3 left-0 right-0 h-16 bg-cyan-400/10 blur-lg" />
                
                {/* Additional ambient glow */}
                <div className="absolute -top-1 left-0 right-0 h-24 bg-gradient-to-b from-cyan-400/20 to-transparent blur-xl" />
              </div>
            </div>

            <h1 className="font-bold mb-6">
              <span className="text-7xl md:text-8xl lg:text-9xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text animate-gradient inline-block leading-[1.8] tracking-tighter py-5">
                Finergize
              </span>
            </h1>
            <p className="text-gray-400 text-xl md:text-2xl mb-12 max-w-3xl mx-auto">
              Join millions building a better financial future with secure banking, savings, and community-driven growth.
            </p>

            {/* Updated Modern Button Group */}
            <div className="flex flex-wrap gap-4 justify-center items-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl" />
              
              {/* Get Started Button */}
              <Link href="/register">
                <button
                  onMouseEnter={() => setIsButtonHovered(true)}
                  onMouseLeave={() => setIsButtonHovered(false)}
                  className="relative group overflow-hidden rounded-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  <div className="relative flex items-center gap-2">
                    <span className="text-white font-semibold text-lg">Get Started</span>
                    <ArrowRight className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-300 to-purple-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </Link>

              {/* Learn More Button */}
              <Link href="/about">
                <button className="relative group overflow-hidden rounded-full px-8 py-4 bg-transparent border-2 border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                    Learn More
                  </span>
                </button>
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

      {/* Features Section with Updated Heading */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          {/* Modern Features Heading */}
          <div className="relative text-center mb-16">
            {/* Animated background elements */}
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
              <div className="w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-100" />
            </div>
            
            {/* Main content */}
            <div className="relative">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-blue-400" />
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 text-transparent bg-clip-text animate-gradient bg-300% py-2">
                  Revolutionary Features
                </h2>
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              
              <p className="text-gray-400 text-lg">
                Everything you need to manage your finances
              </p>
              
              {/* Decorative line */}
              <div className="mt-4 relative h-1 max-w-xs mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-sm" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, idx) => (
              <Link
                href={feature.href}
                key={idx}
                className="relative group block p-2 h-full w-full"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <AnimatePresence>
                  {hoveredIndex === idx && (
                    <motion.span
                      className="absolute inset-0 h-full w-full bg-slate-800/[0.4] block rounded-3xl"
                      layoutId="hoverBackground"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: 1,
                        transition: { duration: 0.15 },
                      }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.15, delay: 0.2 },
                      }}
                    />
                  )}
                </AnimatePresence>
                <HoverCard>
                  <div className={`p-4 rounded-lg bg-gradient-to-r ${feature.gradient} group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                  <div className="mt-4 text-blue-400 hover:text-blue-300 flex items-center">
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </HoverCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 py-2">
                    Why Choose Finergize?
                  </h2>
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-500/5 rounded-full blur-xl" />
                  <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-purple-500/10 rounded-full blur-xl" />
                </motion.div>
              </div>
              
              <p className="text-gray-400 text-lg">
                Experience the future of rural banking with our innovative platform designed specifically for your needs.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="group relative overflow-hidden">
                      {/* Animated border gradient */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-pink-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Card content */}
                      <div className="relative p-6 bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.05] to-purple-500/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Icon with glow */}
                        <div className="relative">
                          <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 w-fit">
                            {benefit.icon}
                          </div>
                          <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                        
                        <h3 className="text-white font-semibold text-lg mt-4">{benefit.title}</h3>
                        <p className="text-gray-400 mt-2 text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats Card */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* Background card with glass effect */}
                <div className="p-8 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-gray-800/50 relative overflow-hidden">
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50" />
                  
                  <div className="relative space-y-6">
                    {[
                      { 
                        icon: <Users className="w-6 h-6" />,
                        title: "Active Users",
                        value: "10K+",
                        subtitle: "Growing community",
                        color: "blue"
                      },
                      { 
                        icon: <Wallet className="w-6 h-6" />,
                        title: "Total Savings",
                        value: "₹5Cr+",
                        subtitle: "Community savings",
                        color: "purple"
                      },
                      { 
                        icon: <TrendingUp className="w-6 h-6" />,
                        title: "Growth Rate",
                        value: "15%",
                        subtitle: "Monthly increase",
                        color: "pink"
                      }
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group"
                      >
                        <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-lg bg-${stat.color}-500/20 text-${stat.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                              {stat.icon}
                            </div>
                            <div>
                              <p className="text-white font-medium">{stat.title}</p>
                              <p className="text-gray-400 text-sm">{stat.subtitle}</p>
                            </div>
                          </div>
                          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text group-hover:scale-110 transition-transform duration-300">
                            {stat.value}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Decorative blurred circles */}
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-purple-500/5 to-pink-500/5" />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/4 -left-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-1/4 -right-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900/50 via-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-gray-800/50 shadow-2xl">
              {/* Decorative grid */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] rounded-3xl" />

              {/* Content container */}
              <div className="relative z-10 text-center space-y-8">
                {/* Heading with gradient animation */}
                <div className="relative">
                  <motion.span
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="absolute h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bottom-0 left-0 right-0 rounded-full opacity-50"
                  />
                  <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white pb-4">
                    Ready to Start Your Financial Journey?
                  </h2>
                </div>

                {/* Description */}
                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Join thousands of others who have already taken control of their financial future.
                </p>

                {/* Button */}
                <div className="pt-4">
                  <Link href="/register">
                    <button
                      onMouseEnter={() => setIsCTAHovered(true)}
                      onMouseLeave={() => setIsCTAHovered(false)}
                      className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
                    >
                      {/* Gradient background shift on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                      
                      {/* Shine effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 duration-500 transition-opacity">
                        <div className="absolute inset-0 translate-x-full group-hover:translate-x-[-100%] bg-gradient-to-r from-transparent via-white to-transparent transition-transform duration-1000" />
                      </div>

                      {/* Button content */}
                      <span className="relative flex items-center">
                        <span className="text-white font-semibold text-lg px-2">Create Free Account</span>
                        <ArrowRight className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform duration-300" />
                      </span>

                      {/* Bottom highlight */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Additional decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-500" />
          </motion.div>
        </div>
      </section>
    </main>
  );
}