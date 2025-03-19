import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EditImageComponent } from './components/edit-image/edit-image.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'edit/:city/:id', component: EditImageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
