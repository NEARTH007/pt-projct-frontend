import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // ✅ เพิ่ม RouterModule

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule], // ✅ เพิ่ม RouterModule ใน imports
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Output() sidebarToggle = new EventEmitter<void>();
  userProfile: any;
  @Input() isSidebarOpen: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.getUserProfile();
  }

  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  getUserProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.http
      .get('http://localhost:5006/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
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
}
