import { Component, OnInit } from '@angular/core';
import type { StatCard, ChartData, TableData } from "../../classes/dashboard";
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-tutorial-modal',
  templateUrl: './tutorial-modal.component.html',
  styleUrls: ['./tutorial-modal.component.css']
})
export class TutorialModalComponent implements OnInit {
  statCards: StatCard[] = []
  annotationProgressChart: ChartData | null = null
  userProductivityChart: ChartData | null = null
  recentProjects: TableData | null = null

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getStatCards().subscribe((data) => {
      this.statCards = data
    })

    this.dashboardService.getAnnotationProgressChart().subscribe((data) => {
      this.annotationProgressChart = data
    })

    this.dashboardService.getUserProductivityChart().subscribe((data) => {
      this.userProductivityChart = data
    })

    this.dashboardService.getRecentProjects().subscribe((data) => {
      this.recentProjects = data
    })
  }
}

