import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserStoreService } from '../services/user-store.service';

@Injectable({
	providedIn: 'root'
})

export class RoleGuard implements CanActivate {
	constructor(private router: Router, private userStore: UserStoreService) {}

	canActivate(route: ActivatedRouteSnapshot): boolean {
		const expectedRole = route.data['role'];
		const user = this.userStore.getUserValue();

		if (!user || user.role !== expectedRole) {
			this.router.navigate(['/login']);
			return false;
		}
		return true;
	}
}