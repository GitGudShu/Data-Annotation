import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserStoreService } from '../../services/user-store.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent {
  arrowRightIcon: SafeHtml;
  checkCircleIcon: SafeHtml;
  usersIcon: SafeHtml;
  imageIcon: SafeHtml;
  downloadIcon: SafeHtml;

  annotationIcon: SafeHtml;
  exportIcon: SafeHtml;

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
    private sanitizer: DomSanitizer
	) {
    this.arrowRightIcon = this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>`
    );

    this.checkCircleIcon = this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="m9 11 3 3L22 4"></path></svg>`
    );

    this.usersIcon = this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`
    );

    this.imageIcon = this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>`
    );

    this.downloadIcon = this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>`
    );

    this.annotationIcon = this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`
    );

    this.exportIcon = this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" x2="12" y1="15" y2="3"></line></svg>`
    );
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
