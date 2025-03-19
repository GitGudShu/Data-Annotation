import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageService } from 'src/app/services/image.service';
import { Image } from 'src/app/classes/image';

@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.css']
})
export class EditImageComponent implements OnInit {
  imageId!: string;
  city!: string;
  image!: Image; // Store image data
  annotationDescription: string = '';
  dangerLevel: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private imageService: ImageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.city = this.activatedRoute.snapshot.paramMap.get('city') || '';
    this.imageId = this.activatedRoute.snapshot.paramMap.get('id') || '';

    console.log('Fetching image:', this.city, this.imageId);

    if (this.city && this.imageId) {
      this.imageService.getImageById(this.city, this.imageId).subscribe(image => {
        this.image = image;
        console.log('Image data loaded:', this.image);
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  // Save annotation (replace with actual backend call)
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
}
