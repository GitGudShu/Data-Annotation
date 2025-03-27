import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditImageComponent } from './components/edit-image/edit-image.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { GoogleRegisterComponent } from './components/google-register/google-register.component';
import { GoogleLoginComponent } from './components/google-login/google-login.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'dashboard', component: AdminPanelComponent},
  { path: 'userProfile', component: UserProfileComponent},
  { path: 'edit/:city/:id', component: EditImageComponent },
  { path: 'register', component: GoogleRegisterComponent },
	{ path: 'login', component: GoogleLoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
