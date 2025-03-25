import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { AnnotationComponent } from './pages/annotation/annotation.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { AnnotationFormComponent } from './components/annotation-form/annotation-form.component';
import { TutorialModalComponent } from './components/tutorial-modal/tutorial-modal.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ImageCardComponent } from './components/image-card/image-card.component';
import { ImageIdParserPipe } from './pipes/image-id-parser.pipe';
import { EditImageComponent } from './components/edit-image/edit-image.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';

// firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { environment } from '../environments/environment';
import { GoogleRegisterComponent } from './components/google-register/google-register.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AnnotationComponent,
    AdminPanelComponent,
    AnnotationFormComponent,
    TutorialModalComponent,
    NavbarComponent,
    ImageCardComponent,
    ImageIdParserPipe,
    EditImageComponent,
    UserProfileComponent,
    GoogleRegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonToggleModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
