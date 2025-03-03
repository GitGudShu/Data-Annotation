import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnnotationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAnnotations(city: string, imageName: string): Observable<any> {
    const baseImageName = imageName.replace('_leftImg8bit', '');
    return this.http.get(`${this.apiUrl}/annotations/${city}/${baseImageName}`);
  }
}
