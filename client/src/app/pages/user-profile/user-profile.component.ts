import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserStoreService } from '../../services/user-store.service';

interface AnnotatedImage {
  testFolder: string;
  cityFolder: string;
  fileName: string;
  labelCount: number;
  imageUrl: string;
  descriptions: string; 
}

interface Ticket {
  id: string;
  title: string;
  badge: string;
  badgeClass: string;
  submittedAgo: string;
  annotatorName: string;
  annotatorInitials: string;
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

  annotatedImages: AnnotatedImage[] = []

  ticketsHistory: Ticket[] = [
    {
      id: 'TKT-001',
      title: 'Panneau de Signalisation',
      badge: 'Urgent',
      badgeClass: 'bg-red-500',
      submittedAgo: 'Soumis il y a 2 heures',
      annotatorName: 'Alex Johnson',
      annotatorInitials: 'AJ',
      polygonsCount: 5,
      status: 'En attente de validation',
      statusClass: 'text-yellow-500'
    },
    {
      id: 'TKT-002',
      title: 'Image Aérienne',
      badge: 'Moyen',
      badgeClass: 'bg-blue-500',
      submittedAgo: 'Soumis il y a 1 jour',
      annotatorName: 'Jean Dupont',
      annotatorInitials: 'JD',
      polygonsCount: 3,
      status: 'Envoyé',
      statusClass: 'text-blue-500'
    }
  ];

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

        // Appeler le backend pour récupérer les images annotées pour l'utilisateur
        // On suppose que l'objet user contient un champ id
        this.http.get<AnnotatedImage[]>(`http://localhost:5000/api/images/getImagesForUser/${user.id}`)
          .subscribe({
            next: (images) => {
              this.annotatedImages = images;
            },
            error: (err) => {
              console.error('Erreur lors du chargement des images annotées', err);
            }
          });
      }
    });
  }
}