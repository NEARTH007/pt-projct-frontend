import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userProfile: any = {
    id: '',
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    profilePicture: '',
    role: '', // เพิ่ม Role
  };
  selectedFile: File | null = null;
  previewImage: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.getUserProfile();
  }

  getUserProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire('Error', 'No token found. Please log in again.', 'error');
      return;
    }

    this.authService.getUserProfile().subscribe(
      (response: any) => {
        this.userProfile = {
          id: response.id,
          username: response.username,
          firstName: response.first_name,
          lastName: response.last_name,
          email: response.email,
          profilePicture: response.profile_image,
          role: response.role, // ดึง Role จาก API
        };
      },
      (error) => {
        Swal.fire('Error', 'Failed to fetch profile data.', 'error');
      }
    );
  }

  isImageModalOpen = false;
selectedImage: string = '';

openImageModal(imagePath: string) {
  this.selectedImage = imagePath.startsWith('http')
    ? imagePath
    : 'http://localhost:5006/uploads/' + imagePath;
  this.isImageModalOpen = true;
}

closeImageModal() {
  this.isImageModalOpen = false;
}


  onFileSelected(event: any) {
    this.selectedFile = event.target.files?.[0] || null;
    const reader = new FileReader();
    reader.onload = (e: any) => (this.previewImage = e.target.result);
    if (this.selectedFile) {
      reader.readAsDataURL(this.selectedFile);
    }
  }

  updateProfile() {
    const formData = new FormData();
    formData.append('username', this.userProfile.username || '');
    formData.append('email', this.userProfile.email || '');
    formData.append('first_name', this.userProfile.firstName || '');
    formData.append('last_name', this.userProfile.lastName || '');
    formData.append('role', this.userProfile.role || ''); // เพิ่ม Role

    if (this.selectedFile instanceof File) {
      formData.append('profile_image', this.selectedFile as Blob);
    }

    this.authService.updateUser(this.userProfile.id, formData).subscribe(
      () => {
        Swal.fire('Success', 'Profile updated successfully.', 'success').then(() => {
          window.location.reload(); // Reload the page
        });
      },
      (error) => {
        Swal.fire('Error', 'Failed to update profile.', 'error');
      }
    );
  }
}
