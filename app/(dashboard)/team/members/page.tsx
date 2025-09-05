import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  MoreHorizontal,
  UserPlus,
  Crown,
  Shield,
  User,
  MessageSquare,
  Edit,
  Trash2,
  Mail,
  Filter,
  Download,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

const teamMembers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Owner",
    department: "Leadership",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "JD",
    status: "online",
    joinDate: "Jan 2024",
    lastActive: "2 minutes ago",
    projectsCount: 8,
    tasksCompleted: 45,
    permissions: ["all"],
  },
  {
    id: 2,
    name: "Sarah Miller",
    email: "sarah@example.com",
    role: "Admin",
    department: "Design",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SM",
    status: "online",
    joinDate: "Feb 2024",
    lastActive: "5 minutes ago",
    projectsCount: 6,
    tasksCompleted: 38,
    permissions: ["projects", "team", "settings"],
  },
  {
    id: 3,
    name: "Alex Brown",
    email: "alex@example.com",
    role: "Member",
    department: "Development",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AB",
    status: "away",
    joinDate: "Mar 2024",
    lastActive: "1 hour ago",
    projectsCount: 4,
    tasksCompleted: 29,
    permissions: ["projects"],
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma@example.com",
    role: "Member",
    department: "Marketing",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "EW",
    status: "offline",
    joinDate: "Apr 2024",
    lastActive: "2 days ago",
    projectsCount: 3,
    tasksCompleted: 22,
    permissions: ["projects"],
  },
  {
    id: 5,
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "Member",
    department: "Marketing",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "MJ",
    status: "online",
    joinDate: "May 2024",
    lastActive: "10 minutes ago",
    projectsCount: 5,
    tasksCompleted: 31,
    permissions: ["projects"],
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

export default function TeamMembersPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/team">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Team
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Team Members</h1>
            <p className="text-muted-foreground">Manage team members, roles, and permissions</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription>Add an existing user to your team or send an invitation.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="member-email">Email Address</Label>
                  <Input id="member-email" type="email" placeholder="colleague@example.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="member-role">Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="member-department">Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="leadership">Leadership</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="welcome-message">Welcome Message (Optional)</Label>
                  <Textarea id="welcome-message" placeholder="Welcome to our team!" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add Member</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Search members..." className="pl-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="owner">Owner</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="member">Member</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="away">Away</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Team Members ({teamMembers.length})</CardTitle>
          <CardDescription>Complete list of team members with their roles and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member) => (
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
                    <Badge variant="secondary" className="text-xs">
                      {member.department}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>Joined {member.joinDate}</span>
                    <span>•</span>
                    <span>Last active {member.lastActive}</span>
                    <span>•</span>
                    <span>{member.projectsCount} projects</span>
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
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Role
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield className="mr-2 h-4 w-4" />
                        Manage Permissions
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
