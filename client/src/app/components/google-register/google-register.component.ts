import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-google-register',
	templateUrl: './google-register.component.html',
	styleUrls: ['./google-register.component.css']
})
export class GoogleRegisterComponent {
	selectedAvatar: File | null = null;
	avatarPreview: string | ArrayBuffer | null = null;

	constructor(
		private http: HttpClient,
		private auth: Auth,
    private router: Router,
    private notificationService: NotificationService
	) { }

	registerWithGoogle(): void {
		const provider = new GoogleAuthProvider();

		signInWithPopup(this.auth, provider)
			.then((result) => {
				const user = result.user;
				const userData = {
					nom: user.displayName?.split(' ').slice(-1).join(' ') || 'Name',
					prenom: user.displayName?.split(' ')[0] || 'FirstName',
					email: user.email,
					avatar: user.photoURL
				};

				this.http.post<any>('http://localhost:5000/api/auth/google-register', userData)
					.subscribe({
						next: (res) => {
							if (res.message === 'already exists') {
                this.notificationService.show('You are already registered', 'error');
              } else if (res.message === 'created') {
                this.notificationService.show('Registration successful', 'success');
              } else {
                this.notificationService.show('Unexpected response from server', 'error');
              }
						},
						error: (err) => {
							console.error(err);
							this.notificationService.show('Registration failed', 'error');
						}
					});
			})
			.catch((error) => {
				if (error.code === 'auth/cancelled-popup-request') {
				  console.warn('La connexion via popup a été annulée par l\'utilisateur.');
				} else {
				  console.error('Error connecting with Google:', error);
				  this.notificationService.show('Google login error :(', 'error');
				}
			  });
	}

	onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			this.selectedAvatar = input.files[0];
		} else {
			this.selectedAvatar = null;
		}
	}

	onSubmit(form: NgForm): void {
		const formData = new FormData();
		formData.append('firstName', form.value.firstName);
		formData.append('lastName', form.value.lastName);
		formData.append('email', form.value.email);
		formData.append('password', form.value.password);
		formData.append('confirmPassword', form.value.confirmPassword);

		if (this.selectedAvatar) {
			formData.append('avatar', this.selectedAvatar);
		}

		this.http.post<any>('http://localhost:5000/api/auth/register', formData)
			.subscribe({
				next: (res) => {
					console.log('Registration successful', res);
          this.router.navigate(['']);
					this.notificationService.show('Registration successful', 'success');
				},
				error: (err) => {
					console.error(err);
					this.notificationService.show('Registration failed', 'error');
				}
			});
	}
}
