"use client"

import { Search, Settings, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/theme-toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface HeaderProps {
  onSettingsClick: () => void
  mode: "BASIC" | "PRO" | "ULTIMATE"
  onModeChange: (mode: "BASIC" | "PRO" | "ULTIMATE") => void
}

export function Header({ onSettingsClick, mode, onModeChange }: HeaderProps) {
  return (
    <header className="border-b bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Stock Analysis Portal (Local)</h1>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="gap-1">
                  <Activity className="h-3 w-3 text-green-500" />
                  System Status
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <div>Last EOD: 2024-01-15 16:00 EST</div>
                  <div>FMP Calls Today: 1,247 / 5,000</div>
                  <div>Status: All systems operational</div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search symbols (AAPL, MSFT...)" className="w-64 pl-9" />
          </div>

          <Select value={mode} onValueChange={onModeChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BASIC">BASIC</SelectItem>
              <SelectItem value="PRO">PRO</SelectItem>
              <SelectItem value="ULTIMATE">ULTIMATE</SelectItem>
            </SelectContent>
          </Select>

          <ModeToggle />

          <Button variant="outline" size="sm" onClick={onSettingsClick}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </header>
  )
}
