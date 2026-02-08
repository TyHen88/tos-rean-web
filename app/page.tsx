"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { registerServiceWorker } from "./register-sw"
import { BookOpen, GraduationCap, Users, PlayCircle, Star, ArrowRight, CheckCircle2 } from "lucide-react"

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
    }
    registerServiceWorker()
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return null // Or a splash screen
  }

  const featuredCourses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "Sarah Johnson",
      rating: 4.9,
      students: 12500,
      price: "$89.99",
      image: "bg-blue-500",
      category: "Development",
      level: "Beginner"
    },
    {
      id: 2,
      title: "UI/UX Design Masterclass",
      instructor: "Michael Chen",
      rating: 4.8,
      students: 8300,
      price: "$74.99",
      image: "bg-purple-500",
      category: "Design",
      level: "Intermediate"
    },
    {
      id: 3,
      title: "Data Science Fundamentals",
      instructor: "Emily Davis",
      rating: 4.7,
      students: 5100,
      price: "$94.99",
      image: "bg-green-500",
      category: "Data Science",
      level: "All Levels"
    }
  ]

  const features = [
    {
      icon: <PlayCircle className="w-10 h-10 text-primary" />,
      title: "Learn at Your Own Pace",
      description: "Access high-quality video lessons anytime, anywhere. Your learning schedule is completely up to you."
    },
    {
      icon: <Users className="w-10 h-10 text-primary" />,
      title: "Expert Instructors",
      description: "Learn from industry professionals who are experts in their fields and passionate about teaching."
    },
    {
      icon: <GraduationCap className="w-10 h-10 text-primary" />,
      title: "Earn Certificates",
      description: "Receive recognized certificates upon completion to showcase your skills to potential employers."
    }
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header/Nav */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">TosRean</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#courses" className="text-sm font-medium hover:text-primary transition-colors">Courses</Link>
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
            <Link href="#mentors" className="text-sm font-medium hover:text-primary transition-colors">Mentors</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
              <Badge variant="secondary" className="px-4 py-2 rounded-full text-sm">
                🚀 Start your learning journey today
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance">
                Unlock Your Potential with <span className="text-primary">TosRean</span>
              </h1>
              <p className="text-xl text-muted-foreground text-balance max-w-2xl">
                Master new skills with our comprehensive online courses. From coding to design, we have everything you need to advance your career.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Button size="lg" className="text-lg px-8 h-12 gap-2">
                  Explore Courses <ArrowRight className="w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 h-12">
                  View Learning Paths
                </Button>
              </div>
              <div className="pt-8 flex items-center gap-8 text-muted-foreground text-sm font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> 100+ Courses
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Expert Mentors
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Lifetime Access
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Courses Section */}
        <section id="courses" className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Featured Courses</h2>
                <p className="text-muted-foreground">Explore our most popular learning paths</p>
              </div>
              <Button variant="outline">View All Courses</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <Card key={course.id} className="group hover:shadow-lg transition-all duration-300 border-none shadow-md overflow-hidden">
                  <div className={`h-48 ${course.image} w-full relative`}>
                    <Badge className="absolute top-4 right-4 bg-background/90 text-foreground backdrop-blur-sm hover:bg-background/90">
                      {course.category}
                    </Badge>
                  </div>
                  <CardHeader className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" /> {course.students.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" /> {course.rating}
                      </span>
                    </div>
                    <CardTitle className="line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                      {course.title}
                    </CardTitle>
                    <CardDescription>By {course.instructor}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Badge variant="outline" className="font-normal">{course.level}</Badge>
                      <span>•</span>
                      <span>12h 30m</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between pt-0">
                    <span className="text-lg font-bold">{course.price}</span>
                    <Button variant="secondary" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Enroll Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Why Choose TosRean?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We provide the best learning experience with cutting-edge technology and world-class instructors.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-3 bg-primary/10 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/80" />
              <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold">Ready to Start Learning?</h2>
                <p className="text-primary-foreground/90 text-lg">
                  Join thousands of students already learning on TosRean today. Get unlimited access to all courses.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="text-primary font-bold text-lg h-12 px-8">
                    Get Started for Free
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-lg h-12 px-8">
                    View Pricing
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">TosRean</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering learners worldwide with accessible, high-quality education.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Browse Courses</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Mentors</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">For Business</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} TosRean. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
