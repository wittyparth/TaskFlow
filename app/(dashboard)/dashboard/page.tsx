"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Calendar, Users, CheckCircle2, Clock, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      description: "Complete overhaul of company website",
      progress: 75,
      status: "In Progress",
      dueDate: "Dec 15, 2024",
      team: ["JD", "SM", "AB"],
      tasks: { completed: 12, total: 16 },
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "iOS and Android app for customer portal",
      progress: 45,
      status: "In Progress",
      dueDate: "Jan 30, 2025",
      team: ["RK", "LM", "TS"],
      tasks: { completed: 9, total: 20 },
    },
    {
      id: 3,
      name: "Marketing Campaign",
      description: "Q1 2025 product launch campaign",
      progress: 20,
      status: "Planning",
      dueDate: "Mar 1, 2025",
      team: ["EW", "MJ"],
      tasks: { completed: 3, total: 15 },
    },
  ]

  const recentActivity = [
    {
      id: 1,
      user: "John Doe",
      action: "completed task",
      target: "Homepage wireframes",
      time: "2 hours ago",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      user: "Sarah Miller",
      action: "commented on",
      target: "Mobile App Development",
      time: "4 hours ago",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 3,
      user: "Alex Brown",
      action: "uploaded file to",
      target: "Website Redesign",
      time: "6 hours ago",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back, John!</h1>
            <p className="text-muted-foreground">Here's what's happening with your projects today.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Today</p>
            <p className="text-lg font-semibold text-foreground">December 10, 2024</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">+12% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+3 new this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects Overview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Projects</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/projects">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">
                          <Link href={`/projects/${project.id}`} className="hover:text-primary transition-colors">
                            {project.name}
                          </Link>
                        </h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/projects/${project.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit Project</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>
                          {project.status}
                        </Badge>
                        <span className="text-muted-foreground">Due: {project.dueDate}</span>
                        <span className="text-muted-foreground">
                          {project.tasks.completed}/{project.tasks.total} tasks
                        </span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Team:</span>
                        <div className="flex -space-x-2">
                          {project.team.map((member, index) => (
                            <Avatar key={index} className="h-6 w-6 border-2 border-background">
                              <AvatarFallback className="text-xs">{member}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.user} />
                      <AvatarFallback>
                        {activity.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{" "}
                        <span className="text-muted-foreground">{activity.action}</span>{" "}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="ghost" asChild>
                  <Link href="/projects">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Project
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="ghost" asChild>
                  <Link href="/team">
                    <Users className="mr-2 h-4 w-4" />
                    Invite Team Member
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="ghost">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </Button>
                <Button className="w-full justify-start" variant="ghost" asChild>
                  <Link href="/analytics">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Analytics
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
