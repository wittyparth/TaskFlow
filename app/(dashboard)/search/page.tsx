"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  Search,
  CheckCircle2,
  Settings,
  LogOut,
  User,
  Filter,
  Clock,
  FileText,
  Users,
  Bookmark,
  History,
} from "lucide-react"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFilter, setSearchFilter] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")

  const searchResults = {
    projects: [
      {
        id: 1,
        title: "Website Redesign",
        description: "Complete overhaul of company website with modern design",
        type: "project",
        status: "In Progress",
        members: 5,
        lastUpdated: "2 hours ago",
        progress: 75,
      },
      {
        id: 2,
        title: "Mobile App Development",
        description: "Native iOS and Android app for customer engagement",
        type: "project",
        status: "Planning",
        members: 8,
        lastUpdated: "1 day ago",
        progress: 25,
      },
    ],
    tasks: [
      {
        id: 1,
        title: "Design homepage mockups",
        description: "Create wireframes and high-fidelity mockups for new homepage",
        type: "task",
        priority: "High",
        assignee: "Sarah Miller",
        dueDate: "Dec 15, 2024",
        project: "Website Redesign",
      },
      {
        id: 2,
        title: "Set up development environment",
        description: "Configure local development setup for React Native",
        type: "task",
        priority: "Medium",
        assignee: "Alex Brown",
        dueDate: "Dec 12, 2024",
        project: "Mobile App Development",
      },
    ],
    people: [
      {
        id: 1,
        name: "Sarah Miller",
        role: "UI/UX Designer",
        email: "sarah@company.com",
        type: "person",
        projects: 3,
        tasksCompleted: 45,
        avatar: "/placeholder.svg?height=40&width=40",
      },
      {
        id: 2,
        name: "Alex Brown",
        role: "Frontend Developer",
        email: "alex@company.com",
        type: "person",
        projects: 2,
        tasksCompleted: 38,
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
    files: [
      {
        id: 1,
        name: "Project Requirements.pdf",
        description: "Detailed project requirements and specifications",
        type: "file",
        size: "2.4 MB",
        uploadedBy: "John Doe",
        uploadedAt: "Dec 8, 2024",
        project: "Website Redesign",
      },
      {
        id: 2,
        name: "Design System.figma",
        description: "Complete design system with components and guidelines",
        type: "file",
        size: "15.7 MB",
        uploadedBy: "Sarah Miller",
        uploadedAt: "Dec 10, 2024",
        project: "Website Redesign",
      },
    ],
  }

  const recentSearches = [
    "website redesign tasks",
    "Sarah Miller projects",
    "high priority tasks",
    "mobile app development",
    "design files",
  ]

  const savedSearches = [
    { name: "My Open Tasks", query: "assignee:me status:open", count: 12 },
    { name: "High Priority Items", query: "priority:high", count: 8 },
    { name: "This Week's Deadlines", query: "due:this-week", count: 15 },
    { name: "Team Projects", query: "type:project team:design", count: 6 },
  ]

  const getResultIcon = (type: string) => {
    switch (type) {
      case "project":
        return <CheckCircle2 className="w-4 h-4 text-blue-500" />
      case "task":
        return <FileText className="w-4 h-4 text-green-500" />
      case "person":
        return <Users className="w-4 h-4 text-purple-500" />
      case "file":
        return <FileText className="w-4 h-4 text-orange-500" />
      default:
        return <Search className="w-4 h-4 text-gray-500" />
    }
  }

  const getAllResults = () => {
    const allResults = [
      ...searchResults.projects,
      ...searchResults.tasks,
      ...searchResults.people,
      ...searchResults.files,
    ]

    if (searchFilter !== "all") {
      return allResults.filter((result) => result.type === searchFilter)
    }

    return allResults
  }

  return (
    <div className="min-h-screen bg-background">
        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Search Results Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {searchQuery ? `Search Results for "${searchQuery}"` : "Advanced Search"}
                </h1>
                <p className="text-muted-foreground">{getAllResults().length} results found</p>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </div>

            {/* Search Results */}
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 max-w-md">
                <TabsTrigger value="all">All ({getAllResults().length})</TabsTrigger>
                <TabsTrigger value="projects">Projects ({searchResults.projects.length})</TabsTrigger>
                <TabsTrigger value="tasks">Tasks ({searchResults.tasks.length})</TabsTrigger>
                <TabsTrigger value="people">People ({searchResults.people.length})</TabsTrigger>
                <TabsTrigger value="files">Files ({searchResults.files.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {getAllResults().map((result, index) => (
                  <Card key={`${result.type}-${result.id}`} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        {getResultIcon(result.type)}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-foreground">
                              {('title' in result && result.title) || ('name' in result && result.name)}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {result.type}
                            </Badge>
                            {('status' in result) && result.status && (
                              <Badge variant={result.status === "In Progress" ? "default" : "secondary"}>
                                {result.status}
                              </Badge>
                            )}
                            {('priority' in result) && result.priority && (
                              <Badge variant={result.priority === "High" ? "destructive" : "secondary"}>
                                {result.priority}
                              </Badge>
                            )}
                          </div>
                          {('description' in result) && result.description && (
                            <p className="text-sm text-muted-foreground">{result.description}</p>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            {('lastUpdated' in result) && result.lastUpdated && (
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>Updated {result.lastUpdated}</span>
                              </span>
                            )}
                            {('members' in result) && result.members && (
                              <span className="flex items-center space-x-1">
                                <Users className="w-3 h-3" />
                                <span>{result.members} members</span>
                              </span>
                            )}
                            {('assignee' in result) && result.assignee && (
                              <span>Assigned to {result.assignee}</span>
                            )}
                            {('project' in result) && result.project && (
                              <span>Project: {result.project}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Individual tab contents would be similar but filtered */}
              <TabsContent value="projects" className="space-y-4">
                {searchResults.projects.map((project) => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 mt-1" />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-foreground">{project.title}</h3>
                            <Badge variant={project.status === "In Progress" ? "default" : "secondary"}>
                              {project.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{project.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>Updated {project.lastUpdated}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{project.members} members</span>
                            </span>
                            <span>{project.progress}% complete</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>

            {/* Search Tips */}
            {!searchQuery && (
              <Card>
                <CardHeader>
                  <CardTitle>Search Tips</CardTitle>
                  <CardDescription>Get better results with these search techniques</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium">Advanced Operators</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <code className="bg-muted px-1 rounded">assignee:me</code> - Tasks assigned to you
                        </div>
                        <div>
                          <code className="bg-muted px-1 rounded">priority:high</code> - High priority items
                        </div>
                        <div>
                          <code className="bg-muted px-1 rounded">status:open</code> - Open tasks and projects
                        </div>
                        <div>
                          <code className="bg-muted px-1 rounded">due:today</code> - Items due today
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium">Search Examples</h4>
                      <div className="space-y-2 text-sm">
                        <div>"website redesign" - Exact phrase search</div>
                        <div>design OR development - Either term</div>
                        <div>project -archived - Exclude archived</div>
                        <div>created:last-week - Recently created</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
  )
}
