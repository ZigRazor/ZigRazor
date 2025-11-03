import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) { }

  ngOnInit(): void {
    this.title.setTitle('About — ZigRazor Portfolio');
    this.meta.updateTag({
      name: 'description',
      content: 'About Page for ZigRazor’s professional software engineering portfolio.'
    });
  }
}