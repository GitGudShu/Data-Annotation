import { Component } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserStoreService } from '../../services/user-store.service';

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
  ) {}

  // Connexion via Google
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
                  this.router.navigate(['/dashboard']);
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

  // Fonction de connexion classique (mock)
  login(event: Event) {
    event.preventDefault(); // Empêche la soumission classique du formulaire

    // Pour une implémentation réelle, privilégiez ReactiveFormsModule ou [(ngModel)].
    const emailInput = (document.getElementById('email') as HTMLInputElement);
    const passwordInput = (document.getElementById('password') as HTMLInputElement);
    const email = emailInput.value;
    const password = passwordInput.value;

    // Ici, nous simulons une connexion classique.
    if (email && password) {
      // Vous pourriez appeler un service HTTP pour vérifier les identifiants.
      alert(`Logged in as ${email} (mock)`);
      // Par exemple, naviguer vers le dashboard :
      this.router.navigate(['/dashboard']);
    } else {
      alert('Please enter email and password');
    }
  }
}