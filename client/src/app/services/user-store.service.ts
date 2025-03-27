import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class UserStoreService {
	private userSubject = new BehaviorSubject<any>(null); // null par défaut
	public user$: Observable<any> = this.userSubject.asObservable();

	setUser(user: any): void {
		this.userSubject.next(user);
	}

	clear(): void {
		this.userSubject.next(null);
	}

	getUserValue(): any {
		return this.userSubject.value;
	}
}