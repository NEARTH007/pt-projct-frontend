import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  emailOrUsername = ''; // เพิ่มตัวแปร
  password = '';        // เพิ่มตัวแปร
  rememberMe = false;   // เพิ่มตัวแปร
  constructor(private authService: AuthService, private router: Router) {}

  login() {
    // ตรวจสอบข้อมูลที่ว่าง
    if (!this.emailOrUsername || !this.password) {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please fill in all fields.',
        icon: 'warning',
        confirmButtonText: 'Okay',
        position: 'center'
      });
      return; // หยุดการทำงานถ้าข้อมูลไม่ครบ
    }
  
    const payload = {
      emailOrUsername: this.emailOrUsername,
      password: this.password,
      rememberMe: this.rememberMe,
    };
  
    this.authService.login(payload).subscribe(
      (response: any) => {
        console.log('Login successful', response);
        localStorage.setItem('token', response.token);
        
        // Using SweetAlert2 to show a success notification
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Login successful!',
          showConfirmButton: false,
          timer: 1500
        });
  
        // Redirecting to the dashboard
        this.router.navigate(['/dashboard/dashboard-iotmap-device']);
      },
      (error) => {
        console.error('Login failed', error);
        // ใช้ SweetAlert2 สำหรับการแจ้งเตือนเมื่อกรอกข้อมูลผิด
        Swal.fire({
          title: 'Login Failed',
          text: error.status === 401 ? 'Invalid credentials. Please check your email/username and password.' : 'Login failed. Please check your connection or try again later.',
          icon: 'error',
          confirmButtonText: 'Retry',
          position: 'center'
        });
      }
    );
  }
}  
