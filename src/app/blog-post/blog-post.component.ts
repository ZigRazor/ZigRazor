// blog-post.component.ts
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';

@Component({
    selector: 'app-blog-post',
    standalone: true,
    imports: [CommonModule, MarkdownModule],
    templateUrl: './blog-post.component.html',
    styleUrls: ['./blog-post.component.scss']
})
export class BlogPostComponent {
    @Input() postPath!: string;

    constructor(private route: ActivatedRoute) {
        this.route.params.subscribe(params => {
            this.postPath = `./assets/_posts/${params['slug']}.md`;
        });
    }
}
