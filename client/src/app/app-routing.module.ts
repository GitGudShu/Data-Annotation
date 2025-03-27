import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditImageComponent } from './components/edit-image/edit-image.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { GoogleRegisterComponent } from './components/google-register/google-register.component';
import { GoogleLoginComponent } from './components/google-login/google-login.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
	{ path: '', component: HomeComponent, canActivate: [AuthGuard] },
	{ path: 'userProfile', component: UserProfileComponent, canActivate: [AuthGuard] },
	{ path: 'dashboard', component: AdminPanelComponent, canActivate: [RoleGuard], data: { role: 'admin' } },
  { path: 'edit/:city/:id', component: EditImageComponent, canActivate: [AuthGuard] },
	{ path: 'register', component: GoogleRegisterComponent },
	{ path: 'login', component: GoogleLoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
