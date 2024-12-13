import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  userProfile: any;
  activeMenu: string = 'dashboard'; // Default active menu

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.getUserProfile();
  }

  getUserProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.http
      .get('http://localhost:5006/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .subscribe(
        (response: any) => {
          this.userProfile = response;
        },
        (error) => {
          console.error('Error fetching user profile', error);
          if (error.status === 403 || error.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      );
  }

  setActiveMenu(menu: string): void {
    this.activeMenu = menu; // Update the active menu
  }

  isActive(menu: string): boolean {
    return this.activeMenu === menu; // Check if the menu is active
  }
}
