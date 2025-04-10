import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="breadcrumbs">
      <a routerLink="/workspace/welcome">Home</a>
      <span class="separator">/</span>
      <a [routerLink]="parentPath">{{parentLabel}}</a>
      <span class="separator">/</span>
      <span class="current">{{currentLabel}}</span>
    </nav>
  `,
  styles: [`
    .breadcrumbs {
      padding: 1rem 0;
      margin-bottom: 1rem;
    }
    .breadcrumbs a {
      color: #3498db;
      text-decoration: none;
    }
    .breadcrumbs a:hover {
      text-decoration: underline;
    }
    .separator {
      margin: 0 0.5rem;
      color: #666;
    }
    .current {
      color: #666;
    }
  `]
})
export class BreadcrumbsComponent {
  @Input() parentPath: string = '';
  @Input() parentLabel: string = '';
  @Input() currentLabel: string = '';
} 