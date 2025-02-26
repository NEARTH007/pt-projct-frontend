import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  userProfile: any = {};
  selectedUser: any = { id: null, username: '', email: '', role: '' };
  newUser: any = { username: '', email: '', password: '', role: 'User', first_name: '', last_name: '', profile_image: null };
  isAddModalOpen: boolean = false;
  isEditModalOpen: boolean = false;
  isDetailModalOpen: boolean = false;
  previewImage: string | ArrayBuffer | null = null;

  constructor(private authService: AuthService, private router: Router) {}


  ngOnInit() {
    this.fetchUsers();
    this.getUserProfile(); // เพิ่มการดึงข้อมูลโปรไฟล์
  }

  getUserProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
  
    this.authService.getProfile(token).subscribe(
      (response: any) => {
        this.userProfile = response;
        console.log('User profile fetched successfully:', this.userProfile);
      },
      (error) => {
        console.error('Error fetching user profile', error);
        if (error.status === 403 || error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    );
  }
  
  

  fetchUsers() {
    this.authService.getAllUsers().subscribe(
      (response) => {
        this.users = response;
      },
      (error) => {
        if (error.message === 'No token found!') {
          Swal.fire('Error', 'Please log in to access this page.', 'error');
          this.router.navigate(['/login']);
        } else {
          Swal.fire('Error', 'Failed to fetch users.', 'error');
        }
        console.error('Error fetching users:', error);
      }
    );
  }

  // Open modals
  openAddModal() {
    this.newUser = { 
      username: '', 
      email: '', 
      password: '', 
      role: 'User', 
      first_name: '', 
      last_name: '', 
      profile_image: null 
    }; // รีเซ็ตข้อมูล
    this.isAddModalOpen = true;
    this.previewImage = null; // ล้าง Preview รูปภาพ
  }
  

  openEditModal(user: any) {
    this.selectedUser = { ...user };
  
    // ✅ เช็คว่ามีรูปภาพไหม ถ้ามีให้ใช้ URL ที่ถูกต้อง
    this.selectedUser.profile_image = user.profile_image
      ? user.profile_image.startsWith('http')
        ? user.profile_image
        : `http://localhost:5006/uploads/${user.profile_image}`
      : 'assets/default-profile.png';
  
    this.isEditModalOpen = true;
  }
  
  openDetailModal(user: any) {
    this.selectedUser = { ...user };
    this.isDetailModalOpen = true;
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

  

  closeModals() {
    this.isAddModalOpen = false;
    this.isEditModalOpen = false;
    this.isDetailModalOpen = false; // ← ต้องเพิ่มบรรทัดนี้
    this.selectedUser = { id: null, username: '', email: '', role: '' };
    this.newUser = { username: '', email: '', password: '', role: 'User', first_name: '', last_name: '', profile_image: null };
  }
  

  // Handle file selection for profile image
  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.newUser.profile_image = file;
  
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.previewImage = e.target?.result || null;
      };
      reader.readAsDataURL(file);
    } else {
      this.previewImage = null;
    }
  }
  

  onEditFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.selectedUser.profile_image = file;
  
      // ✅ แสดง Preview รูปภาพใหม่
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.selectedUser.profile_image_preview = e.target?.result || null;
      };
      reader.readAsDataURL(file);
    }
  }
  
  // ฟังก์ชันลบรูปภาพ
removeImage() {
  this.previewImage = null;
  this.newUser.profile_image = null;
}

  // Add user
  addUser() {
    if (
      !this.newUser.username.trim() ||
      !this.newUser.email.trim() ||
      !this.newUser.password.trim() ||
      !this.newUser.first_name.trim() ||
      !this.newUser.last_name.trim()
    ) {
      Swal.fire('Error', 'Please fill in all required fields.', 'error');
      return;
    }
  
    const formData = new FormData();
    formData.append('username', this.newUser.username);
    formData.append('email', this.newUser.email);
    formData.append('password', this.newUser.password);
    formData.append('role', this.newUser.role);
    formData.append('first_name', this.newUser.first_name);
    formData.append('last_name', this.newUser.last_name);
    if (this.newUser.profile_image) {
      formData.append('profile_image', this.newUser.profile_image);
    }
  
    this.authService.register(formData).subscribe(
      () => {
        Swal.fire('Success', 'User added successfully.', 'success').then(() => {
          window.location.reload(); // รีหน้า
        });
      },
      (error) => {
        Swal.fire('Error', 'Failed to add user.', 'error');
        console.error('Error adding user:', error);
      }
    );
  }


// ฟังก์ชันลบรูปภาพใน Edit Modal
removeEditImage() {
  this.selectedUser.profile_image_preview = null;
  this.selectedUser.profile_image = null;
}

  editUser() {
    const formData = new FormData();
    formData.append('username', this.selectedUser.username);
    formData.append('email', this.selectedUser.email);
    formData.append('role', this.selectedUser.role);
    formData.append('first_name', this.selectedUser.first_name);
    formData.append('last_name', this.selectedUser.last_name);
  
    // ✅ เช็คว่ามีไฟล์รูปภาพใหม่หรือไม่
    if (this.selectedUser.profile_image && this.selectedUser.profile_image instanceof File) {
      formData.append('profile_image', this.selectedUser.profile_image);
    }
  
    this.authService.updateUser(this.selectedUser.id, formData).subscribe(
      () => {
        Swal.fire('Updated!', 'User has been updated.', 'success').then(() => {
          window.location.reload();
        });
      },
      (error) => {
        Swal.fire('Error', 'Failed to update user.', 'error');
        console.error('Error updating user:', error);
      }
    );
  }
  
  
  // Delete user
  deleteUser(user: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you really want to delete "${user.username}"? This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.deleteUser(user.id).subscribe(
          () => {
            Swal.fire('Deleted!', `"${user.username}" has been deleted.`, 'success').then(() => {
              window.location.reload(); // รีหน้า
            });
          },
          (error) => {
            console.error('Delete user failed:', error);
            Swal.fire('Error', 'Failed to delete user.', 'error');
          }
        );
      }
    });
  }
}  