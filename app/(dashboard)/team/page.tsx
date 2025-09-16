"use client"

import { SubscriptionGate } from "@/components/feature-gates/subscription-gate"
import { KillSwitch } from "@/components/feature-gates/kill-switch"
import { useAuth } from "@/hooks/use-auth"

import {
  Bell,
  MoreHorizontal,
  Users,
  CheckCircle2,
  TrendingUp,
  Activity,
  Settings,
  User,
  Mail,
  Shield,
  Clock,
  MessageSquare,
  Crown,
  Edit,
  Trash2,
  Lock,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SubscriptionGate } from "@/components/feature-gates/subscription-gate"
import { KillSwitch } from "@/components/feature-gates/kill-switch"

import {
  Bell,
  MoreHorizontal,
  Users,
  CheckCircle2,
  TrendingUp,
  Activity,
  Settings,
  User,
  Mail,
  Shield,
  Clock,
  MessageSquare,
  Crown,
  Edit,
  Trash2,
  Lock,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("members")
  const router = useRouter();

  const teamMembers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Owner",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JD",
      status: "online",
      joinDate: "Jan 2024",
      lastActive: "2 minutes ago",
      projectsCount: 8,
      tasksCompleted: 45,
    },
    {
      id: 2,
      name: "Sarah Miller",
      email: "sarah@example.com",
      role: "Admin",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SM",
      status: "online",
      joinDate: "Feb 2024",
      lastActive: "5 minutes ago",
      projectsCount: 6,
      tasksCompleted: 38,
    },
    {
      id: 3,
      name: "Alex Brown",
      email: "alex@example.com",
      role: "Member",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AB",
      status: "away",
      joinDate: "Mar 2024",
      lastActive: "1 hour ago",
      projectsCount: 4,
      tasksCompleted: 29,
    },
    {
      id: 4,
      name: "Emma Wilson",
      email: "emma@example.com",
      role: "Member",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "EW",
      status: "offline",
      joinDate: "Apr 2024",
      lastActive: "2 days ago",
      projectsCount: 3,
      tasksCompleted: 22,
    },
    {
      id: 5,
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "Member",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MJ",
      status: "online",
      joinDate: "May 2024",
      lastActive: "10 minutes ago",
      projectsCount: 5,
      tasksCompleted: 31,
    },
  ]

  const pendingInvitations = [
    {
      id: 1,
      email: "david@example.com",
      role: "Member",
      invitedBy: "John Doe",
      inviteDate: "Dec 8, 2024",
      status: "pending",
    },
    {
      id: 2,
      email: "lisa@example.com",
      role: "Admin",
      invitedBy: "Sarah Miller",
      inviteDate: "Dec 7, 2024",
      status: "pending",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      user: "Sarah Miller",
      action: "completed task",
      target: "Homepage wireframes",
      time: "2 hours ago",
      avatar: "/placeholder.svg?height=32&width=32",
      project: "Website Redesign",
    },
    {
      id: 2,
      user: "Alex Brown",
      action: "commented on",
      target: "Mobile App Development",
      time: "4 hours ago",
      avatar: "/placeholder.svg?height=32&width=32",
      project: "Mobile App Development",
    },
    {
      id: 3,
      user: "Mike Johnson",
      action: "uploaded file to",
      target: "Marketing Campaign",
      time: "6 hours ago",
      avatar: "/placeholder.svg?height=32&width=32",
      project: "Marketing Campaign",
    },
    {
      id: 4,
      user: "Emma Wilson",
      action: "created new task",
      target: "User Research Study",
      time: "1 day ago",
      avatar: "/placeholder.svg?height=32&width=32",
      project: "User Research Study",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Owner":
        return <Crown className="w-4 h-4 text-yellow-500" />
      case "Admin":
        return <Shield className="w-4 h-4 text-blue-500" />
      case "Member":
        return <User className="w-4 h-4 text-gray-500" />
      default:
        return <User className="w-4 h-4 text-gray-500" />
    }
  }

  const filteredMembers = teamMembers.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  
  return (
    <SubscriptionGate 
      requiredTier="pro"
      fallback={
        <div className="container mx-auto py-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
              <p className="text-muted-foreground">
                Collaborate with your team and manage permissions
              </p>
            </div>
          </div>
          
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Lock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Team Features Unavailable</h3>
              <p className="text-muted-foreground text-center mb-4 max-w-md">
                Team management features are available for Pro and Enterprise users. 
                Upgrade your plan to invite team members and manage permissions.
              </p>
              <Button>
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>
        </div>
      }
    >
      <KillSwitch featureFlag="team-management" fallback={
        <div className="container mx-auto py-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-lg font-semibold mb-2">Team Features Temporarily Unavailable</h3>
              <p className="text-muted-foreground text-center">
                Team management is currently disabled. Please check back later.
              </p>
            </CardContent>
          </Card>
        </div>
      }>
        <TeamContent 
          teamMembers={teamMembers}
          filteredMembers={filteredMembers}
          pendingInvitations={pendingInvitations}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isInviteDialogOpen={isInviteDialogOpen}
          setIsInviteDialogOpen={setIsInviteDialogOpen}
        />
      </KillSwitch>
    </SubscriptionGate>
  )
}

