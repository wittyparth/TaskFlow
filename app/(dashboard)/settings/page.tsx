"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell,
  User,
  Key,
  Moon,
  Sun,
  Monitor,
  Save,
  Trash2,
  Eye,
  EyeOff,
  Building,
  Zap,
  Download,
  Shield,
} from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [showApiKey, setShowApiKey] = useState(false)

  // Settings state
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    bio: "Product Manager passionate about building great user experiences",
    timezone: "America/New_York",
    language: "en",
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    projectUpdates: true,
    taskAssignments: true,
    teamInvitations: true,
    weeklyDigest: false,
    marketingEmails: false,
  })

  const [preferences, setPreferences] = useState({
    theme: "system",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    startOfWeek: "monday",
    defaultView: "board",
  })

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    sessionTimeout: "24h",
    loginNotifications: true,
  })

  const apiKeys = [
    {
      id: 1,
      name: "Production API",
      key: "sk_live_1234567890abcdef",
      created: "Dec 1, 2024",
      lastUsed: "2 hours ago",
      permissions: ["read", "write"],
    },
    {
      id: 2,
      name: "Development API",
      key: "sk_test_abcdef1234567890",
      created: "Nov 15, 2024",
      lastUsed: "1 day ago",
      permissions: ["read"],
    },
  ]

  const connectedApps = [
    {
      id: 1,
      name: "Slack",
      description: "Get notifications and updates in your Slack workspace",
      connected: true,
      icon: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 2,
      name: "Google Calendar",
      description: "Sync your project deadlines with Google Calendar",
      connected: true,
      icon: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 3,
      name: "GitHub",
      description: "Link your repositories and track development progress",
      connected: false,
      icon: "/placeholder.svg?height=32&width=32",
    },
    {
      id: 4,
      name: "Figma",
      description: "Import design files and collaborate on design projects",
      connected: false,
      icon: "/placeholder.svg?height=32&width=32",
    },
  ]

  const settingsCategories = [
    {
      title: "Account Settings",
      description: "Personal profile and account preferences",
      icon: User,
      href: "#profile",
      onClick: () => setActiveTab("profile"),
    },
    {
      title: "Workspace Settings",
      description: "Manage workspace-wide configurations",
      icon: Building,
      href: "/settings/workspace",
      external: true,
    },
    {
      title: "Notifications",
      description: "Configure notification preferences",
      icon: Bell,
      href: "#notifications",
      onClick: () => setActiveTab("notifications"),
    },
    {
      title: "Security & Privacy",
      description: "Manage security settings and privacy",
      icon: Shield,
      href: "#security",
      onClick: () => setActiveTab("security"),
    },
    {
      title: "Automation & Workflows",
      description: "Set up automated rules and workflows",
      icon: Zap,
      href: "/settings/automation",
      external: true,
    },
    {
      title: "Data & Export",
      description: "Manage your data and export options",
      icon: Download,
      href: "#data",
      onClick: () => setActiveTab("data"),
    },
  ]

  return (
    <div className="min-h-screen bg-background w-full p-6">
          <div className="mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences</p>
              </div>
            </div>

            {/* Settings Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {settingsCategories.map((category) => {
                const Icon = category.icon
                return (
                  <Card key={category.title} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      {category.external ? (
                        <Link href={category.href} className="block">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-foreground">{category.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <div className="block" onClick={category.onClick}>
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-foreground">{category.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Settings Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
              </TabsList>

              {/* Profile Settings */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information and profile details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile" />
                        <AvatarFallback className="text-lg">JD</AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm">
                          Change Avatar
                        </Button>
                        <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself..."
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select
                          value={profile.timezone}
                          onValueChange={(value) => setProfile({ ...profile, timezone: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/New_York">Eastern Time</SelectItem>
                            <SelectItem value="America/Chicago">Central Time</SelectItem>
                            <SelectItem value="America/Denver">Mountain Time</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                            <SelectItem value="Europe/London">London</SelectItem>
                            <SelectItem value="Europe/Paris">Paris</SelectItem>
                            <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select
                          value={profile.language}
                          onValueChange={(value) => setProfile({ ...profile, language: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="ja">Japanese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notification Settings */}
              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose how you want to be notified about updates and activities</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={notifications.emailNotifications}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, emailNotifications: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                        </div>
                        <Switch
                          checked={notifications.pushNotifications}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, pushNotifications: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Project Updates</Label>
                          <p className="text-sm text-muted-foreground">Get notified when projects are updated</p>
                        </div>
                        <Switch
                          checked={notifications.projectUpdates}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, projectUpdates: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Task Assignments</Label>
                          <p className="text-sm text-muted-foreground">Get notified when tasks are assigned to you</p>
                        </div>
                        <Switch
                          checked={notifications.taskAssignments}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, taskAssignments: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Team Invitations</Label>
                          <p className="text-sm text-muted-foreground">Get notified about team invitations</p>
                        </div>
                        <Switch
                          checked={notifications.teamInvitations}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, teamInvitations: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Weekly Digest</Label>
                          <p className="text-sm text-muted-foreground">Receive a weekly summary of your activity</p>
                        </div>
                        <Switch
                          checked={notifications.weeklyDigest}
                          onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyDigest: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Marketing Emails</Label>
                          <p className="text-sm text-muted-foreground">Receive updates about new features and tips</p>
                        </div>
                        <Switch
                          checked={notifications.marketingEmails}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, marketingEmails: checked })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button>
                        <Save className="w-4 h-4 mr-2" />
                        Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Preferences */}
              <TabsContent value="preferences" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>App Preferences</CardTitle>
                    <CardDescription>Customize your TaskFlow Pro experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Theme</Label>
                        <Select
                          value={preferences.theme}
                          onValueChange={(value) => setPreferences({ ...preferences, theme: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">
                              <div className="flex items-center">
                                <Sun className="w-4 h-4 mr-2" />
                                Light
                              </div>
                            </SelectItem>
                            <SelectItem value="dark">
                              <div className="flex items-center">
                                <Moon className="w-4 h-4 mr-2" />
                                Dark
                              </div>
                            </SelectItem>
                            <SelectItem value="system">
                              <div className="flex items-center">
                                <Monitor className="w-4 h-4 mr-2" />
                                System
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Default Project View</Label>
                        <Select
                          value={preferences.defaultView}
                          onValueChange={(value) => setPreferences({ ...preferences, defaultView: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="board">Board View</SelectItem>
                            <SelectItem value="list">List View</SelectItem>
                            <SelectItem value="timeline">Timeline View</SelectItem>
                            <SelectItem value="calendar">Calendar View</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Date Format</Label>
                        <Select
                          value={preferences.dateFormat}
                          onValueChange={(value) => setPreferences({ ...preferences, dateFormat: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Time Format</Label>
                        <Select
                          value={preferences.timeFormat}
                          onValueChange={(value) => setPreferences({ ...preferences, timeFormat: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12h">12 Hour</SelectItem>
                            <SelectItem value="24h">24 Hour</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Start of Week</Label>
                        <Select
                          value={preferences.startOfWeek}
                          onValueChange={(value) => setPreferences({ ...preferences, startOfWeek: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sunday">Sunday</SelectItem>
                            <SelectItem value="monday">Monday</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button>
                        <Save className="w-4 h-4 mr-2" />
                        Save Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security and authentication</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Two-Factor Authentication</Label>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch
                          checked={security.twoFactorEnabled}
                          onCheckedChange={(checked) => setSecurity({ ...security, twoFactorEnabled: checked })}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label>Login Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified when someone logs into your account
                          </p>
                        </div>
                        <Switch
                          checked={security.loginNotifications}
                          onCheckedChange={(checked) => setSecurity({ ...security, loginNotifications: checked })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Session Timeout</Label>
                        <Select
                          value={security.sessionTimeout}
                          onValueChange={(value) => setSecurity({ ...security, sessionTimeout: value })}
                        >
                          <SelectTrigger className="max-w-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1h">1 Hour</SelectItem>
                            <SelectItem value="8h">8 Hours</SelectItem>
                            <SelectItem value="24h">24 Hours</SelectItem>
                            <SelectItem value="7d">7 Days</SelectItem>
                            <SelectItem value="30d">30 Days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-border">
                      <h4 className="font-medium">Password</h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                        <Button variant="outline">Update Password</Button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button>
                        <Save className="w-4 h-4 mr-2" />
                        Save Security Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Integrations */}
              <TabsContent value="integrations" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Connected Apps</CardTitle>
                    <CardDescription>Manage your third-party integrations and connected services</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {connectedApps.map((app) => (
                      <div key={app.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={app.icon || "/placeholder.svg"} alt={app.name} />
                          <AvatarFallback>{app.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{app.name}</h4>
                            {app.connected && (
                              <Badge variant="secondary" className="text-xs">
                                Connected
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{app.description}</p>
                        </div>
                        <Button variant={app.connected ? "outline" : "default"} size="sm">
                          {app.connected ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* API Settings */}
              <TabsContent value="api" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>Manage your API keys for integrating with TaskFlow Pro</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-end">
                      <Button>
                        <Key className="w-4 h-4 mr-2" />
                        Generate New Key
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {apiKeys.map((key) => (
                        <div key={key.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{key.name}</h4>
                              <div className="flex space-x-1">
                                {key.permissions.map((permission) => (
                                  <Badge key={permission} variant="outline" className="text-xs">
                                    {permission}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <code className="text-sm bg-muted px-2 py-1 rounded">
                                {showApiKey ? key.key : key.key.replace(/./g, "•")}
                              </code>
                              <Button variant="ghost" size="sm" onClick={() => setShowApiKey(!showApiKey)}>
                                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Created {key.created} • Last used {key.lastUsed}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Data & Export Settings */}
              <TabsContent value="data" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Export</CardTitle>
                    <CardDescription>Download your data and account information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">Account Data</h4>
                            <p className="text-sm text-muted-foreground">
                              Export your profile, settings, and account information
                            </p>
                            <Button variant="outline" size="sm" className="w-full bg-transparent">
                              <Download className="w-4 h-4 mr-2" />
                              Export Account Data
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <h4 className="font-medium">Project Data</h4>
                            <p className="text-sm text-muted-foreground">
                              Export all your projects, tasks, and collaboration data
                            </p>
                            <Button variant="outline" size="sm" className="w-full bg-transparent">
                              <Download className="w-4 h-4 mr-2" />
                              Export Project Data
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="space-y-4 pt-6 border-t border-border">
                      <h4 className="font-medium text-destructive">Danger Zone</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                          <div>
                            <h5 className="font-medium">Delete Account</h5>
                            <p className="text-sm text-muted-foreground">
                              Permanently delete your account and all associated data
                            </p>
                          </div>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
      </div>
  )
}
