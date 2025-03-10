import { Component, OnInit } from '@angular/core';
import { Image } from '../../classes/image';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
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
