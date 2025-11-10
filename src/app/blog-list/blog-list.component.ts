// blog-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
    selector: 'app-blog-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './blog-list.component.html',
    styleUrls: ['./blog-list.component.scss']

})
export class BlogListComponent implements OnInit {

    posts = [
        { title: 'Analyzing Network Infrastructure Vulnerabilities with CXXGraph: A Practical Guide', slug: 'article_network_analysis' },
        { title: 'Building Intelligent Game AI with CXXGraph: From Grid Pathfinding to Strategic Navigation', slug: 'article_pathfinding' }
    ];

    constructor(private title: Title, private meta: Meta,) { }


    ngOnInit(): void {
        this.title.setTitle('Blog — ZigRazor Portfolio');
        this.meta.updateTag({
            name: 'description',
            content: 'Blog List Page for ZigRazor’s professional software engineering portfolio.'
        });

        console.log(this.posts)
    }
}
