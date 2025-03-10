import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Image } from '../classes/image';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = 'http://localhost:5000/api/image-annotations';

  constructor(private http: HttpClient) {}

  getImagesByCity(cityName: string): Observable<Image[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${cityName}`).pipe(
      map(response => response.map(data => Image.fromMinimalJSON(data)))
    );
  }
}
