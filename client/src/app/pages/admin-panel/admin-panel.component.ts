import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  allClasses: string[] = [];
  showClassSelector: boolean = false;
  activeClasses: Set<string> = new Set();
  selectedClasses: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchClasses();
  }

  fetchClasses(): void {
    this.http.get<{ classes: string[] }>('http://localhost:5000/api/annotations/all-labels')
      .subscribe({
        next: (res) => {
          this.allClasses = res.classes;
          this.activeClasses.clear(); // reset on fetch
        },
        error: (err) => console.error('Error fetching classes:', err)
      });
  }

  updateActiveClassOverlay(): void {
    console.log('Active classes:', this.activeClasses);
  }

  toggleClass(label: string): void {
    if (this.activeClasses.has(label)) {
      this.activeClasses.delete(label);
    } else {
      this.activeClasses.add(label);
    }
  }

  saveSelection(): void {
  }

  isActive(label: string): boolean {
    return this.activeClasses.has(label);
  }

  dataSamples: { name: string; classes: string[]; imageCount: number }[] = [];
  isCreateModalOpen = false;

  openCreateModal() {
    this.isCreateModalOpen = true;
  }

  createDataSample(selectedClasses: string[]) {
    this.isCreateModalOpen = false;

    this.http.post('http://localhost:5000/api/samples/create', {
      name: `Sample ${Date.now()}`,
      classes: selectedClasses
    }).subscribe({
      next: (res: any) => {
        this.dataSamples.push({
          name: res.name,
          imageCount: res.imageCount,
          classes: selectedClasses
        });
      },
      error: (err) => console.error('Error creating sample:', err)
    });
  }

}
