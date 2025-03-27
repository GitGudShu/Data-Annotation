import { Component, OnInit } from '@angular/core';
import { Image } from '../../classes/image';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-imageList',
  templateUrl: './imageList.component.html',
  styleUrls: ['./imageList.component.css']
})
export class ImageListComponent implements OnInit {
  images: Image[] = [];
  selectedCity: string = 'frankfurt'; // Default city

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    this.fetchImages();
  }

  fetchImages(): void {
    this.imageService.getImagesByCity(this.selectedCity).subscribe(images => {
      this.images = images;
    });
  }

}
