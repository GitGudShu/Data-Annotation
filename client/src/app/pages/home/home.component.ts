import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserStoreService } from '../../services/user-store.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent {
	constructor(
		private router: Router,
		private userStore: UserStoreService
	) {}

	redirectToNext(): void {
		const user = this.userStore.getUserValue();
		if (user) {
			this.router.navigate(['/imageList']);
		} else {
			this.router.navigate(['/login']);
		}
	}
}