"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Users, Calendar, BarChart3, Download } from "lucide-react"
import Link from "next/link"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
} from "recharts"

const usageData = [
  { month: "Jul", projects: 5, members: 3, storage: 1.2, apiCalls: 850 },
  { month: "Aug", projects: 6, members: 4, storage: 1.8, apiCalls: 1200 },
  { month: "Sep", projects: 7, members: 4, storage: 2.1, apiCalls: 1450 },
  { month: "Oct", projects: 8, members: 5, storage: 2.4, apiCalls: 1650 },
  { month: "Nov", projects: 8, members: 5, storage: 2.6, apiCalls: 1800 },
  { month: "Dec", projects: 8, members: 5, storage: 2.4, apiCalls: 1250 },
]

const billingData = [
  { month: "Jul", amount: 29, plan: "Pro" },
  { month: "Aug", amount: 29, plan: "Pro" },
  { month: "Sep", amount: 29, plan: "Pro" },
  { month: "Oct", amount: 29, plan: "Pro" },
  { month: "Nov", amount: 29, plan: "Pro" },
  { month: "Dec", amount: 29, plan: "Pro" },
]

const featureUsage = [
  { name: "Projects", value: 32, color: "#3b82f6" },
  { name: "Tasks", value: 28, color: "#10b981" },
  { name: "Team Collaboration", value: 25, color: "#f59e0b" },
  { name: "Analytics", value: 15, color: "#ef4444" },
]

export default function BillingAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months")

  const stats = [
    {
      title: "Total Spent",
      value: "$348",
      change: "+$29",
      changeType: "increase" as const,
      icon: DollarSign,
    },
    {
      title: "Avg Monthly Cost",
      value: "$29",
      change: "No change",
      changeType: "neutral" as const,
      icon: Calendar,
    },
    {
      title: "Cost per User",
      value: "$5.80",
      change: "-$1.20",
      changeType: "decrease" as const,
      icon: Users,
    },
    {
      title: "Usage Efficiency",
      value: "78%",
      change: "+5%",
      changeType: "increase" as const,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/billing">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Billing
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Billing Analytics</h1>
            <p className="text-muted-foreground">Track your usage patterns and billing trends</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {stat.changeType === "increase" && <TrendingUp className="w-3 h-3 text-green-600" />}
                      {stat.changeType === "decrease" && <TrendingDown className="w-3 h-3 text-red-600" />}
                      <span
                        className={`text-xs ${
                          stat.changeType === "increase"
                            ? "text-green-600"
                            : stat.changeType === "decrease"
                              ? "text-red-600"
                              : "text-muted-foreground"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <Tabs defaultValue="usage" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="usage">Usage Trends</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
          <TabsTrigger value="features">Feature Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Projects & Team Growth</CardTitle>
                <CardDescription>Track your project and team member usage over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="projects" stroke="#3b82f6" strokeWidth={2} name="Projects" />
                    <Line type="monotone" dataKey="members" stroke="#10b981" strokeWidth={2} name="Team Members" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Storage & API Usage</CardTitle>
                <CardDescription>Monitor your storage and API call consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={usageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="storage"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      name="Storage (GB)"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="apiCalls"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="API Calls"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Usage Limits Overview</CardTitle>
              <CardDescription>Current usage compared to plan limits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">8/25</div>
                  <div className="text-sm text-muted-foreground">Projects</div>
                  <div className="text-xs text-green-600">32% used</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">5/10</div>
                  <div className="text-sm text-muted-foreground">Team Members</div>
                  <div className="text-xs text-green-600">50% used</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">2.4/100</div>
                  <div className="text-sm text-muted-foreground">Storage (GB)</div>
                  <div className="text-xs text-green-600">2.4% used</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1.25k/5k</div>
                  <div className="text-sm text-muted-foreground">API Calls</div>
                  <div className="text-xs text-green-600">25% used</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Your monthly billing amounts and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={billingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">$348</div>
                  <div className="text-sm text-muted-foreground">Total Spent</div>
                  <div className="text-xs text-green-600 mt-1">12 months</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">$29</div>
                  <div className="text-sm text-muted-foreground">Average Monthly</div>
                  <div className="text-xs text-muted-foreground mt-1">Consistent billing</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">Payment Success</div>
                  <div className="text-xs text-green-600 mt-1">No failed payments</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Usage Distribution</CardTitle>
                <CardDescription>How you use different features of TaskFlow Pro</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Tooltip />
                    <Pie
                      data={featureUsage}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {featureUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature Engagement</CardTitle>
                <CardDescription>Your most and least used features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {featureUsage.map((feature) => (
                  <div key={feature.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: feature.color }} />
                      <span className="text-sm font-medium">{feature.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{feature.value}%</span>
                      <Badge variant="secondary" className="text-xs">
                        {feature.value > 25 ? "High" : feature.value > 15 ? "Medium" : "Low"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Usage Recommendations</CardTitle>
              <CardDescription>Optimize your plan based on usage patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800">Efficient Usage</h4>
                    <p className="text-sm text-green-700">
                      You're using 78% of your plan efficiently. Your current Pro plan is well-suited for your needs.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <BarChart3 className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Growth Opportunity</h4>
                    <p className="text-sm text-blue-700">
                      Consider exploring analytics features more - you're only using 15% of available insights.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
