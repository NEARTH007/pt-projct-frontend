import { Component, OnInit, ElementRef } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import moment from 'moment';


@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class DevicesComponent implements OnInit {
  devices: any[] = [];
  paginatedDevices: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  private bootstrap: any;

  newDevice = {
    id: 0,
    name: '',
    description: '',
    latitude: '',
    longitude: '',
    image: '' as string | File,
    status: 'ใช้งานปกติ',
    value1: '' as string,
    value2: '' as string,
  };

  editDeviceData = {
    id: 0,
    name: '',
    description: '',
    latitude: '',
    longitude: '',
    image: '' as string | File,
    status: 'ใช้งานปกติ',
    value1: '' as string,
    value2: '' as string,
  };

  isCreateModalOpen: boolean = false;
  isEditModalOpen: boolean = false;
  selectedDevice: any = null;
  selectedDeviceIndex: number = 0;
  userProfile: any = null;
  activeMenu: string = 'devices';

  constructor(
    private authService: AuthService,
    private router: Router,
    private el: ElementRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.bootstrap = await import('bootstrap');
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage) {
      this.currentPage = parseInt(savedPage, 10);
    }
    this.fetchDevices(); // Fetch devices from API
    this.getUserProfile(); // Load user profile
  }
  

  openOffcanvas(): void {
    const offcanvasElement =
      this.el.nativeElement.querySelector('#offcanvasRight');
    if (offcanvasElement) {
      const offcanvas = new this.bootstrap.Offcanvas(offcanvasElement); // แก้ไขให้ใช้ this.bootstrap
      offcanvas.show();
    }
  }

  openDeviceDetails(device: any): void {
    const index = this.devices.findIndex((d) => d.id === device.id);
    this.selectedDevice = device;
    this.selectedDeviceIndex = index !== -1 ? index + 1 : 0;

    // ตรวจสอบและเปิด Offcanvas
    const offcanvasElement =
      this.el.nativeElement.querySelector('#deviceOffcanvas');
    if (offcanvasElement && this.bootstrap) {
      const offcanvas = new this.bootstrap.Offcanvas(offcanvasElement);
      offcanvas.show();
    }
  }

  openOffcanvasWithDevice(device: any): void {
    const index = this.devices.findIndex((d) => d.id === device.id);
    
    this.authService.getDeviceById(device.id).subscribe(
      (deviceDetails: any) => {
        const formattedDeviceDetails = {
          ...deviceDetails,
          no: index !== -1 ? this.devices[index].no : "N/A", // ✅ ใช้ NO ตามลำดับที่เรียงแล้ว
          created_at: moment(deviceDetails.created_at).format('YYYY-MM-DD HH:mm:ss'),
          updated_at: moment(deviceDetails.updated_at).format('YYYY-MM-DD HH:mm:ss'),
          image_url: deviceDetails.image_url || null,
        };
  
        this.authService.getDeviceValues(device.id).subscribe(
          (values: any) => {
            if (values && values.length > 0) {
              formattedDeviceDetails.value1 = values[0].value1 || 'N/A';
              formattedDeviceDetails.value2 = values[0].value2 || 'N/A';
            } else {
              formattedDeviceDetails.value1 = 'N/A';
              formattedDeviceDetails.value2 = 'N/A';
            }
  
            this.selectedDevice = formattedDeviceDetails;
            console.log("📌 Selected Device (Offcanvas):", this.selectedDevice); // ✅ Debug ดูค่า NO
  
            const offcanvasElement = this.el.nativeElement.querySelector('#offcanvasRight');
            if (offcanvasElement) {
              const offcanvas = new this.bootstrap.Offcanvas(offcanvasElement);
              offcanvas.show();
            }
          },
          (error) => {
            Swal.fire('Error', 'Failed to fetch device values', 'error');
          }
        );
      },
      (error) => {
        Swal.fire('Error', 'Failed to fetch device details', 'error');
      }
    );
  }
  
  

  viewDeviceOnMap(device: any): void {
    if (device.latitude && device.longitude) {
      this.router.navigate(['/dashboard/dashboard-iotmap-device'], {
        queryParams: {
          lat: device.latitude,
          lng: device.longitude,
          status: device.status,
        },
      });
    } else {
      Swal.fire(
        'Error',
        'This device does not have valid coordinates.',
        'error'
      );
      
    }
    
  }

  setActiveMenu(menu: string): void {
    this.activeMenu = menu; // อัปเดต activeMenu
    this.router.navigate([`/${menu}`]); // นำทางไปยังเส้นทางที่สอดคล้อง
  }

  isActive(menu: string): boolean {
    return this.activeMenu === menu; // Check if menu is active
  }

  viewDeviceDetails(device: any): void {
    const iconHtml =
      device.status === 'ใช้งานปกติ'
        ? `<i class="material-icons" style="color: #00C853; font-size: 3rem;">cloud</i>` // สีเขียวสด
        : `<i class="material-icons" style="color: #D32F2F; font-size: 3rem;">cloud_off</i>`; // สีแดงสด

    Swal.fire({
      title: `Device: ${device.name}`,
      html: `
        <div style="text-align: left;">
          <p><strong>ID:</strong> ${device.id}</p>
          <p><strong>Description:</strong> ${device.description}</p>
          <p><strong>Latitude:</strong> ${device.latitude}</p>
          <p><strong>Longitude:</strong> ${device.longitude}</p>
          <p><strong>Status:</strong> ${device.status}</p>
        </div>
      `,
      iconHtml: iconHtml,
      showConfirmButton: true,
      confirmButtonText: 'Close',
    });
  }

  fetchDevices(): void {
    this.authService.getDevices().subscribe(
      (devices) => {
        // ✅ เรียงอุปกรณ์ตาม `created_at` โดยตัวที่เก่าที่สุดจะมีลำดับ NO น้อยที่สุด
        devices.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  
        // ✅ เพิ่ม NO ตามลำดับที่เรียงแล้ว
        this.devices = devices.map((device, index) => ({
          ...device,
          no: index + 1, // ✅ กำหนด NO ใหม่
          image_url: device.image_url || null,
          status: device.status,
          added_by: device.added_by || 'Unknown',
          updated_by: device.updated_by || 'Unknown',
          created_at: device.created_at || 'Unknown',
          updated_at: device.updated_at || 'Unknown',
          value1: device.value1 || "N/A",
          value2: device.value2 || "N/A",
        }));
  
        this.calculatePagination(); // ✅ อัปเดตการแบ่งหน้า
      },
      (error) => {
        Swal.fire('Error', 'Failed to fetch devices', 'error');
      }
    );
  }
  
  

  calculatePagination(): void {
    this.totalPages = Math.ceil(this.devices.length / this.itemsPerPage);
    this.paginatedDevices = this.devices.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }

  changePage(page: number): void {
    this.currentPage = page;
    localStorage.setItem('currentPage', page.toString());
    this.calculatePagination();
  }

  get totalPagesArray(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, index) => index + 1);
  }

  openCreateModal(): void {
    this.newDevice = {
      id: 0,
      name: '',
      description: '',
      latitude: '',
      longitude: '',
      image: '',
      status: 'ใช้งานปกติ',
      value1: '' as string,
      value2: '' as string,
    };
    this.isCreateModalOpen = true;
  }

  openEditModal(device: any): void {
    this.editDeviceData = { ...device, image: device.image || '' };
    this.isEditModalOpen = true;
  }

  openDeleteModal(device: any): void {
    this.selectedDevice = device;
    const modal = document.getElementById('deleteDeviceModal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  closeModal(modalType: string): void {
    if (modalType === 'create') {
      this.isCreateModalOpen = false;
    } else if (modalType === 'edit') {
      this.isEditModalOpen = false;
    }
  }

  isImageModalOpen: boolean = false;
  selectedImage: string | null = null;


  openImageModal(imageUrl: string): void {
    this.selectedImage = imageUrl;
  
    const modalElement = document.getElementById('imageModal');
    if (modalElement) {
      const modal = new this.bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  
  
  
  closeImageModal(): void {
    this.isImageModalOpen = false;
    this.selectedImage = null;
  }

  addDevice(): void {
    const formData = new FormData();
    formData.append('name', this.newDevice.name);
    formData.append('description', this.newDevice.description);
    formData.append('latitude', this.newDevice.latitude);
    formData.append('longitude', this.newDevice.longitude);
    formData.append('status', this.newDevice.status);
    formData.append('value1', this.newDevice.value1 || '');
    formData.append('value2', this.newDevice.value2 || '');
    if (this.newDevice.image) {
      formData.append('device_image', this.newDevice.image);
    }
  
    // Debug ข้อมูล FormData
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
  
    this.authService.addDevice(formData).subscribe(
      () => {
        Swal.fire('Success', 'Device added successfully', 'success');
        this.isCreateModalOpen = false;
        this.fetchDevices();
      },
      (error) => {
        Swal.fire('Error', 'Failed to add device', 'error');
      }
    );
  }
  
  

  editDevice(): void {
    const formData = new FormData();
    formData.append('name', this.editDeviceData.name);
    formData.append('description', this.editDeviceData.description);
    formData.append('latitude', this.editDeviceData.latitude);
    formData.append('longitude', this.editDeviceData.longitude);
    formData.append('status', this.editDeviceData.status);
    formData.append('value1', this.editDeviceData.value1); // Include value1
    formData.append('value2', this.editDeviceData.value2); // Include value2
  
    if (this.editDeviceData.image instanceof File) {
      formData.append('device_image', this.editDeviceData.image);
    }
  
    this.authService.editDevice(this.editDeviceData.id, formData).subscribe(
      () => {
        Swal.fire('Success', 'Device updated successfully', 'success');
        this.isEditModalOpen = false; // Close modal
        this.fetchDevices(); // Refresh the list
      },
      (error) => {
        Swal.fire('Error', 'Failed to update device', 'error');
      }
    );
  }
  
  


  onImageSelected(event: any, type: 'add' | 'edit'): void {
    const file: File = event.target.files[0];
    if (!file) {
      Swal.fire('Error', 'No file selected', 'error');
      return;
    }

    if (type === 'add') {
      this.newDevice.image = file;
    } else if (type === 'edit') {
      this.editDeviceData.image = file;
    }
  }

  deleteDevice(device: any): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton:
          'bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-300 ml-2', // Add 'ml-2' for spacing
        cancelButton:
          'bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-600 transition duration-300',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: `Do you really want to delete device "${device.name}"? This action cannot be undone!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.authService.deleteDevice(device.id).subscribe(
            () => {
              swalWithBootstrapButtons.fire(
                'Deleted!',
                `Device "${device.name}" has been deleted.`,
                'success'
              );
              this.fetchDevices(); // Refresh the list
            },
            (error) => {
              console.error('Error deleting device:', error);
              swalWithBootstrapButtons.fire(
                'Error!',
                'Failed to delete device. Please try again.',
                'error'
              );
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your device is safe :)',
            'error'
          );
        }
      });
  }

  getUserProfile(): void {
    this.authService
      .getUserProfile(localStorage.getItem('token') || '')
      .subscribe(
        (profile) => {
          this.userProfile = profile;
        },
        (error) => {
          this.router.navigate(['/login']);
        }
      );
  }

  addDeviceValues(deviceId: number, value1: string, value2: string): void {
    const payload = { deviceId, value1, value2 };
    this.authService.addDeviceValues(payload).subscribe(
      () => {
        Swal.fire('Success', 'Values added successfully', 'success');
        this.fetchDevices(); // รีเฟรชรายการอุปกรณ์
      },
      (error) => {
        Swal.fire('Error', 'Failed to add values', 'error');
      }
    );
  }
  
  editDeviceValues(valueId: number, value1: string, value2: string): void {
    const payload = { value1, value2 };
    this.authService.editDeviceValues(valueId, payload).subscribe(
      () => {
        Swal.fire('Success', 'Values updated successfully and timestamp refreshed', 'success');
        this.fetchDevices(); // อัปเดตรายการอุปกรณ์ใหม่
      },
      (error) => {
        Swal.fire('Error', 'Failed to update values', 'error');
      }
    );
  }
  
  
  
  getDeviceValues(deviceId: number): void {
    this.authService.getDeviceValues(deviceId).subscribe(
      (values) => {
        console.log('Device Values:', values);
      },
      (error) => {
        Swal.fire('Error', 'Failed to fetch values', 'error');
      }
    );
  }
}  