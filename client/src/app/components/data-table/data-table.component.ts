import { Component, Input } from "@angular/core"
import type { TableData } from "../../classes/dashboard"

@Component({
  selector: "app-data-table",
  templateUrl: "./data-table.component.html",
  styleUrls: ["./data-table.component.css"],
})
export class DataTableComponent {
  @Input() tableData: TableData | null = null
  @Input() title = ""
}

