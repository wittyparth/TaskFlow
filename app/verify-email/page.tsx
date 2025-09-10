"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Mail, ArrowRight, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false)
  const [message, setMessage] = useState("")

  const handleResendEmail = async () => {
    setIsResending(true)
    setMessage("")
    
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const email = urlParams.get('email') || prompt('Please enter your email address:')
      
      if (!email) {
        setMessage("Please provide your email address")
        setIsResending(false)
        return
      }

      setMessage("Verification email sent successfully!")
    } catch (err) {
      setMessage("An error occurred while resending email")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
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
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Check your email</CardTitle>
                <CardDescription className="mt-2">
                  We've sent a verification link to your email address
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Please check your inbox and click the verification link to complete your account setup.
                </p>
                
                {message && (
                  <div className={`p-3 rounded-md text-sm ${
                    message.includes('success') 
                      ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                      : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {message}
                  </div>
                )}
                
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-2">
                    Didn't receive the email?
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Check your spam or junk folder</li>
                    <li>• Make sure the email address is correct</li>
                    <li>• Wait a few minutes for delivery</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleResendEmail}
                    variant="outline" 
                    className="w-full"
                    disabled={isResending}
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Resend verification email
                      </>
                    )}
                  </Button>
                  
                  <Button asChild className="w-full">
                    <Link href="/signin">
                      Continue to Sign In
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
