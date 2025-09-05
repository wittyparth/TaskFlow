"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Bell, Search, CheckCircle2, Settings, LogOut, User, Star, Zap, Crown } from "lucide-react"

export default function BillingPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("pro")

  const currentPlan = {
    name: "Pro",
    price: 29,
    billing: "monthly",
    nextBilling: "Jan 15, 2025",
    status: "active",
  }

  const usage = {
    projects: { current: 8, limit: 25 },
    teamMembers: { current: 5, limit: 10 },
    storage: { current: 2.4, limit: 100 }, // GB
    apiCalls: { current: 1250, limit: 5000 },
  }

  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      billing: "forever",
      description: "Perfect for individuals getting started",
      features: ["Up to 3 projects", "Up to 3 team members", "5GB storage", "Basic support", "Standard templates"],
      limitations: ["Limited integrations", "No advanced analytics", "Community support only"],
      popular: false,
      current: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: 29,
      billing: "per month",
      description: "Best for growing teams and businesses",
      features: [
        "Up to 25 projects",
        "Up to 10 team members",
        "100GB storage",
        "Priority support",
        "Advanced analytics",
        "Custom templates",
        "API access",
        "Integrations",
      ],
      limitations: [],
      popular: true,
      current: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 99,
      billing: "per month",
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
      ],
      limitations: [],
      popular: false,
      current: false,
    },
  ]

  const invoices = [
    {
      id: "INV-2024-001",
      date: "Dec 15, 2024",
      amount: 29.0,
      status: "paid",
      plan: "Pro Monthly",
      downloadUrl: "#",
    },
    {
      id: "INV-2024-002",
      date: "Nov 15, 2024",
      amount: 29.0,
      status: "paid",
      plan: "Pro Monthly",
      downloadUrl: "#",
    },
    {
      id: "INV-2024-003",
      date: "Oct 15, 2024",
      amount: 29.0,
      status: "paid",
      plan: "Pro Monthly",
      downloadUrl: "#",
    },
    {
      id: "INV-2024-004",
      date: "Sep 15, 2024",
      amount: 29.0,
      status: "paid",
      plan: "Pro Monthly",
      downloadUrl: "#",
    },
  ]

  const paymentMethods = [
    {
      id: 1,
      type: "card",
      brand: "Visa",
      last4: "4242",
      expiryMonth: 12,
      expiryYear: 2027,
      isDefault: true,
    },
    {
      id: 2,
      type: "card",
      brand: "Mastercard",
      last4: "8888",
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
    },
  ]

  // Added usage alerts and overage warnings
  const usageAlerts = [
    {
      type: "warning",
      message: "You're approaching your team member limit (5/10 used)",
      action: "Add more members or upgrade plan",
    },
  ]

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-destructive"
    if (percentage >= 75) return "text-yellow-600"
    return "text-primary"
  }

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case "free":
        return <User className="w-5 h-5" />
      case "pro":
        return <Zap className="w-5 h-5" />
      case "enterprise":
        return <Crown className="w-5 h-5" />
      default:
        return <User className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Billing & Subscription</h1>
              <p className="text-muted-foreground mt-1">Manage your subscription, usage, and billing information</p>
            </div>
            <Button onClick={() => setIsUpgradeDialogOpen(true)}>
              <Star className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          </div>

          {/* Usage Alerts */}
          {usageAlerts.length > 0 && (
            <div className="space-y-2">
              {usageAlerts.map((alert, index) => (
                <div key={index} className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-yellow-800">{alert.message}</p>
                    <Button variant="outline" size="sm">
                      {alert.action}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Current Plan */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div className="p-6 border border-border rounded-lg bg-card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Current Plan</h2>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <span className="font-medium">{currentPlan.name}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-medium">
                      ${currentPlan.price}/{currentPlan.billing}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next billing</span>
                    <span className="font-medium">{currentPlan.nextBilling}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {currentPlan.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Usage Overview */}
              <div className="p-6 border border-border rounded-lg bg-card">
                <h2 className="text-xl font-semibold mb-4">Usage Overview</h2>
                <div className="space-y-4">
                  {Object.entries(usage).map(([key, value]) => {
                    const percentage = getUsagePercentage(value.current, value.limit)
                    const colorClass = getUsageColor(percentage)

                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                          <span className={colorClass}>
                            {key === "storage"
                              ? `${value.current}GB / ${value.limit}GB`
                              : `${value.current} / ${value.limit}`}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              percentage >= 90 ? "bg-destructive" : percentage >= 75 ? "bg-yellow-500" : "bg-primary"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-6">
              <div className="p-6 border border-border rounded-lg bg-card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Payment Methods</h2>
                  <Button variant="outline" size="sm">
                    Add Method
                  </Button>
                </div>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                          <span className="text-xs font-medium">{method.brand.slice(0, 2)}</span>
                        </div>
                        <div>
                          <p className="font-medium">•••• •••• •••• {method.last4}</p>
                          <p className="text-sm text-muted-foreground">
                            Expires {method.expiryMonth}/{method.expiryYear}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {method.isDefault && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Default</span>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              •••
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Set as default</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing History */}
              <div className="p-6 border border-border rounded-lg bg-card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Billing History</h2>
                  <Button variant="outline" size="sm">
                    Download All
                  </Button>
                </div>
                <div className="space-y-3">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{invoice.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {invoice.date} • {invoice.plan}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">${invoice.amount.toFixed(2)}</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {invoice.status}
                        </span>
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
