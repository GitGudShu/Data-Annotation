import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  prenom: string;
  nom: string;
  email: string;
  avatar?: string;
}

export interface AnnotatedImage {
  testFolder: string;
  cityFolder: string;
  fileName: string;
  labelCount: number;
  descriptions: string;
  imageUrl: string;
  imgHeight?: number;
  imgWidth?: number;
  author?: number;
  status: number | null;
}

export interface Ticket {
  id: string;
  title: string;
  submittedAgo: string;
  polygonsCount: number;
  status: string;
  statusClass: string;
}

export interface Tab {
  id: string
  name: string
  icon: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getImageDetails(userId: number): Observable<{ editableImages: AnnotatedImage[]; archivedImages: AnnotatedImage[]; tickets: Ticket[] }> {
    return this.http.get<{ editableImages: AnnotatedImage[]; archivedImages: AnnotatedImage[]; tickets: Ticket[] }>(
      `http://localhost:5000/api/images/getImagesDetails/${userId}`
    );
  }

  tabs: Tab[] = [
    {
      id: "editable",
      name: "Pending Images",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path><path d="m15 5 4 4"></path></svg>`,
    },
    {
      id: "annotated",
      name: "Annotated Images",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>`,
    },
    {
      id: "tickets",
      name: "Tickets",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>`,
    },
  ]
}
