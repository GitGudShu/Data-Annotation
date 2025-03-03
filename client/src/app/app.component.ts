import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AnnotationService } from './services/annotation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('overlayCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  randomImageUrl: string | null = null;
  annotationData: any = null;
  cities = ['frankfurt', 'lindau', 'munster'];
  apiUrl = environment.apiUrl;
  selectedCity = '';
  selectedImage = '';

  constructor(private http: HttpClient, private annotationService: AnnotationService) {}

  ngOnInit() {
    this.loadRandomImage();
  }

  ngAfterViewInit() {
    if (this.annotationData) {
      this.drawAnnotations();
    }
  }

  loadRandomImage() {
    this.selectedCity = this.cities[2]; // Temporarily hardcoding city (munster)
    this.selectedImage = `munster_000001_000019`; // Temporarily hardcoding image name (munster_000001_000019)
    this.randomImageUrl = `${this.apiUrl}/images/${this.selectedCity}/${this.selectedImage}`;

    // Fetch annotation data
    this.annotationService.getAnnotations(this.selectedCity, this.selectedImage).subscribe(
      (data) => {
        console.log('✅ Annotation data:', data);
        this.annotationData = data;

        // Wait a little bit for the canvas to be rendered
        setTimeout(() => {
          this.drawAnnotations();
        }
        , 500);
      },
      (error) => console.error('❌ Failed to load annotations:', error)
    );
  }

  drawAnnotations() {
    if (!this.annotationData || !this.canvasRef) {
      console.warn("❌ Missing annotation data or canvas element.");
      return;
    }

    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn("❌ Could not get 2D context from canvas.");
      return;
    }

    const imgElement = document.querySelector('.city-image') as HTMLImageElement;
    if (imgElement) {
      canvas.width = imgElement.clientWidth;
      canvas.height = imgElement.clientHeight;
    } else {
      console.warn("❌ Could not find image element.");
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.5; // Opacity parameter
    ctx.lineWidth = 2;

    this.annotationData.objects.forEach((obj: any, objIndex: number) => {
      console.log(`🎨 Drawing object ${objIndex}:`, obj);
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
      ctx.strokeStyle = 'red';

      obj.polygon.forEach((point: number[], index: number) => {
        if (index === 0) {
          ctx.moveTo(point[0], point[1]);
        } else {
          ctx.lineTo(point[0], point[1]);
        }
      });

      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

    console.log("✅ Annotations drawn.");
  }
}
