import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowLeft, Zap, Plus, MoreHorizontal, Edit, Trash2, Play, Pause } from "lucide-react"
import Link from "next/link"

const automationRules = [
  {
    id: 1,
    name: "Auto-assign new tasks",
    description: "Automatically assign tasks to team members based on workload",
    trigger: "Task Created",
    action: "Assign to Member",
    status: "active",
    lastRun: "2 hours ago",
    executions: 24,
  },
  {
    id: 2,
    name: "Project deadline reminders",
    description: "Send notifications 3 days before project deadlines",
    trigger: "Date Approaching",
    action: "Send Notification",
    status: "active",
    lastRun: "1 day ago",
    executions: 12,
  },
  {
    id: 3,
    name: "Weekly progress reports",
    description: "Generate and send weekly progress reports to stakeholders",
    trigger: "Weekly Schedule",
    action: "Generate Report",
    status: "paused",
    lastRun: "1 week ago",
    executions: 8,
  },
  {
    id: 4,
    name: "Overdue task escalation",
    description: "Escalate overdue tasks to project managers",
    trigger: "Task Overdue",
    action: "Escalate Task",
    status: "active",
    lastRun: "4 hours ago",
    executions: 6,
  },
]

const workflowTemplates = [
  {
    id: 1,
    name: "Bug Report Workflow",
    description: "Automated workflow for handling bug reports",
    category: "Development",
    steps: 5,
  },
  {
    id: 2,
    name: "Client Onboarding",
    description: "Step-by-step client onboarding process",
    category: "Business",
    steps: 8,
  },
  {
    id: 3,
    name: "Content Review Process",
    description: "Automated content review and approval workflow",
    category: "Marketing",
    steps: 4,
  },
]

export default function AutomationSettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/settings">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Settings
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Automation & Workflows</h1>
            <p className="text-muted-foreground">Configure automated rules and workflow templates</p>
          </div>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Rule
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span>Automation Rules</span>
                  </CardTitle>
                  <CardDescription>Manage your automated rules and triggers</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automationRules.map((rule) => (
                  <div key={rule.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-foreground">{rule.name}</h4>
                        <Badge variant={rule.status === "active" ? "default" : "secondary"}>{rule.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>Trigger: {rule.trigger}</span>
                        <span>•</span>
                        <span>Action: {rule.action}</span>
                        <span>•</span>
                        <span>Last run: {rule.lastRun}</span>
                        <span>•</span>
                        <span>{rule.executions} executions</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        {rule.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Rule
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Play className="mr-2 h-4 w-4" />
                            Test Rule
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Rule
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workflow Templates</CardTitle>
              <CardDescription>Pre-built workflow templates for common processes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workflowTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-foreground">{template.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{template.steps} steps</span>
                        <Button variant="outline" size="sm">
                          Use Template
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Global Automation Settings</CardTitle>
              <CardDescription>Configure global automation preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable Automations</Label>
                  <p className="text-sm text-muted-foreground">Allow automated rules to run in this workspace</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send email notifications for automation events</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="execution-limit">Daily Execution Limit</Label>
                <Select defaultValue="1000">
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100 executions</SelectItem>
                    <SelectItem value="500">500 executions</SelectItem>
                    <SelectItem value="1000">1,000 executions</SelectItem>
                    <SelectItem value="unlimited">Unlimited</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="retry-policy">Retry Policy</Label>
                <Select defaultValue="3">
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No retries</SelectItem>
                    <SelectItem value="1">1 retry</SelectItem>
                    <SelectItem value="3">3 retries</SelectItem>
                    <SelectItem value="5">5 retries</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Automation Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Rules</span>
                <Badge variant="secondary">3</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Executions</span>
                <Badge variant="secondary">50</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Success Rate</span>
                <Badge variant="default">98%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Time Saved</span>
                <Badge variant="secondary">12.5 hrs</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">Auto-assign new tasks</p>
                <p className="text-muted-foreground">Assigned task to Sarah Miller</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <Separator />
              <div className="text-sm">
                <p className="font-medium">Overdue task escalation</p>
                <p className="text-muted-foreground">Escalated to John Doe</p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
              <Separator />
              <div className="text-sm">
                <p className="font-medium">Project deadline reminder</p>
                <p className="text-muted-foreground">Sent to team members</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Create New Rule
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Zap className="w-4 h-4 mr-2" />
                Browse Templates
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Play className="w-4 h-4 mr-2" />
                Test Automation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
