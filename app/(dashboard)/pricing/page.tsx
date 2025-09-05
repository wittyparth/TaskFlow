"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Bell, CheckCircle2, Settings, LogOut, User, Check, Zap, Crown, Star, ArrowRight, X } from "lucide-react"

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      id: "free",
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      description: "Perfect for individuals getting started",
      features: [
        "Up to 3 projects",
        "Up to 3 team members",
        "5GB storage",
        "Basic support",
        "Standard templates",
        "Mobile app access",
      ],
      limitations: [
        "Limited integrations",
        "No advanced analytics",
        "Community support only",
        "Basic project templates",
      ],
      popular: false,
      icon: <User className="w-6 h-6" />,
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const,
    },
    {
      id: "pro",
      name: "Pro",
      price: { monthly: 29, yearly: 24 },
      description: "Best for growing teams and businesses",
      features: [
        "Up to 25 projects",
        "Up to 10 team members",
        "100GB storage",
        "Priority support",
        "Advanced analytics",
        "Custom templates",
        "API access",
        "All integrations",
        "Advanced permissions",
        "Time tracking",
        "Custom fields",
        "Automation rules",
      ],
      limitations: [],
      popular: true,
      icon: <Zap className="w-6 h-6" />,
      buttonText: "Start Pro Trial",
      buttonVariant: "default" as const,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: { monthly: 99, yearly: 79 },
      description: "For large organizations with advanced needs",
      features: [
        "Unlimited projects",
        "Unlimited team members",
        "1TB storage",
        "24/7 dedicated support",
        "Advanced security",
        "Custom integrations",
        "White-label options",
        "SLA guarantee",
        "Advanced permissions",
        "SSO integration",
        "Advanced reporting",
        "Custom workflows",
        "Dedicated account manager",
      ],
      limitations: [],
      popular: false,
      icon: <Crown className="w-6 h-6" />,
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
    },
  ]

  const faqs = [
    {
      question: "Can I change my plan at any time?",
      answer:
        "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing adjustments.",
    },
    {
      question: "What happens if I exceed my plan limits?",
      answer:
        "We'll notify you when you're approaching your limits. You can upgrade your plan or we'll help you manage your usage to stay within limits.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund.",
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! All paid plans come with a 14-day free trial. No credit card required to start your trial.",
    },
    {
      question: "Can I cancel my subscription?",
      answer:
        "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      company: "TechCorp",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "TaskFlow Pro has transformed how our team collaborates. The project management features are exactly what we needed.",
    },
    {
      name: "Mike Chen",
      role: "Startup Founder",
      company: "InnovateLab",
      avatar: "/placeholder.svg?height=40&width=40",
      content: "The free plan was perfect for getting started, and upgrading to Pro was seamless as we grew our team.",
    },
    {
      name: "Emily Rodriguez",
      role: "Team Lead",
      company: "DesignStudio",
      avatar: "/placeholder.svg?height=40&width=40",
      content:
        "The analytics and reporting features in the Pro plan have given us incredible insights into our productivity.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4">
            <Star className="w-3 h-3 mr-1" />
            14-day free trial
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Choose the perfect plan for your
            <span className="text-primary"> team</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include our core features with no hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm ${!isYearly ? "font-medium text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <Switch checked={isYearly} onCheckedChange={setIsYearly} />
            <span className={`text-sm ${isYearly ? "font-medium text-foreground" : "text-muted-foreground"}`}>
              Yearly
            </span>
            <Badge variant="secondary" className="text-xs">
              Save 20%
            </Badge>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="pt-4">
                    <span className="text-5xl font-bold">${isYearly ? plan.price.yearly : plan.price.monthly}</span>
                    <span className="text-muted-foreground">/{isYearly ? "month" : "month"}</span>
                    {isYearly && plan.price.yearly > 0 && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Billed annually (${plan.price.yearly * 12}/year)
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Button className="w-full" variant={plan.buttonVariant}>
                    {plan.buttonText}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">What's included:</h4>
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.limitations.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-border">
                      <h4 className="font-medium text-sm text-muted-foreground">Limitations:</h4>
                      {plan.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <X className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Trusted by teams worldwide</h2>
            <p className="text-xl text-muted-foreground">See what our customers have to say about TaskFlow Pro</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                      <AvatarFallback>
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">Everything you need to know about our pricing and plans</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to get started?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of teams already using TaskFlow Pro to manage their projects better.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Start Free Trial
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">TaskFlow Pro</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Support
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2024 TaskFlow Pro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
