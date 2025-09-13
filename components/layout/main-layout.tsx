"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"
import { SettingsModal } from "./settings-modal"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [mode, setMode] = useState<"BASIC" | "PRO" | "ULTIMATE">("PRO")

  return (
    <div className="flex h-screen bg-background">
      <Sidebar mode={mode} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSettingsClick={() => setSettingsOpen(true)} mode={mode} onModeChange={setMode} />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  )
}
