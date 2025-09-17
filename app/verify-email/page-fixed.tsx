"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Mail, ArrowRight, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useUser } from "@/hooks/use-auth"
import { supabase } from "@/lib/supabase"

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false)
  const [message, setMessage] = useState("")
  const [emailFromUrl, setEmailFromUrl] = useState<string | null>(null)
  const router = useRouter()
  const { user, loading } = useUser()

  useEffect(() => {
    // Get email from URL parameters
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      setEmailFromUrl(urlParams.get('email'))
    }
  }, [])

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user && !loading) {
      console.log('User is authenticated, redirecting to dashboard...')
      router.replace('/dashboard')
    }
  }, [user, loading, router])

  // Show loading if checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If user is authenticated, don't show the verify page
  if (user) {
    return null
  }

  const handleResendEmail = async () => {
    setIsResending(true)
    setMessage("")
    
    try {
      const email = emailFromUrl || prompt('Please enter your email address:')
      
      if (!email) {
        setMessage("Please provide your email address")
        setIsResending(false)
        return
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) {
        console.error('Resend error:', error)
        setMessage("Error resending verification email. Please try again.")
      } else {
        setMessage("Verification email sent successfully!")
      }
    } catch (err) {
      console.error('Resend catch error:', err)
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
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">Check your email</CardTitle>
              <CardDescription className="text-muted-foreground">
                We sent a verification link to{" "}
                <span className="font-medium text-foreground">
                  {emailFromUrl || "your email address"}
                </span>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Click the link in the email to verify your account. If you don't see the email, 
                  check your spam folder.
                </p>
                
                {message && (
                  <div className={`p-3 rounded-md text-sm text-center ${
                    message.includes('successfully') 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {message}
                  </div>
                )}
                
                <Button 
                  onClick={handleResendEmail}
                  disabled={isResending}
                  variant="outline" 
                  className="w-full"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Resend verification email
                    </>
                  )}
                </Button>
              </div>
              
              <div className="text-center">
                <Link 
                  href="/signin" 
                  className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <ArrowRight className="w-4 h-4 mr-1" />
                  Back to Sign In
                </Link>
              </div>

              <div className="text-center">
                <Link 
                  href="/dashboard" 
                  className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Skip verification and go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-6 text-sm text-muted-foreground">
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