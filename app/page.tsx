"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Users,
  BarChart3,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Clock,
  Globe,
  Award,
  TrendingUp,
} from "lucide-react"

export default function LandingPage() {
  const [email, setEmail] = useState("")

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">TaskFlow Pro</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto text-center max-w-5xl">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Star className="w-3 h-3 mr-2" />
            Trusted by 10,000+ teams worldwide
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 text-balance leading-tight">
            Project Management
            <span className="text-primary block md:inline"> Reimagined</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 text-pretty max-w-3xl mx-auto leading-relaxed">
            Transform your team's productivity with TaskFlow Pro's intelligent project management platform. Streamline
            workflows, enhance collaboration, and deliver exceptional results faster than ever.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <div className="flex w-full sm:w-auto max-w-md">
              <Input
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-r-none h-12 text-base"
              />
              <Button className="rounded-l-none h-12 px-6" asChild>
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            <Button variant="outline" size="lg" className="h-12 px-8 bg-transparent" asChild>
              <Link href="/dashboard">
                <Zap className="w-4 h-4 mr-2" />
                View Live Demo
              </Link>
            </Button>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              Free 14-day trial
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Setup in 2 minutes
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4">
              <Zap className="w-3 h-3 mr-2" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Everything you need to manage projects like a pro
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              From planning to execution, TaskFlow Pro provides all the tools your team needs to succeed in today's
              fast-paced environment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Smart Task Management</CardTitle>
                <CardDescription className="text-base">
                  AI-powered task prioritization with intuitive kanban boards, list views, and automated workflows.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Real-time Collaboration</CardTitle>
                <CardDescription className="text-base">
                  Seamless team communication with live comments, mentions, file sharing, and video calls integration.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Advanced Analytics</CardTitle>
                <CardDescription className="text-base">
                  Comprehensive insights with custom dashboards, performance metrics, and predictive analytics.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Global Accessibility</CardTitle>
                <CardDescription className="text-base">
                  Work from anywhere with offline sync, mobile apps, and multi-language support for global teams.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Enterprise Security</CardTitle>
                <CardDescription className="text-base">
                  Bank-level encryption, SSO integration, compliance certifications, and granular permissions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Performance Optimization</CardTitle>
                <CardDescription className="text-base">
                  Automated bottleneck detection, resource optimization, and intelligent workload distribution.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime Guarantee</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">10k+</div>
              <div className="text-muted-foreground">Active Teams</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50M+</div>
              <div className="text-muted-foreground">Tasks Completed</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">150+</div>
              <div className="text-muted-foreground">Integrations</div>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Award className="w-3 h-3 mr-2" />
              Customer Success
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Loved by teams worldwide</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how TaskFlow Pro has transformed project management for companies of all sizes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-bold text-primary">SH</span>
                  </div>
                  <div>
                    <div className="font-semibold">Sarah Johnson</div>
                    <div className="text-sm text-muted-foreground">Product Manager, TechCorp</div>
                  </div>
                </div>
                <CardDescription className="text-base">
                  "TaskFlow Pro revolutionized our project delivery. We've reduced project completion time by 40% and
                  improved team satisfaction significantly."
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-bold text-primary">MR</span>
                  </div>
                  <div>
                    <div className="font-semibold">Michael Rodriguez</div>
                    <div className="text-sm text-muted-foreground">CTO, StartupXYZ</div>
                  </div>
                </div>
                <CardDescription className="text-base">
                  "The analytics dashboard gives us insights we never had before. We can predict bottlenecks and
                  optimize our workflow proactively."
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="font-bold text-primary">EW</span>
                  </div>
                  <div>
                    <div className="font-semibold">Emily Watson</div>
                    <div className="text-sm text-muted-foreground">Operations Director, GlobalCorp</div>
                  </div>
                </div>
                <CardDescription className="text-base">
                  "Managing distributed teams across 12 countries has never been easier. TaskFlow Pro keeps everyone
                  aligned and productive."
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <CheckCircle className="w-3 h-3 mr-2" />
              Simple Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Choose the plan that fits your team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Start with our free plan and scale as you grow. All paid plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="border-border relative">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
                <CardTitle className="text-2xl">Free</CardTitle>
                <CardDescription>Perfect for individuals getting started</CardDescription>
                <div className="text-4xl font-bold text-foreground mt-4">
                  $0
                  <span className="text-lg font-normal text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Up to 3 projects</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Up to 3 team members</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">5GB storage</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Basic support</span>
                  </div>
                </div>
                <Button className="w-full mt-6" variant="outline" asChild>
                  <Link href="/signup">Get Started Free</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-primary relative transform scale-105">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <CardDescription>Best for growing teams and businesses</CardDescription>
                <div className="text-4xl font-bold text-foreground mt-4">
                  $29
                  <span className="text-lg font-normal text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground">$24/month billed yearly</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Up to 25 projects</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Up to 10 team members</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">100GB storage</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Advanced analytics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Priority support</span>
                  </div>
                </div>
                <Button className="w-full mt-6" asChild>
                  <Link href="/signup">Start Pro Trial</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-border relative">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-muted-foreground" />
                </div>
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <CardDescription>For large organizations with advanced needs</CardDescription>
                <div className="text-4xl font-bold text-foreground mt-4">
                  $99
                  <span className="text-lg font-normal text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground">$79/month billed yearly</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Unlimited projects</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Unlimited team members</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">1TB storage</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">24/7 dedicated support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Advanced security</span>
                  </div>
                </div>
                <Button className="w-full mt-6" variant="outline" asChild>
                  <Link href="/pricing">Contact Sales</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Want to see all features and compare plans in detail?
            </p>
            <Button variant="outline" asChild>
              <Link href="/pricing">
                View Full Pricing Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to transform your team's productivity?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
            Join thousands of teams who've already made the switch to TaskFlow Pro. 
            Start your free trial today and see the difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="secondary" className="h-12 px-8" asChild>
              <Link href="/signup">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link href="/signin">
                Sign In
              </Link>
            </Button>
          </div>
          <p className="text-sm text-primary-foreground/70 mt-6">
            Free 14-day trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">TaskFlow Pro</span>
              </div>
              <p className="text-muted-foreground">
                The modern project management platform that helps teams deliver exceptional results.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <div className="space-y-2 text-sm">
                <Link href="/dashboard" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
                <Link href="/projects" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Projects
                </Link>
                <Link href="/team" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Team
                </Link>
                <Link href="/analytics" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Analytics
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                  API Docs
                </a>
                <Link href="/pricing" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
                <Link href="/settings" className="block text-muted-foreground hover:text-foreground transition-colors">
                  Settings
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border">
            <div className="flex space-x-6 text-sm text-muted-foreground mb-4 md:mb-0">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Cookie Policy
              </a>
            </div>
            <div className="text-sm text-muted-foreground">© 2024 TaskFlow Pro. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
