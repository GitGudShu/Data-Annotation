import { Component } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserStoreService } from '../../services/user-store.service';
import { NotificationService } from '../../services/notification.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.css']
})
export class GoogleLoginComponent {
  notification: { message: string, type: 'success' | 'error' } | null = null;

  constructor(
    private http: HttpClient,
    private auth: Auth,
    private router: Router,
    private store: UserStoreService,
    private notificationService: NotificationService
  ) { }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();

    signInWithPopup(this.auth, provider)
      .then(result => {
        const email = result.user.email;

        this.http.post<{ token: string }>('http://localhost:5000/api/auth/google-login', { email })
          .subscribe({
            next: (res) => {
              localStorage.setItem('auth_token', res.token);

              this.http.get<any>('http://localhost:5000/api/users/me', {
                headers: { Authorization: `Bearer ${res.token}` }
              }).subscribe({
                next: (user) => {
                  this.store.setUser(user);
                  this.notificationService.show(`Welcome ${user.prenom}`, 'success');
                  this.router.navigate(['']);
                },
                error: () => this.notificationService.show('Failed to load user data :(', 'error')
              });
            },
            error: () => this.notificationService.show('Login failed :(', 'error')
          });
      })
      .catch(err => {
        console.error(err);
        this.notificationService.show('Google login error :(', 'error');
      });
  }

  login(form: NgForm): void {
    const { email, password } = form.value;
    console.log(email, password);
    this.http.post<{ token: string }>('http://localhost:5000/api/auth/login', { email, password })
      .subscribe({
        next: (res) => {
          localStorage.setItem('auth_token', res.token);
          this.http.get<any>('http://localhost:5000/api/users/me', {
            headers: { Authorization: `Bearer ${res.token}` }
          }).subscribe({
            next: (user) => {
              this.store.setUser(user);
              this.router.navigate(['']);
              this.notificationService.show(`Welcome ${user.prenom}`, 'success');
            },
            error: () => this.notificationService.show('Failed to load user data', 'error')
          });
        },
        error: () => this.notificationService.show('Login failed', 'error')
      });
  }

}
