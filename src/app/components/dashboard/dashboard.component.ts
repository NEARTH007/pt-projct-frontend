import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, NavbarComponent],
})
export class DashboardComponent {
  isSidebarOpen: boolean = true;

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen; // สลับสถานะ Sidebar
  }
}