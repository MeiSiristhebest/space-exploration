import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from "next/font/google"
import "./globals.css"
import { SpaceBackground } from "@/components/space-background"
import { Navbar } from "@/components/navbar"
import { AnimatedSpaceBackground } from "@/components/animated-space-background"
import { ScrollIndicator } from "@/components/scroll-indicator"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "宇宙探索者",
  description: "在沉浸式数字体验中探索宇宙的奥秘",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <AnimatedSpaceBackground intensity="medium" interactive={true} />
          <SpaceBackground />
          <Navbar />
          <ScrollIndicator />
          <main className="relative z-10">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}