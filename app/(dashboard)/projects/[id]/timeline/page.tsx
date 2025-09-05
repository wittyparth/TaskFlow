import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, ArrowLeft, ZoomIn, ZoomOut } from "lucide-react"
import Link from "next/link"

const timelineData = [
  {
    id: 1,
    title: "Project Kickoff",
    description: "Initial project planning and team alignment",
    startDate: "Nov 1",
    endDate: "Nov 5",
    progress: 100,
    assignee: { name: "John Doe", initials: "JD" },
    status: "completed",
    duration: 5,
  },
  {
    id: 2,
    title: "Research & Analysis",
    description: "Competitor analysis and user research",
    startDate: "Nov 6",
    endDate: "Nov 15",
    progress: 100,
    assignee: { name: "Sarah Miller", initials: "SM" },
    status: "completed",
    duration: 10,
  },
  {
    id: 3,
    title: "Design Phase",
    description: "Wireframes, mockups, and design system",
    startDate: "Nov 16",
    endDate: "Dec 10",
    progress: 75,
    assignee: { name: "Sarah Miller", initials: "SM" },
    status: "in-progress",
    duration: 25,
  },
  {
    id: 4,
    title: "Development Phase",
    description: "Frontend and backend implementation",
    startDate: "Dec 1",
    endDate: "Dec 20",
    progress: 30,
    assignee: { name: "Alex Brown", initials: "AB" },
    status: "in-progress",
    duration: 20,
  },
  {
    id: 5,
    title: "Testing & QA",
    description: "Quality assurance and bug fixes",
    startDate: "Dec 15",
    endDate: "Dec 25",
    progress: 0,
    assignee: { name: "John Doe", initials: "JD" },
    status: "pending",
    duration: 11,
  },
]

export default function TimelinePage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/projects/${params.id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Project
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Project Timeline</h1>
            <p className="text-muted-foreground">Gantt chart view of project milestones and dependencies</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <ZoomIn className="w-4 h-4" />
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

      <Card>
        <CardHeader>
          <CardTitle>Timeline Overview</CardTitle>
          <CardDescription>Visual representation of project phases and milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Timeline Header */}
            <div className="grid grid-cols-12 gap-2 text-sm text-muted-foreground border-b pb-2">
              <div className="col-span-4">Task</div>
              <div className="col-span-2">Duration</div>
              <div className="col-span-6 text-center">Timeline (Nov - Dec 2024)</div>
            </div>

            {/* Timeline Items */}
            {timelineData.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4 space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-foreground">{item.title}</h4>
                    <Badge
                      variant={
                        item.status === "completed"
                          ? "default"
                          : item.status === "in-progress"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {item.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-5 h-5">
                      <AvatarFallback className="text-xs">{item.assignee.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">{item.assignee.name}</span>
                  </div>
                </div>

                <div className="col-span-2 text-sm text-muted-foreground">
                  <div>
                    {item.startDate} - {item.endDate}
                  </div>
                  <div>{item.duration} days</div>
                </div>

                <div className="col-span-6">
                  <div className="relative h-8 bg-muted rounded">
                    <div
                      className={`absolute top-1 bottom-1 rounded ${
                        item.status === "completed"
                          ? "bg-primary"
                          : item.status === "in-progress"
                            ? "bg-primary"
                            : "bg-muted-foreground"
                      }`}
                      style={{
                        left: `${(item.id - 1) * 15}%`,
                        width: `${item.duration * 2}%`,
                      }}
                    >
                      {item.status === "in-progress" && (
                        <div
                          className="absolute top-0 bottom-0 bg-primary/60 rounded"
                          style={{ width: `${item.progress}%` }}
                        />
                      )}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-foreground">{item.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Overall Progress</span>
                <span className="text-2xl font-bold text-foreground">61%</span>
              </div>
              <Progress value={61} className="h-3" />
              <div className="text-sm text-muted-foreground">3 of 5 phases completed</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Critical Path</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-sm">Research Phase</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-primary rounded-full" />
                <span className="text-sm">Design Phase</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-muted-foreground rounded-full" />
                <span className="text-sm">Development Phase</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Design Completion</span>
                <span className="text-sm text-muted-foreground">Dec 10</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Development Start</span>
                <span className="text-sm text-muted-foreground">Dec 1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Testing Phase</span>
                <span className="text-sm text-muted-foreground">Dec 15</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
