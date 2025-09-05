"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Mail, AlertCircle, Loader2 } from "lucide-react"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "your-email@company.com"
  const token = searchParams.get("token")
  
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "verifying" | "success" | "error">("pending")
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    if (token) {
      // Auto-verify if token is present
      setVerificationStatus("verifying")
      
      // Simulate API call
      setTimeout(() => {
        // For demo purposes, randomly succeed or fail
        const success = Math.random() > 0.3
        setVerificationStatus(success ? "success" : "error")
      }, 2000)
    }
  }, [token])

  const handleResendEmail = async () => {
    setIsResending(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log("Resending verification email to:", email)
      setIsResending(false)
    }, 1000)
  }

  const handleContinueToDashboard = () => {
    // Set auth token cookie
    document.cookie = 'authToken=demo_token_' + Date.now() + '; path=/; max-age=' + (60 * 60 * 24 * 7) // 7 days
    window.location.href = "/dashboard"
  }

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
          
          {/* Pending Verification */}
          {verificationStatus === "pending" && (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Verify your email</h1>
                <p className="text-muted-foreground mt-2">
                  We've sent a verification link to {email}
                </p>
              </div>

              <Card className="border-border shadow-lg">
                <CardHeader className="space-y-1 pb-6">
                  <CardTitle className="text-2xl text-center">Check your inbox</CardTitle>
                  <CardDescription className="text-center">
                    Click the verification link in the email to activate your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                      <h3 className="font-medium text-sm">What's next?</h3>
                      <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                        <li>Check your email inbox for a message from TaskFlow Pro</li>
                        <li>Click the "Verify Email" button in the email</li>
                        <li>You'll be redirected back here and logged in automatically</li>
                      </ol>
                    </div>
                    
                    <div className="text-center space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Didn't receive the email? Check your spam folder.
                      </p>
                      
                      <Button
                        variant="outline"
                        className="w-full h-11"
                        onClick={handleResendEmail}
                        disabled={isResending}
                      >
                        {isResending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Resending...
                          </>
                        ) : (
                          "Resend Verification Email"
                        )}
                      </Button>
                    </div>
                  </div>

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
            </>
          )}

          {/* Verifying */}
          {verificationStatus === "verifying" && (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Verifying your email</h1>
                <p className="text-muted-foreground mt-2">
                  Please wait while we verify your email address...
                </p>
              </div>

              <Card className="border-border shadow-lg">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="animate-pulse space-y-3">
                      <div className="h-2 bg-muted rounded"></div>
                      <div className="h-2 bg-muted rounded w-3/4 mx-auto"></div>
                      <div className="h-2 bg-muted rounded w-1/2 mx-auto"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Success */}
          {verificationStatus === "success" && (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Email verified!</h1>
                <p className="text-muted-foreground mt-2">
                  Your account has been successfully activated
                </p>
              </div>

              <Card className="border-border shadow-lg">
                <CardHeader className="space-y-1 pb-6">
                  <CardTitle className="text-2xl text-center">Welcome to TaskFlow Pro</CardTitle>
                  <CardDescription className="text-center">
                    You're all set! Your account is now active and ready to use.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <div className="space-y-1">
                        <h3 className="font-medium text-green-800">Account Activated</h3>
                        <p className="text-sm text-green-700">
                          Your free 14-day trial has started. Explore all premium features without limitations.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full h-11" 
                    onClick={handleContinueToDashboard}
                  >
                    Continue to Dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* Error */}
          {verificationStatus === "error" && (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Verification failed</h1>
                <p className="text-muted-foreground mt-2">
                  We couldn't verify your email address
                </p>
              </div>

              <Card className="border-border shadow-lg">
                <CardHeader className="space-y-1 pb-6">
                  <CardTitle className="text-2xl text-center">Something went wrong</CardTitle>
                  <CardDescription className="text-center">
                    The verification link may have expired or been used already
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div className="space-y-1">
                        <h3 className="font-medium text-red-800">Verification Failed</h3>
                        <p className="text-sm text-red-700">
                          The verification link is invalid or has expired. Please request a new one.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full h-11"
                      onClick={handleResendEmail}
                      disabled={isResending}
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending New Link...
                        </>
                      ) : (
                        "Send New Verification Link"
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full h-11"
                      asChild
                    >
                      <Link href="/signin">Back to Sign In</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
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
