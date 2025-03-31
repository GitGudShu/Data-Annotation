import { Component } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserStoreService } from '../../services/user-store.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.css']
})
export class GoogleLoginComponent {
  constructor(
    private http: HttpClient,
    private auth: Auth,
    private router: Router,
    private store: UserStoreService
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
                  alert(`Welcome ${user.prenom}`);
                  this.router.navigate(['/imageList']);
                },
                error: () => alert('Failed to load user data')
              });
            },
            error: () => alert('Login failed')
          });
      })
      .catch(err => {
        console.error(err);
        alert('Google login error');
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
              alert(`Welcome ${user.prenom}`);
            },
            error: () => alert('Failed to load user data')
          });
        },
        error: () => alert('Login failed')
      });
  }

}
