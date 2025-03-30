import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UserStoreService } from '../../services/user-store.service'; 

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  previewUrl: SafeUrl | null = null;
  user: any = {
    id: '',
    lastName: '',
    firstName: '',
    email: '',
    avatar: ''
  };

  constructor(
    private http: HttpClient,
    private userStore: UserStoreService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userStore.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.previewUrl = user.avatar || null;
      }
    });
  }

  handleFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const objectUrl = URL.createObjectURL(file);
      this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
    }
  }

  handleSubmit(): void {
    const formData = new FormData();
    const nom = (<HTMLInputElement>document.getElementById('nom')).value;
    const prenom = (<HTMLInputElement>document.getElementById('prenom')).value;
    const email = (<HTMLInputElement>document.getElementById('email')).value;

    formData.append('nom', nom);
    formData.append('firstName', prenom);
    formData.append('email', email);

    const fileInput = (<HTMLInputElement>document.getElementById('avatar'));
    if (fileInput.files && fileInput.files.length > 0) {
      formData.append('avatar', fileInput.files[0]);
    }

    const userId = this.user.id;
    this.http.put(`http://localhost:5000/api/auth/user/${userId}`, formData)
      .subscribe(
        (res: any) => {
          console.log('Update successful', res);
          this.userStore.setUser(res);
          this.router.navigate(['/userProfile'], { state: { successAlert: 'Profile updated successfully' } });
        },
        err => console.error('Error updating profile', err)
      );
  }
}