import { Component, OnInit } from "@angular/core";
import { TicketService, DataSample, Ticket } from "../../services/ticket.service";

interface Tab {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: "app-admin-panel",
  templateUrl: "./admin-panel.component.html",
  styleUrls: ["./admin-panel.component.css"],
})
export class AdminPanelComponent implements OnInit {
  allClasses: string[] = [];
  dataSamples: DataSample[] = [];
  tickets: Ticket[] = [];
  activeSampleName: string | null = null;

  isCreateModalOpen = false;
  activeTab = "samples";

  tabs: Tab[] = [
    {
      id: "samples",
      name: "Data Samples",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>`,
    },
    {
      id: "tickets",
      name: "Tickets",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`,
    },
  ];

  constructor(public adminService: TicketService) {}

  ngOnInit(): void {
    this.adminService.fetchAllClasses();
    this.adminService.fetchDataSamples();
    this.adminService.fetchActiveSample();
    this.adminService.fetchTickets();

    this.adminService.allClasses$.subscribe(classes => this.allClasses = classes);
    this.adminService.dataSamples$.subscribe(samples => this.dataSamples = samples);
    this.adminService.activeSample$.subscribe(name => this.activeSampleName = name);
    this.adminService.tickets$.subscribe(tickets => this.tickets = tickets);
  }

  openCreateModal(): void {
    this.isCreateModalOpen = true;
  }

  createDataSample(data: { name: string; classes: string[] }): void {
    this.adminService.createDataSample(data.name, data.classes).subscribe({
      next: () => this.isCreateModalOpen = false,
      error: (err) => console.error("Sample creation failed:", err),
    });
  }

  setActiveSample(sample: DataSample): void {
    this.adminService.setActiveSample(sample.safeName);
  }

  getItemCount(tabId: string): number {
    switch (tabId) {
      case "samples":
        return this.dataSamples.length;
      case "tickets":
        return this.tickets.length;
      default:
        return 0;
    }
  }
}
