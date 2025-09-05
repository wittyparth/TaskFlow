"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, ArrowLeft, Save, Pause, Trash2, AlertTriangle, Clock, DollarSign, Zap } from "lucide-react"
import Link from "next/link"

export default function SubscriptionManagementPage() {
  const [isChangePlanDialogOpen, setIsChangePlanDialogOpen] = useState(false)
  const [isPauseDialogOpen, setIsPauseDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("pro")

  const subscription = {
    id: "sub_1234567890",
    status: "active",
    plan: {
      name: "Pro",
      price: 29,
      interval: "month",
    },
    currentPeriodStart: "2024-12-15",
    currentPeriodEnd: "2025-01-15",
    cancelAtPeriodEnd: false,
    trialEnd: null,
    pausedAt: null,
  }

  const billingSettings = {
    autoRenew: true,
    usageAlerts: true,
    usageThreshold: 80,
    invoiceEmails: true,
    paymentFailureEmails: true,
  }

  const upcomingInvoice = {
    amount: 29.0,
    date: "2025-01-15",
    items: [{ description: "Pro Plan (Jan 15 - Feb 15)", amount: 29.0 }],
  }

  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      interval: "month",
      description: "Perfect for individuals",
    },
    {
      id: "pro",
      name: "Pro",
      price: 29,
      interval: "month",
      description: "Best for growing teams",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 99,
      interval: "month",
      description: "For large organizations",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "canceled":
        return "bg-red-100 text-red-800"
      case "past_due":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/billing">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Billing
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Subscription Management</h1>
            <p className="text-muted-foreground">Manage your subscription settings and billing preferences</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Current Subscription */}
          <Card>
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
              <CardDescription>Your active subscription details and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{subscription.plan.name} Plan</h3>
                    <Badge className={getStatusColor(subscription.status)}>{subscription.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ${subscription.plan.price}/{subscription.plan.interval} • ID: {subscription.id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Current period: {subscription.currentPeriodStart} - {subscription.currentPeriodEnd}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Dialog open={isChangePlanDialogOpen} onOpenChange={setIsChangePlanDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Change Plan
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Subscription Plan</DialogTitle>
                        <DialogDescription>
                          Select a new plan. Changes will be prorated and take effect immediately.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {plans.map((plan) => (
                          <div
                            key={plan.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                              selectedPlan === plan.id ? "border-primary bg-primary/5" : "border-border"
                            }`}
                            onClick={() => setSelectedPlan(plan.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium">{plan.name}</h4>
                                <p className="text-sm text-muted-foreground">{plan.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">${plan.price}</p>
                                <p className="text-sm text-muted-foreground">/{plan.interval}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <DialogFooter>
                        <Button onClick={() => setIsChangePlanDialogOpen(false)}>
                          Change to {plans.find((p) => p.id === selectedPlan)?.name}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {subscription.cancelAtPeriodEnd && (
                <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-orange-800">Subscription Ending</h4>
                      <p className="text-sm text-orange-700">
                        Your subscription will end on {subscription.currentPeriodEnd}. You'll still have access until
                        then.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                        Reactivate Subscription
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Billing Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Billing Settings</CardTitle>
              <CardDescription>Configure your billing preferences and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-Renewal</Label>
                  <p className="text-sm text-muted-foreground">Automatically renew your subscription</p>
                </div>
                <Switch defaultChecked={billingSettings.autoRenew} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Usage Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified when approaching usage limits</p>
                </div>
                <Switch defaultChecked={billingSettings.usageAlerts} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usage-threshold">Usage Alert Threshold</Label>
                <Select defaultValue={billingSettings.usageThreshold.toString()}>
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50% of limit</SelectItem>
                    <SelectItem value="75">75% of limit</SelectItem>
                    <SelectItem value="80">80% of limit</SelectItem>
                    <SelectItem value="90">90% of limit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Invoice Emails</Label>
                  <p className="text-sm text-muted-foreground">Receive email notifications for new invoices</p>
                </div>
                <Switch defaultChecked={billingSettings.invoiceEmails} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Payment Failure Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified if payments fail</p>
                </div>
                <Switch defaultChecked={billingSettings.paymentFailureEmails} />
              </div>

              <div className="flex justify-end pt-4">
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Actions</CardTitle>
              <CardDescription>Manage your subscription lifecycle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Dialog open={isPauseDialogOpen} onOpenChange={setIsPauseDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Pause className="w-4 h-4 mr-2" />
                      Pause Subscription
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Pause Subscription</DialogTitle>
                      <DialogDescription>
                        Temporarily pause your subscription. You can resume anytime within 90 days.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 border border-border rounded-lg">
                        <h4 className="font-medium mb-2">What happens when you pause:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Billing stops immediately</li>
                          <li>• Access continues until current period ends</li>
                          <li>• Data is preserved for 90 days</li>
                          <li>• You can resume anytime</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pause-reason">Reason for pausing (optional)</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a reason" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="temporary">Temporary break</SelectItem>
                            <SelectItem value="budget">Budget constraints</SelectItem>
                            <SelectItem value="features">Missing features</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsPauseDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsPauseDialogOpen(false)}>Pause Subscription</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule Cancellation
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-destructive">Danger Zone</h4>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full justify-start">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Cancel Subscription Immediately
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will immediately cancel your subscription and you'll lose access to all Pro features. This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                      <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Cancel Subscription
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Upcoming Invoice */}
          <Card>
            <CardHeader>
              <CardTitle>Next Invoice</CardTitle>
              <CardDescription>Your upcoming billing details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Due Date</span>
                <span className="font-medium">{upcomingInvoice.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="font-semibold text-lg">${upcomingInvoice.amount.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Invoice Items</h4>
                {upcomingInvoice.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{item.description}</span>
                    <span>${item.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Days Remaining</span>
                <Badge variant="secondary">15</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Paid</span>
                <Badge variant="secondary">$348</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <Badge variant="secondary">Jan 2024</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Payment Method</span>
                <Badge variant="secondary">•••• 4242</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <CreditCard className="w-4 h-4 mr-2" />
                Update Payment Method
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <DollarSign className="w-4 h-4 mr-2" />
                View Billing History
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Zap className="w-4 h-4 mr-2" />
                Usage Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
