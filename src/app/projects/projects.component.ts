import { Component } from '@angular/core';
import { ProjectModalComponent } from '../project-modal/project-modal.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [ProjectModalComponent],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent {
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

  open(p: any) {
    this.selected = p;
  }

  close() {
    this.selected = null;
  }
}
