import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Adjust the path to AuthService
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class LocationComponent implements OnInit {
  locations: any[] = [];
  newLocation = { id: 0, name: '', description: '' };
  editLocationData = { id: 0, name: '', description: '' };
  selectedLocation: any = null;
  userProfile: any = null;

  // Define activeMenu to handle active states
  activeMenu: string = 'location';

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchLocations();
    this.getUserProfile();
  }

  setActiveMenu(menu: string): void {
    this.activeMenu = menu; // Update active menu state
  }

  isActive(menu: string): boolean {
    return this.activeMenu === menu; // Check if the menu is active
  }


  loading = false; // Add a loading state

  fetchLocations(): void {
    this.loading = true;
    this.authService.getLocations().subscribe(
      (locations) => {
        this.locations = locations;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        alert('Failed to fetch locations. Please try again.');
        console.error('Error fetching locations:', error);
      }
    );
  }

  openCreateModal(): void {
    this.newLocation = { id: 0, name: '', description: '' }; // Reset newLocation
    document.getElementById('createProductModal')?.classList.remove('hidden');
  }

  openEditModal(location: any): void {
    this.authService.getLocationById(location.id).subscribe(
      (data) => {
        this.editLocationData = { ...data };
        document.getElementById('updateProductModal')?.classList.remove('hidden');
      },
      (error) => {
        alert('Unable to fetch location data. Please try again.');
        console.error('Error fetching location data:', error);
      }
    );
  }

  openDeleteModal(location: any): void {
    this.selectedLocation = location;
    document.getElementById('deleteModal')?.classList.remove('hidden');
  }

  closeModal(modalId: string): void {
    document.getElementById(modalId)?.classList.add('hidden');
  }

  addLocation(): void {
    if (!this.newLocation.name || !this.newLocation.description) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill out all fields!",
      });
      return;
    }
  
    this.authService.addLocation(this.newLocation).subscribe(
      (response) => {
        this.closeModal('createProductModal');
        Swal.fire({
          icon: "success",
          title: "Location added successfully!",
          text: `New ID: ${response.id}`, // Optional: Show the ID of the added location
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
        this.fetchLocations(); // Refresh the list
      },
      (error) => {
        console.error('Error adding location:', error);
        Swal.fire({
          icon: "error",
          title: "Failed to add location",
          text: "Please try again.",
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
      }
    );
  }

  editLocation(): void {
    if (!this.editLocationData.name || !this.editLocationData.description) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill out all fields!",
      });
      return;
    }
  
    this.authService.editLocation(this.editLocationData.id, this.editLocationData).subscribe(
      (response) => {
        this.closeModal('updateProductModal');
        Swal.fire({
          icon: "success",
          title: "Location updated successfully!",
          text: `The location has been updated.`,
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
        this.fetchLocations(); // Refresh the list
      },
      (error) => {
        console.error('Error editing location:', error);
        Swal.fire({
          icon: "error",
          title: "Failed to update location",
          text: "Please try again.",
          showConfirmButton: true,
          confirmButtonText: "OK",
        });
      }
    );
  }
  

  deleteLocation(location: any): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-300 ml-2", // Add 'ml-2' for spacing
        cancelButton: "bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition duration-300",
      },
      buttonsStyling: false,
    });
  
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: `Do you really want to delete location "${location.name}"? This action cannot be undone!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.authService.deleteLocation(location.id).subscribe(
            () => {
              swalWithBootstrapButtons.fire(
                "Deleted!",
                `Location "${location.name}" has been deleted.`,
                "success"
              );
              this.fetchLocations(); // Refresh the list
            },
            (error) => {
              console.error("Error deleting location:", error);
              swalWithBootstrapButtons.fire(
                "Error!",
                "Failed to delete location. Please try again.",
                "error"
              );
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your location is safe :)",
            "error"
          );
        }
      });
  }
  
  

  getUserProfile(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.http
      .get('http://localhost:5006/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
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
