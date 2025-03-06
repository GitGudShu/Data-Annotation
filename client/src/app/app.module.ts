import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { AnnotationComponent } from './pages/annotation/annotation.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { ImageViewerComponent } from './components/image-viewer/image-viewer.component';
import { AnnotationFormComponent } from './components/annotation-form/annotation-form.component';
import { TutorialModalComponent } from './components/tutorial-modal/tutorial-modal.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AnnotationComponent,
    AdminPanelComponent,
    ImageViewerComponent,
    AnnotationFormComponent,
    TutorialModalComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
