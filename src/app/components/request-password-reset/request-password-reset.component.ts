import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-request-password-reset',
  templateUrl: './request-password-reset.component.html',
  styleUrls: ['./request-password-reset.component.css'],
  standalone: true,
  imports: [FormsModule]  
})
export class RequestPasswordResetComponent {
  email: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  requestPasswordReset() {
    if (!this.email) {
      Swal.fire('Error', 'Please enter your email', 'error');
      return;
    }

    this.authService.requestPasswordReset({ email: this.email }).subscribe(
      (response: any) => {
        Swal.fire({
          title: 'Success!',
          text: 'A reset link has been sent to your email.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/login']); // ✅ เปลี่ยนไปหน้า Login
        });
      },
      (error) => {
        Swal.fire('Error', 'Failed to send reset email. Please try again.', 'error');
      }
    );
  }
}