"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Bell,
  CheckCircle2,
  Settings,
  LogOut,
  User,
  Clock,
  AlertTriangle,
  Info,
  CheckCircle,
  X,
  MoreHorizontal,
  Filter,
  KanbanSquareDashed as MarkAsUnread,
} from "lucide-react"

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all")

  const notifications = [
    {
      id: 1,
      type: "task_assigned",
      title: "New task assigned: Design homepage mockups",
      description: "Sarah Miller assigned you a task in Website Redesign project",
      time: "5 minutes ago",
      read: false,
      priority: "high",
      avatar: "/placeholder.svg?height=32&width=32",
      project: "Website Redesign",
    },
    {
      id: 2,
      type: "deadline_approaching",
      title: "Deadline approaching: Mobile app wireframes",
      description: "Task due in 2 hours",
      time: "1 hour ago",
      read: false,
      priority: "urgent",
      project: "Mobile App Development",
    },
    {
      id: 3,
      type: "project_update",
      title: "Project status updated",
      description: "Website Redesign moved to In Progress",
      time: "3 hours ago",
      read: true,
      priority: "normal",
      project: "Website Redesign",
    },
    {
      id: 4,
      type: "comment_mention",
      title: "You were mentioned in a comment",
      description: "Alex Brown mentioned you in Database Migration project",
      time: "5 hours ago",
      read: true,
      priority: "normal",
      avatar: "/placeholder.svg?height=32&width=32",
      project: "Database Migration",
    },
    {
      id: 5,
      type: "team_invite",
      title: "New team member joined",
      description: "Emma Wilson joined your team",
      time: "1 day ago",
      read: true,
      priority: "low",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]

  const notificationSettings = {
    email: {
      task_assigned: true,
      deadline_approaching: true,
      project_updates: false,
      comments_mentions: true,
      team_changes: false,
    },
    push: {
      task_assigned: true,
      deadline_approaching: true,
      project_updates: true,
      comments_mentions: true,
      team_changes: true,
    },
    in_app: {
      task_assigned: true,
      deadline_approaching: true,
      project_updates: true,
      comments_mentions: true,
      team_changes: true,
    },
  }

  const getNotificationIcon = (type: string, priority: string) => {
    if (priority === "urgent") {
      return <AlertTriangle className="w-4 h-4 text-red-500" />
    }

    switch (type) {
      case "task_assigned":
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />
      case "deadline_approaching":
        return <Clock className="w-4 h-4 text-orange-500" />
      case "project_update":
        return <Info className="w-4 h-4 text-green-500" />
      case "comment_mention":
        return <Bell className="w-4 h-4 text-purple-500" />
      case "team_invite":
        return <User className="w-4 h-4 text-indigo-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-l-red-500"
      case "high":
        return "border-l-orange-500"
      case "normal":
        return "border-l-blue-500"
      case "low":
        return "border-l-gray-300"
      default:
        return "border-l-gray-300"
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read
    if (filter === "urgent") return notification.priority === "urgent"
    if (filter === "mentions") return notification.type === "comment_mention"
    return true
  })

  return (
    <div className="min-h-screen bg-background">

        {/* Main Content */}
        <main className="flex-1">
          <Tabs defaultValue="notifications" className="h-full">
            <div className="border-b border-border">
              <div className="flex items-center justify-between px-6 py-4">
                <TabsList>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark All Read
                  </Button>
                </div>
              </div>
            </div>

            <TabsContent value="notifications" className="p-6 space-y-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
                    <p className="text-muted-foreground">{filteredNotifications.length} notifications</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {filteredNotifications.map((notification) => (
                    <Card
                      key={notification.id}
                      className={`transition-all hover:shadow-md border-l-4 ${getPriorityColor(notification.priority)} ${
                        !notification.read ? "bg-muted/30" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 mt-1">
                            {notification.avatar ? (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={notification.avatar || "/placeholder.svg"} alt="User" />
                                <AvatarFallback>{notification.title.split(" ")[0].charAt(0)}</AvatarFallback>
                              </Avatar>
                            ) : (
                              getNotificationIcon(notification.type, notification.priority)
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center space-x-2">
                              <h3
                                className={`text-sm font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}
                              >
                                {notification.title}
                              </h3>
                              {!notification.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{notification.time}</span>
                              </span>
                              {notification.project && <span>Project: {notification.project}</span>}
                              <Badge variant="outline" className="text-xs">
                                {notification.priority}
                              </Badge>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark as Read
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MarkAsUnread className="mr-2 h-4 w-4" />
                                Mark as Unread
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <X className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Notification Settings</h1>
                  <p className="text-muted-foreground">Configure how and when you receive notifications</p>
                </div>

                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Email Notifications</CardTitle>
                      <CardDescription>Receive notifications via email</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(notificationSettings.email).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor={`email-${key}`} className="text-sm font-medium">
                              {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </Label>
                            <p className="text-xs text-muted-foreground">Get notified about {key.replace(/_/g, " ")}</p>
                          </div>
                          <Switch id={`email-${key}`} checked={value} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Push Notifications</CardTitle>
                      <CardDescription>Receive push notifications in your browser</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(notificationSettings.push).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor={`push-${key}`} className="text-sm font-medium">
                              {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </Label>
                            <p className="text-xs text-muted-foreground">Get notified about {key.replace(/_/g, " ")}</p>
                          </div>
                          <Switch id={`push-${key}`} checked={value} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>In-App Notifications</CardTitle>
                      <CardDescription>Show notifications within the application</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {Object.entries(notificationSettings.in_app).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor={`app-${key}`} className="text-sm font-medium">
                              {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                            </Label>
                            <p className="text-xs text-muted-foreground">Get notified about {key.replace(/_/g, " ")}</p>
                          </div>
                          <Switch id={`app-${key}`} checked={value} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
  )
}
