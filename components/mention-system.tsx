"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Cat as At } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  initials: string
  role: string
}

interface MentionSystemProps {
  users: User[]
  onMention: (user: User) => void
  trigger?: string
}

export function MentionSystem({ users, onMention, trigger = "@" }: MentionSystemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(query.toLowerCase()) || user.email.toLowerCase().includes(query.toLowerCase()),
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % filteredUsers.length)
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length)
          break
        case "Enter":
          e.preventDefault()
          if (filteredUsers[selectedIndex]) {
            onMention(filteredUsers[selectedIndex])
            setIsOpen(false)
            setQuery("")
          }
          break
        case "Escape":
          setIsOpen(false)
          setQuery("")
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, selectedIndex, filteredUsers, onMention])

  const handleInputChange = (value: string) => {
    if (value.includes(trigger)) {
      const mentionIndex = value.lastIndexOf(trigger)
      const mentionQuery = value.slice(mentionIndex + 1)
      setQuery(mentionQuery)
      setIsOpen(true)
      setSelectedIndex(0)
    } else {
      setIsOpen(false)
      setQuery("")
    }
  }

  return (
    <div className="relative">
      {isOpen && filteredUsers.length > 0 && (
        <Card className="absolute bottom-full left-0 w-80 mb-2 z-50 shadow-lg">
          <CardContent className="p-2">
            <div className="space-y-1">
              {filteredUsers.slice(0, 5).map((user, index) => (
                <div
                  key={user.id}
                  className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-colors ${
                    index === selectedIndex ? "bg-muted" : "hover:bg-muted/50"
                  }`}
                  onClick={() => {
                    onMention(user)
                    setIsOpen(false)
                    setQuery("")
                  }}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <At className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export function MentionBadge({ user }: { user: User }) {
  return (
    <Badge variant="secondary" className="inline-flex items-center space-x-1">
      <At className="w-3 h-3" />
      <span>{user.name}</span>
    </Badge>
  )
}
