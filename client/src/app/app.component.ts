import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'client';
  randomImageUrl: string | null = null;
  cities = ['frankfurt', 'lindau', 'munster']; // TODO: This is the cities hardcoded in the server, should be fetched from the server
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadRandomImage();
  }

  loadRandomImage() {
    const randomCity = this.cities[2]; // I'm hardchoosing the third city, Munster for now
    const randomImage = `munster_000001_000019_leftImg8bit.png`; // First image of the dataset

    this.randomImageUrl = `${this.apiUrl}/images/${randomCity}/${randomImage}`;
  }
}
