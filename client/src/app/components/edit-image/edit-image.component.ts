import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnnotationService, PolygonViewModel } from '../../services/annotation.service';

@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.css']
})
export class EditImageComponent implements OnInit {
  imageId!: string;
  city!: string;
  imageUrl!: string;
  annotationDescription: string = '';
  dangerLevel: number = 1;

  selectedGeometry: boolean = false;
  selectedPolygonIndex: number | null = null;
  tooltip: { x: number; y: number; label: string } | null = null;
  imageWidth!: number;
  imageHeight!: number;
  displayedWidth!: number;
  displayedHeight!: number;

  polygons: PolygonViewModel[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private annotationService: AnnotationService
  ) {}

  ngOnInit(): void {
    this.city = this.route.snapshot.paramMap.get('city') || '';
    this.imageId = this.route.snapshot.paramMap.get('id') || '';
    this.imageUrl = `http://localhost:5000/api/images/${this.city}/${this.imageId}`;

    this.annotationService.getAnnotation(this.city, this.imageId).subscribe(data => {
      this.imageWidth = data.width;
      this.imageHeight = data.height;
      this.polygons = data.polygons;
    });
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

    this.annotationDescription = this.polygons[index].description;
    this.dangerLevel = this.polygons[index].dangerLevel;
  }

  getPolygonFill(poly: PolygonViewModel): string {
    switch (poly.dangerLevel) {
      case 1: return 'rgba(34,197,94,0.3)';
      case 2: return 'rgba(132,204,22,0.3)';
      case 3: return 'rgba(250,204,21,0.3)';
      case 4: return 'rgba(251,146,60,0.3)';
      case 5: return 'rgba(239,68,68,0.3)';
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

    this.annotationService.saveAnnotation(this.city, this.imageId, this.polygons).subscribe({
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
