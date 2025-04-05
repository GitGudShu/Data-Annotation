import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserStoreService } from '../services/user-store.service';
import { AnnotationService } from '../services/annotation.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EditGuard implements CanActivate {
  constructor(
    private userStore: UserStoreService,
    private annotationService: AnnotationService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const currentUser = this.userStore.getUserValue();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return of(false);
    }

    const city = route.paramMap.get('city');
    const imageId = route.paramMap.get('imageId');

    if (!city || !imageId) {
      console.log("cacaaaaa")
      this.router.navigate(['/access-denied']);
      return of(false);
    }

    return this.annotationService.getAnnotation(city, imageId).pipe(
      map(annotation => {
        if (annotation.author) {
          console.log(currentUser.id);
          console.log(annotation.author)
          if (currentUser.id === annotation.author || currentUser.role === 'admin') {
            return true;
          } else {
            this.router.navigate(['/access-denied']);
            return false;
          }
        } else {
          this.router.navigate(['/access-denied']);
          return false;
        }
      }),
      catchError(err => {
        this.router.navigate(['/access-denied']);
        return of(false);
      })
    );
  }
}