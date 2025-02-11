import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  imports: [CommonModule, RouterModule], 
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() isSidebarOpen: boolean = true;
  activeMenu: string = 'dashboard';

  constructor(private authService: AuthService, private router: Router) {}

  setActiveMenu(menu: string): void {
    this.activeMenu = menu;
  }

  isActive(menu: string): boolean {
    return this.activeMenu === menu;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        localStorage.removeItem('token'); // Clear token
        this.router.navigate(['/login']); // Navigate to login
      },
      error: (error) => {
        console.error('Logout failed:', error);
        alert('Logout failed. Please try again.');
      },
    });
  }
}
