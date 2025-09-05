import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Shield, Crown, User, Save, RotateCcw } from "lucide-react"
import Link from "next/link"

const roles = [
  {
    id: "owner",
    name: "Owner",
    description: "Full access to all features and settings",
    icon: Crown,
    color: "text-yellow-500",
    members: 1,
  },
  {
    id: "admin",
    name: "Admin",
    description: "Manage team, projects, and most settings",
    icon: Shield,
    color: "text-blue-500",
    members: 2,
  },
  {
    id: "member",
    name: "Member",
    description: "Access to assigned projects and basic features",
    icon: User,
    color: "text-gray-500",
    members: 8,
  },
]

const permissions = [
  {
    category: "Project Management",
    items: [
      { id: "create_projects", name: "Create Projects", description: "Create new projects and workspaces" },
      { id: "edit_projects", name: "Edit Projects", description: "Modify project settings and details" },
      { id: "delete_projects", name: "Delete Projects", description: "Remove projects permanently" },
      { id: "manage_tasks", name: "Manage Tasks", description: "Create, edit, and assign tasks" },
      { id: "view_all_projects", name: "View All Projects", description: "Access to all team projects" },
    ],
  },
  {
    category: "Team Management",
    items: [
      { id: "invite_members", name: "Invite Members", description: "Send team invitations" },
      { id: "remove_members", name: "Remove Members", description: "Remove team members" },
      { id: "manage_roles", name: "Manage Roles", description: "Change member roles and permissions" },
      { id: "view_team", name: "View Team", description: "Access team member information" },
    ],
  },
  {
    category: "Workspace Settings",
    items: [
      { id: "workspace_settings", name: "Workspace Settings", description: "Modify workspace configuration" },
      { id: "billing_access", name: "Billing Access", description: "View and manage billing information" },
      { id: "integration_settings", name: "Integration Settings", description: "Configure third-party integrations" },
      { id: "security_settings", name: "Security Settings", description: "Manage security and access controls" },
    ],
  },
  {
    category: "Analytics & Reports",
    items: [
      { id: "view_analytics", name: "View Analytics", description: "Access team and project analytics" },
      { id: "export_data", name: "Export Data", description: "Export reports and project data" },
      { id: "advanced_reports", name: "Advanced Reports", description: "Create custom reports and dashboards" },
    ],
  },
]

const rolePermissions = {
  owner: {
    create_projects: true,
    edit_projects: true,
    delete_projects: true,
    manage_tasks: true,
    view_all_projects: true,
    invite_members: true,
    remove_members: true,
    manage_roles: true,
    view_team: true,
    workspace_settings: true,
    billing_access: true,
    integration_settings: true,
    security_settings: true,
    view_analytics: true,
    export_data: true,
    advanced_reports: true,
  },
  admin: {
    create_projects: true,
    edit_projects: true,
    delete_projects: false,
    manage_tasks: true,
    view_all_projects: true,
    invite_members: true,
    remove_members: true,
    manage_roles: false,
    view_team: true,
    workspace_settings: true,
    billing_access: false,
    integration_settings: true,
    security_settings: false,
    view_analytics: true,
    export_data: true,
    advanced_reports: false,
  },
  member: {
    create_projects: false,
    edit_projects: false,
    delete_projects: false,
    manage_tasks: true,
    view_all_projects: false,
    invite_members: false,
    remove_members: false,
    manage_roles: false,
    view_team: true,
    workspace_settings: false,
    billing_access: false,
    integration_settings: false,
    security_settings: false,
    view_analytics: false,
    export_data: false,
    advanced_reports: false,
  },
}

export default function PermissionsPage() {
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
            <h1 className="text-3xl font-bold text-foreground">Permissions & Roles</h1>
            <p className="text-muted-foreground">Manage team roles and permission settings</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
          <Button size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Role Overview</CardTitle>
            <CardDescription>Current roles and member distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {roles.map((role) => {
              const Icon = role.icon
              return (
                <div key={role.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                  <Icon className={`w-5 h-5 ${role.color}`} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-foreground">{role.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {role.members} {role.members === 1 ? "member" : "members"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
              <CardDescription>Configure permissions for each role</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground">
                  <div>Permission</div>
                  <div className="text-center">Owner</div>
                  <div className="text-center">Admin</div>
                  <div className="text-center">Member</div>
                </div>
                <Separator />

                {permissions.map((category) => (
                  <div key={category.category} className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">{category.category}</h3>
                    <div className="space-y-3">
                      {category.items.map((permission) => (
                        <div key={permission.id} className="grid grid-cols-4 gap-4 items-center py-2">
                          <div className="space-y-1">
                            <Label htmlFor={permission.id} className="text-sm font-medium">
                              {permission.name}
                            </Label>
                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                          </div>
                          <div className="flex justify-center">
                            <Switch
                              id={`${permission.id}-owner`}
                              checked={rolePermissions.owner[permission.id as keyof typeof rolePermissions.owner]}
                              disabled
                            />
                          </div>
                          <div className="flex justify-center">
                            <Switch
                              id={`${permission.id}-admin`}
                              checked={rolePermissions.admin[permission.id as keyof typeof rolePermissions.admin]}
                            />
                          </div>
                          <div className="flex justify-center">
                            <Switch
                              id={`${permission.id}-member`}
                              checked={rolePermissions.member[permission.id as keyof typeof rolePermissions.member]}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <Separator />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permission Guidelines</CardTitle>
          <CardDescription>Best practices for role and permission management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Owner Role</h4>
              <p className="text-sm text-muted-foreground">
                Should be limited to 1-2 people who need full administrative access. Owners can manage billing, security
                settings, and have unrestricted access to all features.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Admin Role</h4>
              <p className="text-sm text-muted-foreground">
                Suitable for team leads and managers who need to manage projects and team members but don't require
                access to sensitive settings like billing or security.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-foreground">Member Role</h4>
              <p className="text-sm text-muted-foreground">
                Default role for most team members. Members can work on assigned projects, manage their own tasks, and
                collaborate with the team without administrative privileges.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
