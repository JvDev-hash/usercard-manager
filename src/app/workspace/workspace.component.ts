import { Component, Inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent {
  isMenuOpen = false;
  activeSubmenu: string | null = null;
  userName: string = '';

  constructor(private router: Router, @Inject(DOCUMENT) private document: Document) {
    const localStorage = document.defaultView?.localStorage;
    const userData = localStorage?.getItem('nome');
    if (userData) {
      this.userName = userData || '';
    }
  }

  logout() {
    // Clear any session data if needed
    localStorage.clear();
    // Navigate back to login
    this.router.navigate(['/login']);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (!this.isMenuOpen) {
      this.activeSubmenu = null;
    }
  }

  toggleSubmenu(submenu: string) {
    this.activeSubmenu = this.activeSubmenu === submenu ? null : submenu;
  }

  handleMenuItemClick() {
    // Close menu on mobile when clicking a menu item
    if (window.innerWidth <= 768) {
      this.isMenuOpen = false;
      this.activeSubmenu = null;
    }
  }
}
