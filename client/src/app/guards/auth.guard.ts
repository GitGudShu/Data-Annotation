import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserStoreService } from '../services/user-store.service';

@Injectable({
	providedIn: 'root'
})

export class AuthGuard implements CanActivate {
	constructor(private router: Router, private userStore: UserStoreService) {}

	canActivate(): boolean {
		const user = this.userStore.getUserValue();
		if (!user) {
			this.router.navigate(['/']);
			return false;
		}
		return true;
	}
}