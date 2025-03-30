import { Component, OnInit } from '@angular/core';
import { UserStoreService } from '../../services/user-store.service';

interface AnnotatedImage {
  id: string;
  title: string;
  badge: string;
  badgeClass: string;
  submittedAgo: string;
  annotatorName: string;
  annotatorInitials: string;
  polygonsCount: number;
  validationStatus: string;
  validationStatusClass: string;
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

  annotatedImages: AnnotatedImage[] = [
    {
      id: 'IMG-001',
      title: 'Image Satellite Annotation',
      badge: 'Moyen',
      badgeClass: 'bg-blue-500',
      submittedAgo: 'Soumis il y a 3 jours',
      annotatorName: 'Jean Dupont',
      annotatorInitials: 'JD',
      polygonsCount: 8,
      validationStatus: 'Validé',
      validationStatusClass: 'text-green-500'
    },
    {
      id: 'IMG-002',
      title: 'Document Médical Annotation',
      badge: 'Urgent',
      badgeClass: 'bg-red-500',
      submittedAgo: 'Soumis il y a 1 jour',
      annotatorName: 'Jean Dupont',
      annotatorInitials: 'JD',
      polygonsCount: 5,
      validationStatus: 'En attente de validation',
      validationStatusClass: 'text-yellow-500'
    }
  ];

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

  constructor(private userStore: UserStoreService) { }

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
      }
    });
  }
}