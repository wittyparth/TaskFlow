"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  Search,
  Plus,
  MoreHorizontal,
  Calendar,
  Users,
  CheckCircle2,
  TrendingUp,
  Activity,
  Settings,
  LogOut,
  User,
  Grid3X3,
  List,
  Filter,
  SortAsc,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      description: "Complete overhaul of company website with modern design and improved UX",
      progress: 75,
      status: "In Progress",
      priority: "High",
      dueDate: "Dec 15, 2024",
      createdDate: "Nov 1, 2024",
      team: [
        { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
        { name: "Sarah Miller", avatar: "/placeholder.svg?height=32&width=32", initials: "SM" },
        { name: "Alex Brown", avatar: "/placeholder.svg?height=32&width=32", initials: "AB" },
      ],
      tasks: { completed: 12, total: 16 },
      category: "Design",
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "iOS and Android app for customer portal with real-time notifications",
      progress: 45,
      status: "In Progress",
      priority: "High",
      dueDate: "Jan 30, 2025",
      createdDate: "Oct 15, 2024",
      team: [
        { name: "Robert Kim", avatar: "/placeholder.svg?height=32&width=32", initials: "RK" },
        { name: "Lisa Martinez", avatar: "/placeholder.svg?height=32&width=32", initials: "LM" },
        { name: "Tom Smith", avatar: "/placeholder.svg?height=32&width=32", initials: "TS" },
      ],
      tasks: { completed: 9, total: 20 },
      category: "Development",
    },
    {
      id: 3,
      name: "Marketing Campaign",
      description: "Q1 2025 product launch campaign with multi-channel approach",
      progress: 20,
      status: "Planning",
      priority: "Medium",
      dueDate: "Mar 1, 2025",
      createdDate: "Dec 1, 2024",
      team: [
        { name: "Emma Wilson", avatar: "/placeholder.svg?height=32&width=32", initials: "EW" },
        { name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32", initials: "MJ" },
      ],
      tasks: { completed: 3, total: 15 },
      category: "Marketing",
    },
    {
      id: 4,
      name: "Database Migration",
      description: "Migrate legacy database to new cloud infrastructure",
      progress: 90,
      status: "Review",
      priority: "High",
      dueDate: "Dec 20, 2024",
      createdDate: "Nov 10, 2024",
      team: [
        { name: "David Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "DC" },
        { name: "Anna Rodriguez", avatar: "/placeholder.svg?height=32&width=32", initials: "AR" },
      ],
      tasks: { completed: 18, total: 20 },
      category: "Development",
    },
    {
      id: 5,
      name: "User Research Study",
      description: "Comprehensive user research for product improvement insights",
      progress: 60,
      status: "In Progress",
      priority: "Medium",
      dueDate: "Jan 15, 2025",
      createdDate: "Nov 20, 2024",
      team: [{ name: "Sophie Taylor", avatar: "/placeholder.svg?height=32&width=32", initials: "ST" }],
      tasks: { completed: 6, total: 10 },
      category: "Research",
    },
    {
      id: 6,
      name: "Security Audit",
      description: "Complete security assessment and vulnerability testing",
      progress: 30,
      status: "In Progress",
      priority: "High",
      dueDate: "Feb 10, 2025",
      createdDate: "Dec 5, 2024",
      team: [
        { name: "James Wilson", avatar: "/placeholder.svg?height=32&width=32", initials: "JW" },
        { name: "Maria Garcia", avatar: "/placeholder.svg?height=32&width=32", initials: "MG" },
      ],
      tasks: { completed: 4, total: 12 },
      category: "Security",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "default"
      case "Planning":
        return "secondary"
      case "Review":
        return "outline"
      case "Completed":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      {/* <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">TaskFlow Pro</span>
            </div>
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Set up a new project to start organizing your tasks and collaborating with your team.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input id="project-name" placeholder="Enter project name" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="project-description">Description</Label>
                    <Textarea id="project-description" placeholder="Describe your project" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="research">Research</SelectItem>
                          <SelectItem value="security">Security</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="due-date">Due Date</Label>
                    <Input id="due-date" type="date" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => setIsCreateDialogOpen(false)}>
                    Create Project
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header> */}

      <div className="flex">
        {/* Sidebar */}
        {/* <aside className="w-64 border-r border-border bg-muted/30 min-h-[calc(100vh-4rem)]">
          <div className="p-6">
            <nav className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <Activity className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Projects
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Calendar
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Team
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </nav>
          </div>
        </aside> */}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Projects</h1>
                <p className="text-muted-foreground">Manage and track all your projects in one place</p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <SortAsc className="w-4 h-4 mr-2" />
                  Sort
                </Button>
                <div className="flex border border-border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Projects Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {project.category}
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Project
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(project.status)}>{project.status}</Badge>
                        <Badge variant={getPriorityColor(project.priority)}>{project.priority}</Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {project.tasks.completed}/{project.tasks.total} tasks
                        </span>
                        <span className="text-muted-foreground">Due: {project.dueDate}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {project.team.slice(0, 3).map((member, index) => (
                            <Avatar key={index} className="h-6 w-6 border-2 border-background">
                              <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                              <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                            </Avatar>
                          ))}
                          {project.team.length > 3 && (
                            <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">+{project.team.length - 3}</span>
                            </div>
                          )}
                        </div>
                        <Button size="sm" variant="outline">
                          View Project
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>All Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <h3 className="font-semibold text-foreground">{project.name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {project.category}
                              </Badge>
                              <Badge variant={getStatusColor(project.status)}>{project.status}</Badge>
                              <Badge variant={getPriorityColor(project.priority)}>{project.priority}</Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">Due: {project.dueDate}</span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Project
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex -space-x-2">
                                {project.team.slice(0, 3).map((member, index) => (
                                  <Avatar key={index} className="h-6 w-6 border-2 border-background">
                                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                                    <AvatarFallback className="text-xs">{member.initials}</AvatarFallback>
                                  </Avatar>
                                ))}
                                {project.team.length > 3 && (
                                  <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                    <span className="text-xs text-muted-foreground">+{project.team.length - 3}</span>
                                  </div>
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {project.tasks.completed}/{project.tasks.total} tasks
                              </span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <Progress value={project.progress} className="h-2 w-24" />
                                <span className="text-sm font-medium">{project.progress}%</span>
                              </div>
                              <Button size="sm" variant="outline">
                                View Project
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
