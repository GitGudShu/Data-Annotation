import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnotationService, PolygonViewModel } from '../../services/annotation.service';
import { UserStoreService } from '../../services/user-store.service';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.css']
})
export class EditImageComponent implements OnInit {
  imageId!: string;
  city!: string;
  imageUrl!: string;
  annotationDescription: string = '';
  dangerLevel: number = 1;

  selectedGeometry: boolean = false;
  selectedPolygonIndex: number | null = null;
  tooltip: { x: number; y: number; label: string } | null = null;
  imageWidth!: number;
  imageHeight!: number;
  displayedWidth!: number;
  displayedHeight!: number;

  polygons: PolygonViewModel[] = [];
  claimRandomImageIsLoading: boolean = false;

  showModal: boolean = false;
  modalType: 'send' | 'review' | null = null;
  currentUser: any; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private annotationService: AnnotationService,
    private userStore: UserStoreService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Récupération de l'utilisateur courant
    this.userStore.user$.subscribe(user => {
      this.currentUser = user;
    });

    // Si un flag modalOpen persiste (ex. refresh pendant modal), redirige vers home
    if (localStorage.getItem('modalOpen') === 'true') {
      this.router.navigate(['/']);
      localStorage.setItem('modalOpen', 'false');
    }

    this.route.params.subscribe(params => {
      this.city = params['city'];
      this.imageId = params['id'];
      this.imageUrl = `http://localhost:5000/api/images/${this.city}/${this.imageId}`;

      this.annotationService.getAnnotation(this.city, this.imageId).subscribe(data => {
        this.imageWidth = data.width;
        this.imageHeight = data.height;
        this.polygons = data.polygons;
      });
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  goToNextImage(): void {
    this.claimRandomImageIsLoading = true;
    this.userStore.user$.pipe(take(1)).subscribe(user => {
      this.http.post<{ city: string; imageId: string }>(
        'http://localhost:5000/api/annotations/claim-random',
        { userId: user.id }
      ).subscribe({
        next: ({ city, imageId }) => {
          this.claimRandomImageIsLoading = false;
          this.router.navigate(['/edit', city, imageId]);
        },
        error: err => {
          this.claimRandomImageIsLoading = false;
          console.error('No available image:', err);
          alert('No images left to annotate.');
        }
      });
    });
  }

  requestAdminReview(): void {
    // Cette action est réservée aux annotateurs (admin n'a pas accès)
    this.http.patch(`http://localhost:5000/api/annotations/status/${this.imageId}`, {
      status: 1
    }).subscribe(res => {
      console.log('Requesting admin review!', res);
      this.modalType = 'review';
      this.showModal = true;
      localStorage.setItem('modalOpen', 'true');
    });
  }

  sendAnnotation(): void {
    let statusToSend = 2; // Annotateur
    if (this.currentUser && this.currentUser.role === 'admin') {
      statusToSend = 3; // Admin envoie avec status 3
      console.log(statusToSend)
    }

    this.http.patch(`http://localhost:5000/api/annotations/status/${this.imageId}`, {
      status: statusToSend
    }).subscribe({
      next: res => {
        console.log('Image sent!', res);
        if (this.currentUser && this.currentUser.role === 'admin') {
          // Admin : redirection immédiate sans modal
          this.router.navigate(['/ticket-list']);
        } else {
          // Annotateur : ouverture du modal pour choisir Next Image ou Home
          this.modalType = 'send';
          this.showModal = true;
          localStorage.setItem('modalOpen', 'true');
        }
      },
      error: err => {
        console.error('Send failed:', err);
      }
    });
  }

  onPolygonClick(event: MouseEvent, index: number) {
    const svg = (event.target as SVGPolygonElement).ownerSVGElement!;
    const rect = svg.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    if (this.selectedPolygonIndex !== null) {
      this.polygons[this.selectedPolygonIndex].dangerLevel = this.dangerLevel;
      this.polygons[this.selectedPolygonIndex].description = this.annotationDescription;
    }

    if (this.selectedPolygonIndex === index) {
      this.selectedPolygonIndex = null;
      this.selectedGeometry = false;
      this.tooltip = null;
      this.annotationDescription = '';
      this.dangerLevel = 1;
      return;
    }

    this.selectedPolygonIndex = index;
    this.selectedGeometry = true;
    this.tooltip = {
      x: clickX,
      y: clickY,
      label: this.polygons[index].label
    };

    this.annotationDescription = this.polygons[index].description;
    this.dangerLevel = this.polygons[index].dangerLevel;
  }

  getPolygonFill(poly: PolygonViewModel): string {
    switch (poly.dangerLevel) {
      case 1: return 'rgba(34,197,94,0.3)';
      case 2: return 'rgba(132,204,22,0.3)';
      case 3: return 'rgba(250,204,21,0.3)';
      case 4: return 'rgba(251,146,60,0.3)';
      case 5: return 'rgba(239,68,68,0.3)';
      default: return 'rgba(234,234,234,0.77)';
    }
  }

  updateSelectedDangerLevel(level: number): void {
    this.dangerLevel = level;
    if (this.selectedPolygonIndex !== null) {
      this.polygons[this.selectedPolygonIndex].dangerLevel = level;
    }
  }

  saveAnnotation(): void {
    if (this.selectedPolygonIndex !== null) {
      this.polygons[this.selectedPolygonIndex].dangerLevel = this.dangerLevel;
      this.polygons[this.selectedPolygonIndex].description = this.annotationDescription;
    }

    this.annotationService.saveAnnotation(this.city, this.imageId, this.polygons).subscribe({
      next: res => console.log('Annotations saved:', res),
      error: err => console.error('Save failed:', err)
    });
    this.router.navigate(['/']);
  }

  clearForm(): void {
    this.annotationDescription = '';
    this.dangerLevel = 1;
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    this.displayedWidth = img.clientWidth;
    this.displayedHeight = img.clientHeight;
  }

  onModalNext(): void {
    this.showModal = false;
    localStorage.removeItem('modalOpen');
    this.goToNextImage();
  }

  onModalHome(): void {
    this.showModal = false;
    localStorage.removeItem('modalOpen');
    this.router.navigate(['/']);
  }
}