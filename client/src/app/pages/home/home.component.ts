import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserStoreService } from '../../services/user-store.service';
import { HttpClient } from '@angular/common/http';
import { IconService } from '../../services/icon.service';


@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent {

  icons: { [key: string]: any };

  howItWorksCards = [
    {
      icon: 'users',
      title: '1. Sign Up',
      description: 'Create an account to access our annotation platform'
    },
    {
      icon: 'annotation',
      title: '2. Annotate',
      description: 'Classify polygon criticality on images with our intuitive interface'
    },
    {
      icon: 'export',
      title: '3. Validate or Submit',
      description: 'You can validate your annotations yourself or submit them for admin approval.'
    }
  ];

  // Données pour les fonctionnalités
  features = [
    'Multiple criticality levels for precise classification',
    'Intuitive polygon selection and editing tools',
    'Collaborative annotation with team management',
    'Quality control and verification workflows'
  ];
  
  claimRandomImageIsLoading = false;

	constructor(
		private router: Router,
		private userStore: UserStoreService,
    private http: HttpClient,
    private iconService: IconService
	) {
    this.icons = this.iconService.getIcons();
  }

	redirectToNext(): void {
		const user = this.userStore.getUserValue();
		if (user) {
			this.claimRandomAndRedirect();
		} else {
			this.router.navigate(['/login']);
		}
	}

  redirectToDemo(): void {
    this.router.navigate(['/demo']);
  }

  claimRandomAndRedirect(): void {
    this.claimRandomImageIsLoading = true;

    this.userStore.user$.subscribe(user => {
      this.http.post<{ city: string; imageId: string }>(
        'http://localhost:5000/api/annotations/claim-random',
        { userId: user.id }
      ).subscribe({
        next: ({ city, imageId }) => {
          this.claimRandomImageIsLoading = false;
          this.router.navigate(['/edit', city, imageId]);
        },
        error: err => {
          console.error('No available image:', err);
          alert('No images left to annotate.');
        }
      });
    });
  }

}
