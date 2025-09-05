"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
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
  Plus,
  Calendar,
  CheckCircle2,
  Settings,
  LogOut,
  User,
  ArrowLeft,
  Edit,
  Share,
  Star,
  MessageSquare,
  Paperclip,
  Download,
  Upload,
  FileText,
  ImageIcon,
  Video,
  Archive,
  MoreHorizontal,
  Eye,
  Trash2,
} from "lucide-react"

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("board")
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)

  // Mock project data
  const project = {
    id: 1,
    name: "Website Redesign",
    description: "Complete overhaul of company website with modern design and improved UX",
    progress: 75,
    status: "In Progress",
    priority: "High",
    dueDate: "Dec 15, 2024",
    createdDate: "Nov 1, 2024",
    team: [
      { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD", role: "Project Manager" },
      { name: "Sarah Miller", avatar: "/placeholder.svg?height=32&width=32", initials: "SM", role: "Designer" },
      { name: "Alex Brown", avatar: "/placeholder.svg?height=32&width=32", initials: "AB", role: "Developer" },
    ],
    tasks: { completed: 12, total: 16 },
    category: "Design",
  }

  const taskColumns = [
    {
      id: "todo",
      title: "To Do",
      tasks: [
        {
          id: 1,
          title: "Create wireframes for homepage",
          description: "Design initial wireframes for the new homepage layout",
          assignee: { name: "Sarah Miller", initials: "SM" },
          priority: "High",
          dueDate: "Dec 12, 2024",
          comments: 3,
          attachments: 1,
        },
        {
          id: 2,
          title: "Set up development environment",
          description: "Configure local development setup for the project",
          assignee: { name: "Alex Brown", initials: "AB" },
          priority: "Medium",
          dueDate: "Dec 10, 2024",
          comments: 1,
          attachments: 0,
        },
      ],
    },
    {
      id: "inprogress",
      title: "In Progress",
      tasks: [
        {
          id: 3,
          title: "Design system components",
          description: "Create reusable UI components for the design system",
          assignee: { name: "Sarah Miller", initials: "SM" },
          priority: "High",
          dueDate: "Dec 14, 2024",
          comments: 5,
          attachments: 2,
        },
        {
          id: 4,
          title: "API integration planning",
          description: "Plan the integration with existing backend APIs",
          assignee: { name: "Alex Brown", initials: "AB" },
          priority: "Medium",
          dueDate: "Dec 13, 2024",
          comments: 2,
          attachments: 1,
        },
      ],
    },
    {
      id: "review",
      title: "Review",
      tasks: [
        {
          id: 5,
          title: "Homepage mockups",
          description: "Review and approve homepage design mockups",
          assignee: { name: "John Doe", initials: "JD" },
          priority: "High",
          dueDate: "Dec 11, 2024",
          comments: 8,
          attachments: 3,
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      tasks: [
        {
          id: 6,
          title: "Project kickoff meeting",
          description: "Initial project planning and team alignment meeting",
          assignee: { name: "John Doe", initials: "JD" },
          priority: "Medium",
          dueDate: "Nov 5, 2024",
          comments: 4,
          attachments: 1,
        },
        {
          id: 7,
          title: "Competitor analysis",
          description: "Research and analyze competitor websites and features",
          assignee: { name: "Sarah Miller", initials: "SM" },
          priority: "Low",
          dueDate: "Nov 10, 2024",
          comments: 2,
          attachments: 2,
        },
      ],
    },
  ]

  const timelineData = [
    {
      id: 1,
      title: "Project Kickoff",
      description: "Initial project planning and team alignment",
      startDate: "2024-11-01",
      endDate: "2024-11-05",
      progress: 100,
      assignee: { name: "John Doe", initials: "JD" },
      status: "completed",
      dependencies: [],
    },
    {
      id: 2,
      title: "Research & Analysis",
      description: "Competitor analysis and user research",
      startDate: "2024-11-06",
      endDate: "2024-11-15",
      progress: 100,
      assignee: { name: "Sarah Miller", initials: "SM" },
      status: "completed",
      dependencies: [1],
    },
    {
      id: 3,
      title: "Design Phase",
      description: "Wireframes, mockups, and design system",
      startDate: "2024-11-16",
      endDate: "2024-12-10",
      progress: 75,
      assignee: { name: "Sarah Miller", initials: "SM" },
      status: "in-progress",
      dependencies: [2],
    },
    {
      id: 4,
      title: "Development Phase",
      description: "Frontend and backend implementation",
      startDate: "2024-12-01",
      endDate: "2024-12-20",
      progress: 30,
      assignee: { name: "Alex Brown", initials: "AB" },
      status: "in-progress",
      dependencies: [3],
    },
    {
      id: 5,
      title: "Testing & QA",
      description: "Quality assurance and bug fixes",
      startDate: "2024-12-15",
      endDate: "2024-12-25",
      progress: 0,
      assignee: { name: "John Doe", initials: "JD" },
      status: "pending",
      dependencies: [4],
    },
    {
      id: 6,
      title: "Launch",
      description: "Production deployment and go-live",
      startDate: "2024-12-26",
      endDate: "2024-12-30",
      progress: 0,
      assignee: { name: "Alex Brown", initials: "AB" },
      status: "pending",
      dependencies: [5],
    },
  ]

  const projectFiles = [
    {
      id: 1,
      name: "Project Requirements.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadedBy: "John Doe",
      uploadedAt: "2024-11-01",
      category: "Documentation",
    },
    {
      id: 2,
      name: "Design Mockups.fig",
      type: "figma",
      size: "15.7 MB",
      uploadedBy: "Sarah Miller",
      uploadedAt: "2024-11-20",
      category: "Design",
    },
    {
      id: 3,
      name: "User Research Report.docx",
      type: "document",
      size: "1.8 MB",
      uploadedBy: "Sarah Miller",
      uploadedAt: "2024-11-15",
      category: "Research",
    },
    {
      id: 4,
      name: "API Documentation.md",
      type: "markdown",
      size: "456 KB",
      uploadedBy: "Alex Brown",
      uploadedAt: "2024-12-01",
      category: "Development",
    },
    {
      id: 5,
      name: "Brand Assets.zip",
      type: "archive",
      size: "8.2 MB",
      uploadedBy: "Sarah Miller",
      uploadedAt: "2024-11-10",
      category: "Assets",
    },
    {
      id: 6,
      name: "Demo Video.mp4",
      type: "video",
      size: "45.3 MB",
      uploadedBy: "John Doe",
      uploadedAt: "2024-12-05",
      category: "Media",
    },
  ]

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
      case "document":
      case "markdown":
        return FileText
      case "video":
        return Video
      case "archive":
        return Archive
      case "figma":
      case "image":
        return ImageIcon
      default:
        return FileText
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "in-progress":
        return "default"
      case "pending":
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

  return (
    <div className="min-h-screen bg-background">
      {/* Project Header */}
      <div className="border-b border-border bg-muted/30 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
                <Badge variant="outline">{project.category}</Badge>
                <Badge variant="default">{project.status}</Badge>
                <Badge variant="destructive">{project.priority}</Badge>
              </div>
              <p className="text-muted-foreground max-w-2xl">{project.description}</p>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <span>Created: {project.createdDate}</span>
                <span>Due: {project.dueDate}</span>
                <span>
                  {project.tasks.completed}/{project.tasks.total} tasks completed
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-2xl font-bold text-foreground">{project.progress}%</p>
              </div>
              <Progress value={project.progress} className="h-2 w-32" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Team:</span>
              <div className="flex -space-x-2">
                {project.team.map((member, index) => (
                  <Avatar key={index} className="h-8 w-8 border-2 border-background">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Project
            </Button>
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 max-w-md">
              <TabsTrigger value="board">Board</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>

            <TabsContent value="board" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {taskColumns.map((column) => (
                  <Card key={column.id} className="h-fit">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{column.title}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {column.tasks.length}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {column.tasks.map((task) => (
                        <Card key={task.id} className="p-3 hover:shadow-sm transition-shadow cursor-pointer">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <h4 className="text-sm font-medium text-foreground line-clamp-2">{task.title}</h4>
                              <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                                {task.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-5 w-5">
                                  <AvatarFallback className="text-xs">{task.assignee.initials}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">{task.dueDate}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                {task.comments > 0 && (
                                  <div className="flex items-center space-x-1">
                                    <MessageSquare className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">{task.comments}</span>
                                  </div>
                                )}
                                {task.attachments > 0 && (
                                  <div className="flex items-center space-x-1">
                                    <Paperclip className="w-3 h-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">{task.attachments}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                      <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
                        <Plus className="w-4 h-4 mr-2" />
                        Add task
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Tasks</CardTitle>
                  <CardDescription>Complete list of all project tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {taskColumns
                      .flatMap((column) => column.tasks)
                      .map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center space-x-4 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h4 className="font-medium text-foreground">{task.title}</h4>
                              <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                                {task.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">{task.assignee.initials}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">{task.dueDate}</span>
                            <div className="flex items-center space-x-2">
                              {task.comments > 0 && (
                                <div className="flex items-center space-x-1">
                                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">{task.comments}</span>
                                </div>
                              )}
                              {task.attachments > 0 && (
                                <div className="flex items-center space-x-1">
                                  <Paperclip className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">{task.attachments}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Project Timeline</CardTitle>
                        <CardDescription>Visual timeline of project milestones and tasks</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          View Calendar
                        </Button>
                        <Select defaultValue="weeks">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="weeks">Weeks</SelectItem>
                            <SelectItem value="months">Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {timelineData.map((item, index) => (
                        <div key={item.id} className="relative">
                          {index < timelineData.length - 1 && (
                            <div className="absolute left-4 top-8 w-0.5 h-16 bg-border" />
                          )}
                          <div className="flex items-start space-x-4">
                            <div
                              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                                item.status === "completed"
                                  ? "bg-primary border-primary"
                                  : item.status === "in-progress"
                                    ? "bg-background border-primary"
                                    : "bg-background border-muted-foreground"
                              }`}
                            >
                              {item.status === "completed" && (
                                <CheckCircle2 className="w-4 h-4 text-primary-foreground" />
                              )}
                              {item.status === "in-progress" && <div className="w-2 h-2 bg-primary rounded-full" />}
                            </div>
                            <Card className="flex-1">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="space-y-2 flex-1">
                                    <div className="flex items-center space-x-3">
                                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                                      <Badge variant={getStatusColor(item.status)}>
                                        {item.status.replace("-", " ")}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                      <span>
                                        {item.startDate} - {item.endDate}
                                      </span>
                                      <div className="flex items-center space-x-1">
                                        <Avatar className="w-5 h-5">
                                          <AvatarFallback className="text-xs">{item.assignee.initials}</AvatarFallback>
                                        </Avatar>
                                        <span>{item.assignee.name}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right space-y-2">
                                    <span className="text-sm font-medium">{item.progress}%</span>
                                    <Progress value={item.progress} className="h-2 w-24" />
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="files" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Project Files</CardTitle>
                        <CardDescription>Documents and files related to this project</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload File
                        </Button>
                        <Select defaultValue="all">
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Files</SelectItem>
                            <SelectItem value="documentation">Documentation</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="development">Development</SelectItem>
                            <SelectItem value="media">Media</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {projectFiles.map((file) => {
                        const FileIcon = getFileIcon(file.type)
                        return (
                          <Card key={file.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                                  <FileIcon className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-foreground truncate">{file.name}</h4>
                                  <p className="text-sm text-muted-foreground">{file.size}</p>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <Badge variant="outline" className="text-xs">
                                      {file.category}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center justify-between mt-3">
                                    <div className="text-xs text-muted-foreground">
                                      <p>By {file.uploadedBy}</p>
                                      <p>{file.uploadedAt}</p>
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
                                          Preview
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Download className="mr-2 h-4 w-4" />
                                          Download
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Share className="mr-2 h-4 w-4" />
                                          Share
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
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 text-sm">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">JD</AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground">
                          <span className="font-medium text-foreground">John Doe</span> uploaded{" "}
                          <span className="font-medium">Demo Video.mp4</span>
                        </span>
                        <span className="text-muted-foreground">2 hours ago</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">AB</AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground">
                          <span className="font-medium text-foreground">Alex Brown</span> updated{" "}
                          <span className="font-medium">API Documentation.md</span>
                        </span>
                        <span className="text-muted-foreground">1 day ago</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">SM</AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground">
                          <span className="font-medium text-foreground">Sarah Miller</span> shared{" "}
                          <span className="font-medium">Design Mockups.fig</span>
                        </span>
                        <span className="text-muted-foreground">3 days ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
