import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authService.getUser();
    console.log("🔍 Checking AdminGuard Role:", user);
  
    if (user?.role === 'Admin') {
      return true;
    }

    console.warn("⛔ AdminGuard Blocked Access!");
    this.router.navigate(['/dashboard']); // ✅ เปลี่ยนจาก `/devices` เป็น `/dashboard`
    return false;
  }
}
