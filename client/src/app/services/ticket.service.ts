import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface DataSample {
  name: string;
  safeName: string;
  classes: string[];
  imageCount: number;
  annotedCount: number;
}

export interface Ticket {
  id: string;
  title: string;
  submittedAgo: string;
  polygonsCount: number;
  status: string;
  imageUrl: string;
  cityFolder: string;
  testFolder: string;
  descriptions: string;
  annotatorName: string;
  annotatorEmail: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private dataSamplesSubject = new BehaviorSubject<DataSample[]>([]);
  public ticketsSubject = new BehaviorSubject<Ticket[]>([]);
  private activeSampleSubject = new BehaviorSubject<string | null>(null);
  private classesSubject = new BehaviorSubject<string[]>([]);
  private isLoadingSamplesSubject = new BehaviorSubject<boolean>(false);

  dataSamples$ = this.dataSamplesSubject.asObservable();
  tickets$ = this.ticketsSubject.asObservable();
  activeSample$ = this.activeSampleSubject.asObservable();
  allClasses$ = this.classesSubject.asObservable();
  isLoadingSamples$ = this.isLoadingSamplesSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchAllClasses(): void {
    this.http.get<{ classes: string[] }>('http://localhost:5000/api/annotations/all-labels')
      .subscribe({
        next: (res) => this.classesSubject.next(res.classes),
        error: (err) => console.error('Error fetching classes:', err)
      });
  }

  fetchDataSamples(): void {
    this.isLoadingSamplesSubject.next(true);
    this.http.get<{ samples: DataSample[] }>('http://localhost:5000/api/annotations/data-samples')
      .subscribe({
        next: (res) => {
          this.dataSamplesSubject.next(res.samples);
          this.isLoadingSamplesSubject.next(false);
        },
        error: (err) => {
          console.error('Failed to fetch data samples:', err);
          this.isLoadingSamplesSubject.next(false);
        }
      });
  }


  createDataSample(name: string, classes: string[]): Observable<DataSample> {
    return this.http.post<DataSample>('http://localhost:5000/api/annotations/data-sample', { name, classes }).pipe(
      tap((sample) => {
        const current = this.dataSamplesSubject.value;
        this.dataSamplesSubject.next([...current, sample]);
      })
    );
  }

  fetchActiveSample(): void {
    this.http.get<{ safeName: string }>('http://localhost:5000/api/annotations/data-samples/active-sample')
      .subscribe({
        next: (res) => this.activeSampleSubject.next(res.safeName),
        error: () => console.warn('No active sample set.')
      });
  }

  setActiveSample(safeName: string): void {
    this.http.post('http://localhost:5000/api/annotations/data-samples/active-sample', { safeName })
      .subscribe({
        next: () => this.activeSampleSubject.next(safeName),
        error: (err) => console.error('Failed to set active sample:', err)
      });
  }

  fetchTickets(): void {
    this.http.get<{ tickets: Ticket[] }>('http://localhost:5000/api/tickets/getAllTickets')
      .subscribe({
        next: (res) => this.ticketsSubject.next(res.tickets),
        error: (err) => {
          console.error('Error loading tickets', err);
          this.ticketsSubject.next([]);
        }
      });
  }
}