function TeamContent({
  teamMembers,
  filteredMembers,
  pendingInvitations,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  isInviteDialogOpen,
  setIsInviteDialogOpen
}: {
  teamMembers: any[];
  filteredMembers: any[];
  pendingInvitations: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isInviteDialogOpen: boolean;
  setIsInviteDialogOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-background">

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Team</h1>
                <p className="text-muted-foreground">Manage your team members and collaboration settings</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-sm">
                  {teamMembers.length} members
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {pendingInvitations.length} pending
                </Badge>
              </div>
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card onClick={()=> router.push('/team/members')} className="cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teamMembers.length}</div>
                  <p className="text-xs text-muted-foreground">+2 this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Online Now</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {teamMembers.filter((member) => member.status === "online").length}
                  </div>
                  <p className="text-xs text-muted-foreground">Active members</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {teamMembers.reduce((sum, member) => sum + member.tasksCompleted, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Response</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.4h</div>
                  <p className="text-xs text-muted-foreground">Response time</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Team Management */}
              <div className="lg:col-span-2">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="members">Members</TabsTrigger>
                    <TabsTrigger value="invitations">Invitations</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </TabsList>

                  <TabsContent value="members" className="mt-6">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Team Members</CardTitle>
                            <CardDescription>Manage your team members and their permissions</CardDescription>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href="/team/members">View All Members</Link>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {filteredMembers.slice(0, 3).map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="relative">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                <AvatarFallback>{member.initials}</AvatarFallback>
                              </Avatar>
                              <div
                                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(member.status)}`}
                              />
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-foreground">{member.name}</h3>
                                {getRoleIcon(member.role)}
                                <Badge variant="outline" className="text-xs">
                                  {member.role}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{member.email}</p>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <span>Last active {member.lastActive}</span>
                                <span>•</span>
                                <span>{member.tasksCompleted} tasks completed</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Role
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send Message
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Remove Member
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="invitations" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Pending Invitations</CardTitle>
                        <CardDescription>Manage pending team invitations</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {pendingInvitations.map((invitation) => (
                          <div
                            key={invitation.id}
                            className="flex items-center space-x-4 p-4 border border-border rounded-lg"
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {invitation.email.split("@")[0].slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-foreground">{invitation.email}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {invitation.role}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {invitation.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Invited by {invitation.invitedBy} on {invitation.inviteDate}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                Resend
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ))}
                        {pendingInvitations.length === 0 && (
                          <div className="text-center py-8">
                            <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No pending invitations</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="settings" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Team Settings</CardTitle>
                        <CardDescription>Configure team workspace and collaboration settings</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button className="w-full justify-start" variant="ghost" asChild>
                          <Link href="/team/permissions">
                            <Shield className="mr-2 h-4 w-4" />
                            Manage Permissions & Roles
                          </Link>
                        </Button>
                        <Button className="w-full justify-start" variant="ghost" asChild>
                          <Link href="/settings">
                            <Settings className="mr-2 h-4 w-4" />
                            Workspace Settings
                          </Link>
                        </Button>
                        <Button className="w-full justify-start" variant="ghost">
                          <Bell className="mr-2 h-4 w-4" />
                          Notification Preferences
                        </Button>
                        <Button className="w-full justify-start" variant="ghost" asChild>
                          <Link href="/analytics">
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Team Analytics
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Activity Feed */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Team Activity</CardTitle>
                    <CardDescription>Recent team member activities</CardDescription>
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
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>{activity.project}</span>
                            <span>•</span>
                            <span>{activity.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
  )
}
