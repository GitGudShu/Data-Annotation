import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { UserStoreService } from './user-store.service';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private apiUrl = 'http://localhost:5000/api';

	constructor(
		private http: HttpClient,
		private userStore: UserStoreService
	) {}

	// Initialisation de l'authentification au lancement de l'application
	initAuth(): void {
		const token = localStorage.getItem('auth_token');

		if (token) {
			const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

			this.http.get<any>(`${this.apiUrl}/users/me`, { headers }).subscribe({
				next: (user) => {
					this.userStore.setUser(user);
				},
				error: (err) => {
					console.warn('Invalid token, clearing session.');
					localStorage.removeItem('auth_token');
					this.userStore.clear();
				}
			});
		}
	}

	// Connexion utilisateur (email + password)
	login(credentials: { email: string; password: string }): Observable<any> {
		return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
			tap((res) => {
				if (res.token && res.user) {
					localStorage.setItem('auth_token', res.token);
					this.userStore.setUser(res.user);
				}
			}),
			catchError((error) => {
				console.error('Login failed:', error);
				return of(null);
			})
		);
	}

	// Déconnexion
	logout(): void {
		localStorage.removeItem('auth_token');
		this.userStore.clear();
	}
}