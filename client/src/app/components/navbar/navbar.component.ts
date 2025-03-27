import { Component } from '@angular/core';
import { UserStoreService } from '../../services/user-store.service';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})

export class NavbarComponent {
	user$ = this.userStore.user$;
	toggleDropdown = false;
	isMenuOpen = false;

	constructor(private userStore: UserStoreService) {}

	toggleMenu(): void {
		this.isMenuOpen = !this.isMenuOpen;
	}

	handleLogout(): void {
		localStorage.removeItem('auth_token');
		this.userStore.clear();
		location.reload();
	}
}