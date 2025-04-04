import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserStoreService } from '../../services/user-store.service';

interface AnnotatedImage {
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

interface Ticket {
  id: string;
  title: string;
  submittedAgo: string;
  polygonsCount: number;
  status: string;
  statusClass: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  profile: any = {};
  successAlert: string = '';
  
  editableImages: AnnotatedImage[] = [];
  archivedImages: AnnotatedImage[] = [];
  tickets: Ticket[] = [];

  constructor(
    private http: HttpClient,
    private userStore: UserStoreService
  ) { }

  ngOnInit(): void {
    if (history.state && history.state.successAlert) {
      this.successAlert = history.state.successAlert;
      setTimeout(() => {
        this.successAlert = '';
      }, 2000);
    }

    this.userStore.user$.subscribe(user => {
      if (user) {
        this.profile = {
          lastName: user.nom,
          firstName: user.prenom,
          email: user.email,
          photoUrl: user.avatar || '/'
        };

        // Appel au backend pour récupérer les images détaillées de l'utilisateur
        this.http.get<{ editableImages: AnnotatedImage[], archivedImages: AnnotatedImage[], tickets: Ticket[] }>(`http://localhost:5000/api/images/getImagesDetails/${user.id}`)
          .subscribe({
            next: (data) => {
              this.editableImages = data.editableImages;
              this.archivedImages = data.archivedImages;
              this.tickets = data.tickets;
            },
            error: (err) => {
              console.error('Erreur lors du chargement des images détaillées', err);
            }
          });
      }
    });
  }
}