import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { UserStoreService } from '../services/user-store.service';

@Injectable({
	providedIn: 'root'
})

export class RoleGuard implements CanActivate {
	constructor(private router: Router, private userStore: UserStoreService) {}

	canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
		const expectedRole = route.data['role'];
		const user = this.userStore.getUserValue();

		if (user?.role === expectedRole) {
			return true;
		}
		return this.router.parseUrl('/login');
	}
}