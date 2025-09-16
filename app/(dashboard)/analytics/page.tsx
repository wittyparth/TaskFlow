"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscriptionGate } from "@/components/feature-gates/subscription-gate";
import { KillSwitch } from "@/components/feature-gates/kill-switch";
import { useAuth } from "@/hooks/use-auth";

import {
  BarChart3,
  LucidePieChart as RechartsPieChart,
  Clock,
  Target,
  Zap,
  Filter,
  Lock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Pie,
} from "recharts";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { profile } = useAuth();

  // Check if user has access to analytics
  return (
    <SubscriptionGate 
      requiredTier="pro"
      fallback={
        <div className="container mx-auto py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
              <p className="text-muted-foreground">
                Get insights into your project performance and team productivity
              </p>
            </div>
          </div>
          
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Lock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Analytics Unavailable</h3>
              <p className="text-muted-foreground text-center mb-4 max-w-md">
                Advanced analytics are available for Pro and Enterprise users. 
                Upgrade your plan to unlock detailed insights and reporting.
              </p>
              <Button>
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>
        </div>
      }
    >
      <KillSwitch featureFlag="advanced-analytics" fallback={
        <div className="container mx-auto py-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-lg font-semibold mb-2">Analytics Temporarily Unavailable</h3>
              <p className="text-muted-foreground text-center">
                This feature is currently disabled. Please check back later.
              </p>
            </CardContent>
          </Card>
        </div>
      }>
        <AnalyticsContent activeTab={activeTab} setActiveTab={setActiveTab} />
      </KillSwitch>
    </SubscriptionGate>
  );
}

function AnalyticsContent({ 
  activeTab, 
  setActiveTab 
}: { 
  activeTab: string; 
  setActiveTab: (tab: string) => void;
}) {

  // Mock data for charts
  const projectCompletionData = [
    { month: "Jan", completed: 12, total: 15 },
    { month: "Feb", completed: 18, total: 22 },
    { month: "Mar", completed: 15, total: 18 },
    { month: "Apr", completed: 22, total: 25 },
    { month: "May", completed: 28, total: 30 },
    { month: "Jun", completed: 25, total: 28 },
  ];

  const taskActivityData = [
    { date: "Dec 1", created: 8, completed: 12 },
    { date: "Dec 2", created: 12, completed: 8 },
    { date: "Dec 3", created: 15, completed: 18 },
    { date: "Dec 4", created: 10, completed: 14 },
    { date: "Dec 5", created: 18, completed: 16 },
    { date: "Dec 6", created: 14, completed: 20 },
    { date: "Dec 7", created: 16, completed: 15 },
  ];

  const teamProductivityData = [
    { name: "John Doe", tasks: 45, hours: 120 },
    { name: "Sarah Miller", tasks: 38, hours: 95 },
    { name: "Alex Brown", tasks: 29, hours: 85 },
    { name: "Emma Wilson", tasks: 22, hours: 70 },
    { name: "Mike Johnson", tasks: 31, hours: 88 },
  ];

  const projectStatusData = [
    { name: "Completed", value: 35, color: "#10b981" },
    { name: "In Progress", value: 45, color: "#3b82f6" },
    { name: "Planning", value: 15, color: "#f59e0b" },
    { name: "On Hold", value: 5, color: "#ef4444" },
  ];

  const timeTrackingData = [
    { category: "Development", hours: 120, percentage: 40 },
    { category: "Design", hours: 85, percentage: 28 },
    { category: "Meetings", hours: 45, percentage: 15 },
    { category: "Planning", hours: 30, percentage: 10 },
    { category: "Testing", hours: 20, percentage: 7 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
              <p className="text-muted-foreground">
                Track your team's productivity and project performance
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Projects
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  +3 from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Completion Rate
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">
                  +5% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Task Time
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4h</div>
                <p className="text-xs text-muted-foreground">
                  -0.3h from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Team Velocity
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">165</div>
                <p className="text-xs text-muted-foreground">tasks/month</p>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="time">Time Tracking</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Project Completion Trend</CardTitle>
                    <CardDescription>
                      Monthly project completion rates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={projectCompletionData}>
                        <XAxis
                          dataKey="month"
                          tickLine={false}
                          tickMargin={10}
                          axisLine={false}
                          tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis />
                        <Area
                          type="monotone"
                          dataKey="completed"
                          stackId="1"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="total"
                          stackId="2"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Project Status Distribution</CardTitle>
                    <CardDescription>
                      Current status of all projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={projectStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {projectStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Daily Task Activity</CardTitle>
                  <CardDescription>
                    Tasks created vs completed over the last week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={taskActivityData}>
                      <CartesianGrid />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      {/* <YAxis /> */}
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="created" fill="#3b82f6" name="Created" />
                      <Bar
                        dataKey="completed"
                        fill="#10b981"
                        name="Completed"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Performance</CardTitle>
                  <CardDescription>
                    Detailed breakdown of project metrics and completion rates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Website Redesign",
                        progress: 75,
                        tasks: "12/16",
                        status: "On Track",
                      },
                      {
                        name: "Mobile App Development",
                        progress: 45,
                        tasks: "9/20",
                        status: "Behind",
                      },
                      {
                        name: "Marketing Campaign",
                        progress: 20,
                        tasks: "3/15",
                        status: "Planning",
                      },
                      {
                        name: "Database Migration",
                        progress: 90,
                        tasks: "18/20",
                        status: "On Track",
                      },
                    ].map((project, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-4 border border-border rounded-lg"
                      >
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{project.name}</h4>
                            <Badge
                              variant={
                                project.status === "On Track"
                                  ? "default"
                                  : project.status === "Behind"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {project.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-muted-foreground">
                                  Progress
                                </span>
                                <span>{project.progress}%</span>
                              </div>
                              <Progress
                                value={project.progress}
                                className="h-2"
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {project.tasks} tasks
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Productivity</CardTitle>
                  <CardDescription>
                    Individual team member performance and task completion
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={teamProductivityData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar
                        dataKey="tasks"
                        fill="#10b981"
                        name="Tasks Completed"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Team Member Details</CardTitle>
                  <CardDescription>
                    Detailed breakdown of individual contributions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamProductivityData.map((member, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-4 border border-border rounded-lg"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium">{member.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{member.tasks} tasks completed</span>
                            <span>•</span>
                            <span>{member.hours} hours logged</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {((member.tasks / member.hours) * 10).toFixed(1)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            tasks/day
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Time Tracking Tab */}
            <TabsContent value="time" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Time Distribution</CardTitle>
                  <CardDescription>
                    How time is spent across different categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {timeTrackingData.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {category.category}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {category.hours}h ({category.percentage}%)
                          </span>
                        </div>
                        <Progress value={category.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Hours</CardTitle>
                    <CardDescription>
                      Total hours logged this week
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">42.5h</div>
                    <p className="text-sm text-muted-foreground">
                      +2.5h from last week
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Average Session</CardTitle>
                    <CardDescription>
                      Average work session length
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">2.8h</div>
                    <p className="text-sm text-muted-foreground">
                      Optimal range: 2-4h
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
