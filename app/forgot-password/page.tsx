"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, ArrowRight, ArrowLeft, Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log("Password reset request for:", email)
      setIsSubmitted(true)
      setIsLoading(false)
    }, 1000)
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
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/signin">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {!isSubmitted ? (
            <>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground">Forgot your password?</h1>
                <p className="text-muted-foreground mt-2">
                  No worries, we'll send you reset instructions
                </p>
              </div>

              <Card className="border-border shadow-lg">
                <CardHeader className="space-y-1 pb-6">
                  <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
                  <CardDescription className="text-center">
                    Enter your email address and we'll send you a link to reset your password
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-11"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-11" 
                      disabled={isLoading || !email}
                    >
                      {isLoading ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Reset Link
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="text-center">
                    <Link 
                      href="/signin" 
                      className="text-sm text-primary hover:underline inline-flex items-center"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back to Sign In
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Check your email</h1>
                <p className="text-muted-foreground mt-2">
                  We've sent a password reset link to {email}
                </p>
              </div>

              <Card className="border-border shadow-lg">
                <CardContent className="pt-6 space-y-6">
                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Didn't receive the email? Check your spam folder or try another email address.
                    </p>
                    
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full h-11"
                        onClick={() => {
                          setIsSubmitted(false)
                          setEmail("")
                        }}
                      >
                        Try Another Email
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="w-full h-11"
                        onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                        disabled={isLoading}
                      >
                        {isLoading ? "Resending..." : "Resend Email"}
                      </Button>
                    </div>
                  </div>

                  <div className="text-center">
                    <Link 
                      href="/signin" 
                      className="text-sm text-primary hover:underline inline-flex items-center"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back to Sign In
                    </Link>
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
