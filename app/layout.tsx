import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { PostHogProvider } from "@/components/providers/posthog-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { PageViewTracker } from "@/components/analytics/page-view-tracker"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "TaskFlow Pro - Project Management Platform",
  description: "Modern project management and team collaboration platform",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <AuthProvider>
              <PostHogProvider>
                <PageViewTracker />
                {children}
              </PostHogProvider>
            </AuthProvider>
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
