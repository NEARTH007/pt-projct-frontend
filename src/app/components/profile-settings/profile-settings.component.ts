import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {
  userProfile: any;
  profileForm: FormGroup;

  constructor(private authService: AuthService, private fb: FormBuilder) {
    console.log('ProfileSettingsComponent constructor called');
    // Initialize the form group with empty values
    this.profileForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      email: [''],
    });
  }

  ngOnInit() {
    console.log('ProfileSettingsComponent ngOnInit called');
    const token = localStorage.getItem('authToken');
    console.log('Auth token:', token);

    if (token) {
      this.authService.getUserProfile(token).subscribe(
        (data) => {
          console.log('User profile data loaded:', data);
          this.userProfile = data;

          this.profileForm.patchValue({
            first_name: this.userProfile.first_name,
            last_name: this.userProfile.last_name,
            email: this.userProfile.email,
            profession: this.userProfile.profession || '',
            bio: this.userProfile.bio || ''
          });
        },
        (error) => {
          console.error('Failed to load user profile:', error);
        }
      );
    } else {
      console.warn('No auth token found, redirecting to login');
    }
  }

  onChangePicture() {
    console.log('Change picture clicked');
  }

  onDeletePicture() {
    console.log('Delete picture clicked');
  }

  onSave() {
    console.log('Saving profile data', this.profileForm.value);
  }
}
