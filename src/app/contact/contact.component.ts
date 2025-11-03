import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  constructor(private title: Title, private meta: Meta) { }

  ngOnInit(): void {
    this.title.setTitle('Contact — ZigRazor Portfolio');
    this.meta.updateTag({
      name: 'description',
      content: 'Contact Page for ZigRazor’s professional software engineering portfolio.'
    });
  }
}

