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

  dataSamples: {
    name: string;
    safeName: string;
    classes: string[];
    imageCount: number;
    annotedCount: number;
  }[] = [];

  isLoadingSamples = true;
  isCreateModalOpen = false;
  annotedCount: number = 0;

  activeSampleName: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchClasses();
    this.fetchDataSamples();
    this.fetchActiveSample();
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

    this.http.post<{ name: string, safeName: string, classes: string[], imageCount: number, annotedCount: number }>(
      'http://localhost:5000/api/annotations/data-sample',
      payload
    ).subscribe({
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

  fetchActiveSample(): void {
    this.http.get<{ safeName: string }>('http://localhost:5000/api/annotations/data-samples/active-sample')
      .subscribe({
        next: res => {
          this.activeSampleName = res.safeName;
          console.log("✅ Active sample name set to:", this.activeSampleName); // ← Now correct
        },
        error: err => console.warn('No active sample set yet.')
      });
  }

  setActiveSample(sample: any): void {
    console.log("Setting active class: ", sample.safeName);
    this.http.post('http://localhost:5000/api/annotations/data-samples/active-sample', { safeName: sample.safeName })
      .subscribe({
        next: () => this.activeSampleName = sample.safeName,
        error: err => console.error('Failed to set active sample:', err)
      });
  }


}
