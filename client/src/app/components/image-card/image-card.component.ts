import { Component, Input } from '@angular/core';
import { Image } from '../../classes/image';

@Component({
  selector: 'app-image-card',
  templateUrl: './image-card.component.html',
  styleUrls: ['./image-card.component.css']
})
export class ImageCardComponent {
  @Input() image!: Image;
}
