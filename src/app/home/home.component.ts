import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) { }

  ngOnInit(): void {
    this.title.setTitle('Home — ZigRazor Portfolio');
    this.meta.updateTag({
      name: 'description',
      content: 'Welcome to ZigRazor’s professional software engineering portfolio. Explore open-source work and projects.'
    });
  }
}
