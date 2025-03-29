import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export interface PolygonData {
  label: string;
  polygon: number[][];
  priority?: number;
  description?: string;
}

export interface PolygonViewModel {
  label: string;
  points: string; // for SVG
  dangerLevel: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class AnnotationService {
  private baseUrl = 'http://localhost:5000/api/annotations';

  constructor(private http: HttpClient) {}

  getAnnotation(city: string, imageId: string): Observable<{ width: number, height: number, polygons: PolygonViewModel[] }> {
    const url = `${this.baseUrl}/${city}/${imageId}?source=active`;
    return this.http.get<any>(url).pipe(
      map(annotation => ({
        width: annotation.imgWidth,
        height: annotation.imgHeight,
        polygons: annotation.objects.map((obj: PolygonData) => ({
          label: obj.label,
          points: obj.polygon.map(p => p.join(',')).join(' '),
          dangerLevel: obj.priority || 1,
          description: obj.description || ''
        }))
      }))
    );
  }

  saveAnnotation(city: string, imageId: string, polygons: PolygonViewModel[]): Observable<any> {
    const annotations = polygons.map(p => ({
      label: p.label,
      polygon: p.points.split(' ').map(pair => pair.split(',').map(Number)),
      dangerLevel: p.dangerLevel,
      description: p.description
    }));

    const url = `${this.baseUrl}/save/${city}/${imageId}`;
    return this.http.post(url, { annotations });
  }
}
