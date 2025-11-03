import { Component, OnInit } from '@angular/core';
import { ProjectModalComponent } from '../project-modal/project-modal.component';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ProjectModalComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

  projects = [
    {
      name: 'CXXGraph',
      desc: 'Header-only C++ graph library with algorithms and utilities.',
      url: 'https://github.com/ZigRazor/CXXGraph',
      longDesc: 'CXXGraph is a modern header-only C++ library that provides graph data structures and optimized implementations of common graph algorithms including Dijkstra and BFS/DFS utilities.'
    },
    {
      name: 'CXXStateTree',
      desc: 'Hierarchical state machine / state tree library for C++.',
      url: 'https://github.com/ZigRazor/CXXStateTree',
      longDesc: 'CXXStateTree focuses on nested states, transitions and optional coroutine-based async handling for complex state-driven systems.'
    }
  ];

  selected: any = null;

  constructor(private title: Title, private meta: Meta) { }

  ngOnInit(): void {
    this.title.setTitle('Projects — ZigRazor Portfolio');
    this.meta.updateTag({
      name: 'description',
      content: 'Project Page for ZigRazor’s professional software engineering portfolio.'
    });
  }



  open(p: any) {
    this.selected = p;
  }

  close() {
    this.selected = null;
  }
}
