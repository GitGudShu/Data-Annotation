import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserStoreService } from '../../services/user-store.service';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent {
  claimRandomImageIsLoading = false;

	constructor(
		private router: Router,
		private userStore: UserStoreService,
    private http: HttpClient
	) {}

	redirectToNext(): void {
		const user = this.userStore.getUserValue();
		if (user) {
			this.claimRandomAndRedirect();
		} else {
			this.router.navigate(['/login']);
		}
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
