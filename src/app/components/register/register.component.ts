import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, ReactiveFormsModule, RouterModule, CommonModule] // Add CommonModule here
})
export class RegisterComponent {
  user = {
    email: '',
    username: '',
    password: '',
    first_name: '',
    last_name: ''
  };
  profileImage: File | null = null;
  previewImage: string | ArrayBuffer | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileImage = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target?.result ?? null;
      };
      reader.readAsDataURL(file);
    }
  }

  register() {
    if (!this.user.email || !this.user.username || !this.user.password || !this.user.first_name || !this.user.last_name || !this.profileImage) {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please fill out all fields and upload a profile image.',
        icon: 'warning',
        confirmButtonText: 'Okay'
      });
      return;
    }

    const formData = new FormData();
    formData.append('email', this.user.email);
    formData.append('username', this.user.username);
    formData.append('password', this.user.password);
    formData.append('first_name', this.user.first_name);
    formData.append('last_name', this.user.last_name);
    formData.append('role', 'User');
    formData.append('profile_image', this.profileImage);

    this.authService.register(formData).subscribe(
      response => {
        Swal.fire({
          title: 'Registration Successful!',
          text: 'You can now log in with your credentials.',
          icon: 'success',
          confirmButtonText: 'Go to Login',
          timer: 2000
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error => {
        Swal.fire({
          title: 'Registration Failed',
          text: error.error?.message || 'Please try again.',
          icon: 'error',
          confirmButtonText: 'Retry'
        });
      }
    );
  }
}
