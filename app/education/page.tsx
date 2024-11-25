import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, BookOpen, PlayCircle, Users, Brain, Calculator, Lightbulb, Target, Award } from 'lucide-react';
//import Link from "next/link";

interface Course {
  icon: React.ReactNode;
  title: string;
  description: string;
  modules: string[];
  duration: string;
  gradient: string;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

export default function EducationPage() {
  const courses: Course[] = [
    {
      icon: <BookOpen className="w-12 h-12 text-blue-500/80" />,
      title: "Financial Basics",
      description: "Learn the fundamentals of personal finance",
      modules: ["Budgeting basics", "Saving strategies", "Understanding credit"],
      duration: "4 weeks",
      gradient: "from-blue-500/20 via-transparent to-transparent"
    },
    {
      icon: <Calculator className="w-12 h-12 text-purple-500/80" />,
      title: "Investment 101",
      description: "Start your investment journey with confidence",
      modules: ["Investment types", "Risk management", "Portfolio building"],
      duration: "6 weeks",
      gradient: "from-purple-500/20 via-transparent to-transparent"
    },
    {
      icon: <Target className="w-12 h-12 text-emerald-500/80" />,
      title: "Business Finance",
      description: "Master the basics of business financial management",
      modules: ["Business planning", "Cash flow management", "Growth strategies"],
      duration: "8 weeks",
      gradient: "from-emerald-500/20 via-transparent to-transparent"
    }
  ];

  const features: Feature[] = [
    {
      icon: <PlayCircle className="h-6 w-6 text-blue-400" />,
      title: "Video Lessons",
      description: "Learn through engaging video content and animations",
      gradient: "from-blue-500/20 via-transparent to-transparent"
    },
    {
      icon: <Users className="h-6 w-6 text-purple-400" />,
      title: "Group Learning",
      description: "Join study groups and learn from peers",
      gradient: "from-purple-500/20 via-transparent to-transparent"
    },
    {
      icon: <Brain className="h-6 w-6 text-emerald-400" />,
      title: "Interactive Quizzes",
      description: "Test your knowledge with practical exercises",
      gradient: "from-emerald-500/20 via-transparent to-transparent"
    }
  ];

  const achievements: Feature[] = [
    {
      icon: <Award className="h-6 w-6 text-pink-400" />,
      title: "Certificates",
      description: "Earn certificates upon course completion",
      gradient: "from-pink-500/20 via-transparent to-transparent"
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-amber-400" />,
      title: "Practical Projects",
      description: "Apply learning to real-world scenarios",
      gradient: "from-amber-500/20 via-transparent to-transparent"
    },
    {
      icon: <BookOpen className="h-6 w-6 text-indigo-400" />,
      title: "Expert Guidance",
      description: "Learn from financial professionals",
      gradient: "from-indigo-500/20 via-transparent to-transparent"
    }
  ];

  return (
    <main className="min-h-screen bg-black">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-gray-900 to-black"></div>

      {/* Hero Section */}
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text leading-[1.3] py-2">
              Financial Education
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-8">
              Empower yourself with knowledge to make better financial decisions
            </p>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90">
              Start Learning <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <Card key={index} className="group bg-gray-900/50 border-gray-800 hover:border-gray-700">
                <CardHeader>
                  <div className={`p-4 rounded-lg bg-gradient-to-r ${course.gradient} group-hover:scale-110 transition-transform duration-300`}>
                    {course.icon}
                  </div>
                  <CardTitle className="text-white text-2xl">{course.title}</CardTitle>
                  <CardDescription className="text-gray-400">{course.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-400">
                      <span className="font-semibold text-white">Duration:</span> {course.duration}
                    </p>
                    <div className="space-y-1">
                      <p className="text-white font-semibold">Modules:</p>
                      <ul className="list-disc pl-4">
                        {course.modules.map((module, i) => (
                          <li key={i} className="text-gray-400">{module}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    Enroll Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Features */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="bg-gray-900/50 border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Learning Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.gradient} group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="bg-gray-900/50 border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              What You&apos;ll Gain
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${achievement.gradient} group-hover:scale-110 transition-transform duration-300`}>
                    {achievement.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">{achievement.title}</h3>
                    <p className="text-gray-400 text-sm">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="relative p-8 md:p-12 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-gray-800 rounded-2xl"></div>
            <div className="relative text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Ready to Start Learning?
              </h2>
              <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of others on their journey to financial literacy.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90">
                Begin Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}