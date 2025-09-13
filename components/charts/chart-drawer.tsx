"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface ChartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChartDrawer({ open, onOpenChange }: ChartDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Chart Settings</SheetTitle>
          <SheetDescription>Customize your chart appearance and behavior</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          <div className="space-y-4">
            <h4 className="font-medium">Appearance</h4>

            <div className="flex items-center justify-between">
              <Label htmlFor="grid">Show Grid</Label>
              <Switch id="grid" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="crosshair">Crosshair</Label>
              <Switch id="crosshair" defaultChecked />
            </div>

            <div className="space-y-2">
              <Label>Chart Theme</Label>
              <Select defaultValue="dark">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Data</h4>

            <div className="flex items-center justify-between">
              <Label htmlFor="extended-hours">Extended Hours</Label>
              <Switch id="extended-hours" />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="dividends">Show Dividends</Label>
              <Switch id="dividends" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="splits">Show Splits</Label>
              <Switch id="splits" defaultChecked />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Performance</h4>

            <div className="space-y-2">
              <Label>Max Data Points</Label>
              <Slider defaultValue={[1000]} max={5000} min={100} step={100} className="w-full" />
              <div className="text-xs text-muted-foreground">1000 points</div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-refresh">Auto Refresh</Label>
              <Switch id="auto-refresh" defaultChecked />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
