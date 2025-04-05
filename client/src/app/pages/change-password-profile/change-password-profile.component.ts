import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserStoreService } from '../../services/user-store.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-change-password-profile',
  templateUrl: './change-password-profile.component.html',
  styleUrls: ['./change-password-profile.component.css']
})
export class ChangePasswordProfileComponent implements OnInit {
  error: string = '';
  success: string = '';
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  disableFields: boolean = false;

  constructor(
    private http: HttpClient,
    private userStore: UserStoreService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    const user = this.userStore.getUserValue();
    if (user && user.isGoogleUser) {
      this.disableFields = true;
    }
  }

  handleSubmit(): void {
    if (this.disableFields) {
      this.error = 'Cannot change password for a Google account.';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Passwords do not match.';
      return;
    }
    this.error = '';
    this.success = '';

    const token = localStorage.getItem('auth_token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.post('http://localhost:5000/api/auth/update-password', {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }, { headers }).subscribe({
      next: (res: any) => {
        this.notificationService.show('Password updated successfully!', 'success');
        this.router.navigate(['/userProfile'], { state: { successAlert: 'Password updated successfully' } });
      },
      error: (err) => {
        this.notificationService.show('Error updating password', 'error');
        this.error = err.error.message || 'Error updating password.';
      }
    });
  }

  toggleShowCurrentPassword(): void {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleShowNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleShowConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
