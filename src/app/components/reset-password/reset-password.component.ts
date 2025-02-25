import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  standalone: true,
  imports: [FormsModule]  // ✅ เพิ่มตรงนี้
})
export class ResetPasswordComponent implements OnInit {
  token: string = '';
  newPassword: string = '';

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
  }

  resetPassword() {
    if (!this.token || !this.newPassword) {
      Swal.fire('Error', 'Invalid request. Please try again.', 'error');
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe(
      (response) => {
        Swal.fire('Success', 'Your password has been reset successfully.', 'success').then(() => {
          this.router.navigate(['/login']);
        });
      },
      (error) => {
        Swal.fire('Error', 'Failed to reset password. Please try again.', 'error');
      }
    );
  }
}
