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

  dataSamples: { name: string; classes: string[]; imageCount: number }[] = [];
  isLoadingSamples = true;
  isCreateModalOpen = false;
  annotedCount: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchClasses();
    this.fetchDataSamples();
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

  openCreateModal() {
    this.isCreateModalOpen = true;
  }

  createDataSample(data: { name: string; classes: string[] }): void {
    const payload = {
      name: data.name,
      classes: data.classes
    };

    this.http.post<{ name: string, classes: string[], imageCount: number }>('http://localhost:5000/api/annotations/data-sample', payload)
      .subscribe({
        next: res => {
          this.dataSamples.push(res);
          this.isCreateModalOpen = false;
        },
        error: err => console.error('Sample creation failed:', err)
      });
  }


  fetchDataSamples(): void {
    this.isLoadingSamples = true;
    this.http.get<{ samples: any[] }>('http://localhost:5000/api/annotations/data-samples')
      .subscribe({
        next: res => {
          this.dataSamples = res.samples;
          this.isLoadingSamples = false;
        },
        error: err => {
          console.error('Failed to fetch data samples:', err);
          this.isLoadingSamples = false;
        }
      });
  }


}
