import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.css']
})
export class EditImageComponent implements OnInit {
  imageId!: string;
  city!: string;
  imageUrl!: string;
  annotationUrl!: string;
  annotationDescription: string = '';
  dangerLevel: number = 1;

  selectedGeometry: boolean = false;
  selectedPolygonIndex: number | null = null;
  tooltip: { x: number; y: number; label: string } | null = null;
  imageWidth!: number;
  imageHeight!: number;
  displayedWidth!: number;
  displayedHeight!: number;

  polygons: {
    label: string;
    points: string;
    dangerLevel: number;
    description: string;
    hovered?: boolean;
    selected?: boolean;
    x?: number;
    y?: number;
  }[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.city = this.activatedRoute.snapshot.paramMap.get('city') || '';
    this.imageId = this.activatedRoute.snapshot.paramMap.get('id') || '';

    this.imageUrl = `http://localhost:5000/api/images/${this.city}/${this.imageId}`;
    this.annotationUrl = `http://localhost:5000/api/annotations/${this.city}/${this.imageId}?source=active`;

    // Annotation json parsing here
    this.http.get<any>(this.annotationUrl).subscribe(annotation => {
      this.imageWidth = annotation.imgWidth;
      this.imageHeight = annotation.imgHeight;
      this.polygons = annotation.objects.map((obj: any) => ({
        label: obj.label,
        points: obj.polygon.map((p: number[]) => p.join(',')).join(' '),
        dangerLevel: 1, // default aka priority very low
        description: ''
      }));

    });

    console.log('Edit image:', this.city, this.imageId);
    console.log('Image URL:', this.imageUrl);
    console.log('Annotation URL:', this.annotationUrl);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  onPolygonClick(event: MouseEvent, index: number) {
    const svg = (event.target as SVGPolygonElement).ownerSVGElement!;
    const rect = svg.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    if (this.selectedPolygonIndex !== null) {
      this.polygons[this.selectedPolygonIndex].dangerLevel = this.dangerLevel;
      this.polygons[this.selectedPolygonIndex].description = this.annotationDescription;
    }

    if (this.selectedPolygonIndex === index) {
      this.selectedPolygonIndex = null;
      this.selectedGeometry = false;
      this.tooltip = null;
      this.annotationDescription = '';
      this.dangerLevel = 1;
      return;
    }

    this.selectedPolygonIndex = index;
    this.selectedGeometry = true;
    this.tooltip = {
      x: clickX,
      y: clickY,
      label: this.polygons[index].label
    };

    this.annotationDescription = this.polygons[index].description || '';
    this.dangerLevel = this.polygons[index].dangerLevel || 1;
  }


  /**
   * This function is used to get the fill color of the polygon based on its danger level.
   * @param poly Polygon object
   * @param index Index of the polygon
   * @returns The fill color as a string
   */
  getPolygonFill(poly: any): string {
    switch (poly.dangerLevel) {
      case 1: return 'rgba(34,197,94,0.3)';    // green
      case 2: return 'rgba(132,204,22,0.3)';   // lime
      case 3: return 'rgba(250,204,21,0.3)';   // yellow
      case 4: return 'rgba(251,146,60,0.3)';   // orange
      case 5: return 'rgba(239,68,68,0.3)';    // red
      default: return 'rgba(234,234,234,0.77)';
    }
  }

  updateSelectedDangerLevel(level: number): void {
    this.dangerLevel = level;
    if (this.selectedPolygonIndex !== null) {
      this.polygons[this.selectedPolygonIndex].dangerLevel = level;
    }
  }

  saveAnnotation(): void {
    if (this.selectedPolygonIndex !== null) {
      this.polygons[this.selectedPolygonIndex].dangerLevel = this.dangerLevel;
      this.polygons[this.selectedPolygonIndex].description = this.annotationDescription;
    }

    const payload = {
      annotations: this.polygons.map(poly => ({
        label: poly.label,
        polygon: poly.points.split(' ').map(pair => pair.split(',').map(Number)),
        dangerLevel: poly.dangerLevel,
        description: poly.description
      }))
    };

    const url = `http://localhost:5000/api/annotations/save/${this.city}/${this.imageId}`;

    this.http.post(url, payload).subscribe({
      next: res => console.log('Annotations saved:', res),
      error: err => console.error('Save failed:', err)
    });
  }


  clearForm(): void {
    this.annotationDescription = '';
    this.dangerLevel = 1;
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    this.displayedWidth = img.clientWidth;
    this.displayedHeight = img.clientHeight;
  }

}

