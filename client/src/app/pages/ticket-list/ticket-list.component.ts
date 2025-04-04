import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Ticket {
  id: string;
  title: string;
  submittedAgo: string;
  polygonsCount: number;
  status: string;
  statusClass: string;
  annotatorName: string;
  annotatorEmail: string;
  imageUrl: string;
  testFolder: string;
  cityFolder: string;
  descriptions: string;
}

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {
  tickets: Ticket[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<{ tickets: Ticket[] }>('http://localhost:5000/api/tickets/getAllTickets')
      .subscribe({
        next: (data) => {
          this.tickets = data.tickets;
        },
        error: (err) => {
          console.error('Error loading tickets', err);
        }
      });
  }
}