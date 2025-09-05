import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, Calendar, User, Flag } from "lucide-react"

const tasks = [
  {
    id: 1,
    title: "Design new landing page",
    description: "Create wireframes and mockups for the new product landing page",
    priority: "High",
    status: "In Progress",
    assignee: "John Doe",
    dueDate: "2024-01-15",
    project: "Website Redesign",
    completed: false,
  },
  {
    id: 2,
    title: "Implement user authentication",
    description: "Set up login and registration functionality",
    priority: "Medium",
    status: "To Do",
    assignee: "Jane Smith",
    dueDate: "2024-01-20",
    project: "Mobile App",
    completed: false,
  },
  {
    id: 3,
    title: "Write API documentation",
    description: "Document all REST API endpoints",
    priority: "Low",
    status: "Review",
    assignee: "Mike Johnson",
    dueDate: "2024-01-18",
    project: "Backend API",
    completed: false,
  },
  {
    id: 4,
    title: "Setup CI/CD pipeline",
    description: "Configure automated testing and deployment",
    priority: "High",
    status: "Done",
    assignee: "Sarah Wilson",
    dueDate: "2024-01-10",
    project: "DevOps",
    completed: true,
  },
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "destructive"
    case "Medium":
      return "default"
    case "Low":
      return "secondary"
    default:
      return "default"
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Done":
      return "default"
    case "In Progress":
      return "default"
    case "Review":
      return "secondary"
    case "To Do":
      return "outline"
    default:
      return "outline"
  }
}

export default function TasksPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
          <p className="text-muted-foreground">Manage your personal tasks and assignments</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Search tasks..." className="pl-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="progress">In Progress</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="board">Board View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <Checkbox checked={task.completed} className="mt-1" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}
                      >
                        {task.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getPriorityColor(task.priority)}>
                          <Flag className="w-3 h-3 mr-1" />
                          {task.priority}
                        </Badge>
                        <Badge variant={getStatusColor(task.status)}>{task.status}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{task.assignee}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{task.dueDate}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {task.project}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="board">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {["To Do", "In Progress", "Review", "Done"].map((status) => (
              <Card key={status}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">{status}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tasks
                    .filter((task) => task.status === status)
                    .map((task) => (
                      <Card key={task.id} className="p-3 hover:shadow-sm transition-shadow cursor-pointer">
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant={getPriorityColor(task.priority)} className="text-xs">
                              {task.priority}
                            </Badge>
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {task.assignee
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </div>
                      </Card>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
