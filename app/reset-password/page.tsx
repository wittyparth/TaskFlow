"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, ArrowRight, Eye, EyeOff, Check, X, AlertCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const passwordRequirements = [
    { text: "At least 8 characters", met: formData.password.length >= 8 },
    { text: "Contains uppercase letter", met: /[A-Z]/.test(formData.password) },
    { text: "Contains lowercase letter", met: /[a-z]/.test(formData.password) },
    { text: "Contains number", met: /\d/.test(formData.password) },
  ]

  const isPasswordValid = passwordRequirements.every(req => req.met)
  const doPasswordsMatch = formData.password === formData.confirmPassword
  const isFormValid = isPasswordValid && doPasswordsMatch && formData.password && formData.confirmPassword

  useEffect(() => {
    if (token) {
      // Validate token
      setTimeout(() => {
        // For demo purposes, randomly validate token
        const valid = Math.random() > 0.2
        setIsValidToken(valid)
      }, 1000)
    } else {
      setIsValidToken(false)
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return
    
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log("Password reset for token:", token)
      setIsSuccess(true)
      setIsLoading(false)
    }, 1000)
  }

  // Loading state while validating token
  if (isValidToken === null) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">TaskFlow Pro</span>
            </Link>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md space-y-8">
            <Card className="border-border shadow-lg">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="animate-pulse space-y-3">
                    <div className="h-2 bg-muted rounded"></div>
                    <div className="h-2 bg-muted rounded w-3/4 mx-auto"></div>
                    <div className="h-2 bg-muted rounded w-1/2 mx-auto"></div>
                  </div>
                  <p className="text-muted-foreground mt-4">Validating reset link...</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Invalid token
  if (!isValidToken) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">TaskFlow Pro</span>
            </Link>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Invalid reset link</h1>
              <p className="text-muted-foreground mt-2">
                This password reset link is invalid or has expired
              </p>
            </div>

            <Card className="border-border shadow-lg">
              <CardContent className="pt-6 space-y-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="space-y-1">
                      <h3 className="font-medium text-red-800">Link Expired</h3>
                      <p className="text-sm text-red-700">
                        Password reset links expire after 24 hours for security reasons.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full h-11" asChild>
                    <Link href="/forgot-password">
                      Request New Reset Link
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full h-11" asChild>
                    <Link href="/signin">Back to Sign In</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">TaskFlow Pro</span>
            </Link>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Password updated!</h1>
              <p className="text-muted-foreground mt-2">
                Your password has been successfully reset
              </p>
            </div>

            <Card className="border-border shadow-lg">
              <CardContent className="pt-6 space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="space-y-1">
                      <h3 className="font-medium text-green-800">Password Reset Complete</h3>
                      <p className="text-sm text-green-700">
                        You can now sign in with your new password.
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="w-full h-11" asChild>
                  <Link href="/signin">
                    Continue to Sign In
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Reset password form
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">TaskFlow Pro</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Set new password</h1>
            <p className="text-muted-foreground mt-2">
              Choose a strong password for your account
            </p>
          </div>

          <Card className="border-border shadow-lg">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center">Create New Password</CardTitle>
              <CardDescription className="text-center">
                Your new password must be different from previously used passwords
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Password Requirements */}
                {formData.password && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Password requirements:</Label>
                    <div className="space-y-1">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          {req.met ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <X className="w-4 h-4 text-muted-foreground" />
                          )}
                          <span className={req.met ? "text-green-600" : "text-muted-foreground"}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                      className="h-11 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {formData.confirmPassword && !doPasswordsMatch && (
                    <p className="text-sm text-red-500">Passwords do not match</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-11" 
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? (
                    "Updating Password..."
                  ) : (
                    <>
                      Update Password
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center">
                <Link 
                  href="/signin" 
                  className="text-sm text-primary hover:underline"
                >
                  Back to Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <div className="flex space-x-6 mb-4 md:mb-0">
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Support
              </Link>
            </div>
            <div>© 2024 TaskFlow Pro. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
