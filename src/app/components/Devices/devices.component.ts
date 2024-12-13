import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class DevicesComponent implements OnInit {
  devices: any[] = [];
  newDevice = { id: 0, name: '', description: '' };
  editDeviceData = { id: 0, name: '', description: '' };
  selectedDevice: any = null;
  userProfile: any = null;
  activeMenu: string = 'devices'; // Default active menu

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchDevices();
    this.getUserProfile();
  }

  setActiveMenu(menu: string): void {
    this.activeMenu = menu; // อัปเดต activeMenu
    this.router.navigate([`/${menu}`]); // นำทางไปยังเส้นทางที่สอดคล้อง
  }

  isActive(menu: string): boolean {
    return this.activeMenu === menu; // Check if menu is active
  }

  fetchDevices(): void {
    this.authService.getDevices().subscribe(
      (devices) => {
        this.devices = devices;
      },
      (error) => {
        Swal.fire('Error', 'Failed to fetch devices', 'error');
      }
    );
  }

  openCreateModal(): void {
    this.newDevice = { id: 0, name: '', description: '' };
    document.getElementById('createDeviceModal')?.classList.remove('hidden');
  }

  openEditModal(device: any): void {
    this.editDeviceData = { ...device };
    document.getElementById('editDeviceModal')?.classList.remove('hidden');
  }

  openDeleteModal(device: any): void {
    this.selectedDevice = device;
    document.getElementById('deleteDeviceModal')?.classList.remove('hidden');
  }

  closeModal(modalId: string): void {
    document.getElementById(modalId)?.classList.add('hidden');
  }

  addDevice(): void {
    if (!this.newDevice.name || !this.newDevice.description) {
      Swal.fire('Error', 'All fields are required', 'error');
      return;
    }
    this.authService.addDevice(this.newDevice).subscribe(
      () => {
        Swal.fire('Success', 'Device added successfully', 'success');
        this.closeModal('createDeviceModal');
        this.fetchDevices();
      },
      (error) => {
        Swal.fire('Error', 'Failed to add device', 'error');
      }
    );
  }

  editDevice(): void {
    if (!this.editDeviceData.name || !this.editDeviceData.description) {
      Swal.fire('Error', 'All fields are required', 'error');
      return;
    }
    this.authService.editDevice(this.editDeviceData.id, this.editDeviceData).subscribe(
      () => {
        Swal.fire('Success', 'Device updated successfully', 'success');
        this.closeModal('editDeviceModal');
        this.fetchDevices();
      },
      (error) => {
        Swal.fire('Error', 'Failed to update device', 'error');
      }
    );
  }

  deleteDevice(device: any): void {
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
        text: `Do you really want to delete device "${device.name}"? This action cannot be undone!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.authService.deleteDevice(device.id).subscribe(
            () => {
              swalWithBootstrapButtons.fire(
                "Deleted!",
                `Device "${device.name}" has been deleted.`,
                "success"
              );
              this.fetchDevices(); // Refresh the list
            },
            (error) => {
              console.error("Error deleting device:", error);
              swalWithBootstrapButtons.fire(
                "Error!",
                "Failed to delete device. Please try again.",
                "error"
              );
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your device is safe :)",
            "error"
          );
        }
      });
  }
  
  
  getUserProfile(): void {
    this.authService.getUserProfile(localStorage.getItem('token') || '').subscribe(
      (profile) => {
        this.userProfile = profile;
      },
      (error) => {
        this.router.navigate(['/login']);
      }
    );
  }
}
