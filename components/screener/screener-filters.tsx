"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Filter, RotateCcw } from "lucide-react"

export function ScreenerFilters() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Market Cap</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="mega">Mega Cap (&gt;$200B)</SelectItem>
                <SelectItem value="large">Large Cap ($10B-$200B)</SelectItem>
                <SelectItem value="mid">Mid Cap ($2B-$10B)</SelectItem>
                <SelectItem value="small">Small Cap ($300M-$2B)</SelectItem>
                <SelectItem value="micro">Micro Cap (&lt;$300M)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Sector</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="financials">Financials</SelectItem>
                <SelectItem value="consumer-discretionary">Consumer Discretionary</SelectItem>
                <SelectItem value="industrials">Industrials</SelectItem>
                <SelectItem value="energy">Energy</SelectItem>
                <SelectItem value="materials">Materials</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Price Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Min" type="number" />
              <Input placeholder="Max" type="number" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>P/E Ratio</Label>
            <Slider defaultValue={[0, 50]} max={100} min={0} step={1} className="w-full" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>50</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Volume (Avg 30d)</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="high">High (&gt;10M)</SelectItem>
                <SelectItem value="medium">Medium (1M-10M)</SelectItem>
                <SelectItem value="low">Low (&lt;1M)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Dividend Yield</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="high">High (&gt;4%)</SelectItem>
                <SelectItem value="medium">Medium (2%-4%)</SelectItem>
                <SelectItem value="low">Low (0%-2%)</SelectItem>
                <SelectItem value="none">No Dividend</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1">Apply Filters</Button>
            <Button variant="outline" size="icon">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Saved Screens</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {["High Dividend", "Growth Stocks", "Value Plays", "Momentum"].map((screen) => (
            <Button key={screen} variant="outline" className="w-full justify-start bg-transparent">
              {screen}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
