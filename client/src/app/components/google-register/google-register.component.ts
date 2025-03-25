import { Component } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-google-register',
	templateUrl: './google-register.component.html',
	styleUrls: ['./google-register.component.css']
})
export class GoogleRegisterComponent {

	constructor(
		private http: HttpClient,
		private auth: Auth,
	) {}

	registerWithGoogle(): void {
		const provider = new GoogleAuthProvider();

		signInWithPopup(this.auth, provider)
			.then((result) => {
				const user = result.user;

				const userData = {
					nom: user.displayName?.split(' ').slice(-1).join(' ') || 'Name',
					prenom: user.displayName?.split(' ')[0] || 'FirstName',
					email: user.email
				};

				this.http.post<any>('http://localhost:5000/api/auth/google-register', userData)
					.subscribe({
						next: (res) => {
							if (res.message === 'already exists') {
								alert('You are already registered');
							} else if (res.message === 'created') {
								alert('Registration successful');
							} else {
								alert('Unexpected response from server');
							}
						},
						error: (err) => {
							console.error(err);
							alert('Internal server error');
						}
					});
			})
			.catch((error) => {
				console.error('Error connecting with Google:', error);
				alert('Failed Google login');
			});
	}
}