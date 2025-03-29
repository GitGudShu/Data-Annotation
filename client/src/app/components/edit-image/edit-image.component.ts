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

  polygons: { label: string, points: string, hovered?: boolean, selected?: boolean, x?: number, y?: number }[] = [];
  selectedGeometry: boolean = false;
  selectedPolygonIndex: number | null = null;
  tooltip: { x: number; y: number; label: string } | null = null;
  imageWidth!: number;
  imageHeight!: number;
  displayedWidth!: number;
  displayedHeight!: number;

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
        points: obj.polygon.map((p: number[]) => p.join(',')).join(' ')
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

    if (this.selectedPolygonIndex === index) {
      this.selectedPolygonIndex = null;
      this.tooltip = null;
    } else {
      this.selectedPolygonIndex = index;
      this.tooltip = {
        x: clickX,
        y: clickY,
        label: this.polygons[index].label
      };
    }
  }


  saveAnnotation(): void {
    console.log('Saving annotation:', {
      imageId: this.imageId,
      city: this.city,
      description: this.annotationDescription,
      dangerLevel: this.dangerLevel
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

