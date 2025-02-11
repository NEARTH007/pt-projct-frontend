import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule ],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Output() sidebarToggle = new EventEmitter<void>(); // ส่ง Event ไปยัง Dashboard
  userProfile: any;
  @Input() isSidebarOpen: boolean = false; // รับค่าจาก Parent
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.getUserProfile();
  }

  toggleSidebar(): void {
    this.sidebarToggle.emit(); // ส่ง Event เพื่อเปิด/ปิด Sidebar
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