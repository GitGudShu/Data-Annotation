import { Component, Input } from '@angular/core';
import { Image } from '../../classes/image';
import { Router } from '@angular/router';

@Component({
  selector: 'app-image-card',
  templateUrl: './image-card.component.html',
  styleUrls: ['./image-card.component.css']
})
export class ImageCardComponent {
  @Input() image!: Image;
  hover: boolean = false;

  constructor(private router: Router) {}

  toEdit(): void {
    console.log('Navigating to image ID:', this.image.id);
    this.router.navigate(['/edit', this.image.city, this.image.id]);
  }
}
