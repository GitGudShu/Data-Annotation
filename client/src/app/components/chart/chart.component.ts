import { Component, Input, type ElementRef, ViewChild, type AfterViewInit } from "@angular/core"
import type { ChartData } from "../../classes/dashboard"

declare var Chart: any

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.css"],
})
export class ChartComponent implements AfterViewInit {
  @ViewChild("chartCanvas") chartCanvas!: ElementRef<HTMLCanvasElement>
  @Input() chartData: ChartData | null = null
  @Input() title = ""
  @Input() height = 300

  private chart: any

  ngAfterViewInit(): void {
    if (this.chartData) {
      this.renderChart()
    }
  }

  ngOnChanges(): void {
    if (this.chart) {
      this.chart.destroy()
    }

    if (this.chartData && this.chartCanvas) {
      this.renderChart()
    }
  }

  private renderChart(): void {
    if (!this.chartData || !this.chartCanvas) return

    const ctx = this.chartCanvas.nativeElement.getContext("2d")

    // This is a simplified mock implementation
    // In a real app, you would use a proper chart library like Chart.js
    if (ctx) {
      ctx.clearRect(0, 0, this.chartCanvas.nativeElement.width, this.chartCanvas.nativeElement.height)

      // Draw a simple placeholder chart
      const width = this.chartCanvas.nativeElement.width
      const height = this.chartCanvas.nativeElement.height

      if (this.chartData.type === "line") {
        this.drawLinePlaceholder(ctx, width, height)
      } else if (this.chartData.type === "bar") {
        this.drawBarPlaceholder(ctx, width, height)
      }
    }
  }

  private drawLinePlaceholder(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#e5e7eb"
    ctx.moveTo(40, 20)
    ctx.lineTo(40, height - 40)
    ctx.lineTo(width - 20, height - 40)
    ctx.stroke()

    // Draw line
    ctx.beginPath()
    ctx.strokeStyle = "#4f46e5"
    ctx.lineWidth = 2

    const points = [
      { x: 60, y: height - 80 },
      { x: 120, y: height - 120 },
      { x: 180, y: height - 100 },
      { x: 240, y: height - 150 },
      { x: 300, y: height - 160 },
      { x: 360, y: height - 180 },
    ]

    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y)
    }
    ctx.stroke()

    // Draw points
    ctx.fillStyle = "#4f46e5"
    for (const point of points) {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  private drawBarPlaceholder(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#e5e7eb"
    ctx.moveTo(40, 20)
    ctx.lineTo(40, height - 40)
    ctx.lineTo(width - 20, height - 40)
    ctx.stroke()

    // Draw bars
    const barWidth = 30
    const bars = [
      { x: 60, height: 80 },
      { x: 120, height: 120 },
      { x: 180, height: 100 },
      { x: 240, height: 150 },
      { x: 300, height: 130 },
      { x: 360, height: 170 },
    ]

    ctx.fillStyle = "#10b981"
    for (const bar of bars) {
      ctx.fillRect(bar.x - barWidth / 2, height - 40 - bar.height, barWidth, bar.height)
    }
  }
}

