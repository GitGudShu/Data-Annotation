import { Component, Input } from "@angular/core"

@Component({
  selector: "app-stat-card",
  templateUrl: "./stat-card.component.html",
  styleUrls: ["./stat-card.component.css"],
})
export class StatCardComponent {
  @Input() title = ""
  @Input() value: string | number = ""
  @Input() change = 0
  @Input() icon = ""
  @Input() color = "#4f46e5"
}

