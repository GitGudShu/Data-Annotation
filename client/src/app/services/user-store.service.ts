import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class UserStoreService {
	private user: any = null;

	setUser(userData: any) {
		this.user = userData;
	}

	getUser() {
		return this.user;
	}

	clear() {
		this.user = null;
	}
}