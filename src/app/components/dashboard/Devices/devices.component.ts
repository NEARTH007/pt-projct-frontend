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

  deviceTypes: any[] = []; // ✅ เพิ่มตัวแปรเพื่อเก็บข้อมูลประเภทอุปกรณ์

  newDevice = {
    id: 0,
    name: '',
    description: '',
    latitude: '',
    longitude: '',
    deviceTypeId: '',  // ✅ เพิ่ม deviceTypeId
    status: 'ใช้งานปกติ',
    image: '' as string | File,
};


editDeviceData = {
  id: 0,
  name: '',
  description: '',  // ✅ เพิ่ม description 
  latitude: '',
  longitude: '',
  image: '' as string | File,
  status: 'ใช้งานปกติ',
  values: [] as { value_name: string; value: string }[],
  device_type_name: 'Unknown', 
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
    this.fetchDevices();
    this.getUserProfile();
    this.fetchDeviceTypes(); 
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
          no: index !== -1 ? this.devices[index].no : 'N/A',
          created_at: moment(deviceDetails.created_at).format(
            'YYYY-MM-DD HH:mm:ss'
          ),
          updated_at: moment(deviceDetails.updated_at).format(
            'YYYY-MM-DD HH:mm:ss'
          ),
          image_url: deviceDetails.image_url || null,
        };

        this.authService.getDeviceValues(device.id).subscribe(
          (values: any) => {
            formattedDeviceDetails.values = values || [];

            this.selectedDevice = formattedDeviceDetails;
            console.log('📌 Selected Device (Offcanvas):', this.selectedDevice);

            const offcanvasElement =
              this.el.nativeElement.querySelector('#offcanvasRight');
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
        console.log("📌 Devices from API:", devices); // ✅ ตรวจสอบว่าข้อมูลถูกดึงมา
        if (!devices || devices.length === 0) {
          console.warn("⚠️ No devices found for this user.");
        }
  
        devices.sort(
          (a: any, b: any) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
  
        this.devices = devices.map((device, index) => ({
          ...device,
          no: index + 1,
          image_url: device.image_url || null,
          status: device.status,
          device_type_name: device.device_type_name || 'Unknown',
          added_by: device.added_by || 'Unknown',
          updated_by: device.updated_by || 'Unknown',
          created_at: device.created_at || 'Unknown',
          updated_at: device.updated_at || 'Unknown',
        }));
  
        console.log("📌 Processed Devices:", this.devices); // ✅ ตรวจสอบหลังจากจัดรูปแบบแล้ว
  
        this.calculatePagination();
      },
      (error) => {
        console.error("🚨 Failed to fetch devices:", error);
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
      image: '' as string | File,
      status: 'ใช้งานปกติ',
      deviceTypeId: '', // ✅ เพิ่ม deviceTypeId
    };
    this.isCreateModalOpen = true;
  }

  openEditModal(device: any): void {
    this.authService.getDeviceById(device.id).subscribe(
      (deviceDetails: any) => {
        this.authService.getDeviceValues(device.id).subscribe(
          (values: any) => {
            this.editDeviceData = {
              ...deviceDetails,
              description: deviceDetails.description || '', // ✅ โหลดค่า description
              values: values || [],
            };
            this.isEditModalOpen = true;
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

  openImageModal(imageUrl: string, deviceName: string = "Unknown Device"): void {
    if (!imageUrl) {
      console.error('No image URL provided.');
      return;
    }
  
    const modalElement = document.getElementById('imageModal');
    if (modalElement) {
      const modal = new this.bootstrap.Modal(modalElement);
      this.selectedImage = imageUrl;
  
      // ✅ ตั้งชื่อ Modal ให้ตรงกับอุปกรณ์ที่กด
      setTimeout(() => {
        const modalTitle = document.getElementById('imageModalLabel');
        if (modalTitle) {
          modalTitle.innerText = deviceName;
        }
      }, 100);
  
      modal.show();
    } else {
      console.error('Modal element not found.');
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
    formData.append('deviceTypeId', this.newDevice.deviceTypeId); // ✅ ส่ง deviceTypeId ไป Backend
  
    if (this.newDevice.image instanceof File) {
      formData.append('device_image', this.newDevice.image); // ✅ ส่งรูปภาพไปด้วย
    }
  
    console.log("📤 Sending Data:", Object.fromEntries(formData.entries())); // Debugging
  
    this.authService.addDevice(formData).subscribe(
      (response) => {
        Swal.fire('Success', 'Device added successfully', 'success');
        this.isCreateModalOpen = false;
        this.fetchDevices(); // รีเฟรชข้อมูล
      },
      (error) => {
        Swal.fire('Error', 'Failed to add device', 'error');
      }
    );
  }

  fetchDeviceTypes(): void {
    this.authService.getDeviceTypes().subscribe(
      (types) => {
        this.deviceTypes = types; // ✅ เก็บค่า Device Types
        console.log("📌 Device Types Loaded:", this.deviceTypes); // Debugging
      },
      (error) => {
        Swal.fire('Error', 'Failed to fetch device types', 'error');
      }
    );
  }
  
  
  // ✅ ปรับให้ค่าถูกต้องเมื่ออัปเดตอุปกรณ์
  editDevice(): void {
    const formData = new FormData();
    formData.append('name', this.editDeviceData.name);
    formData.append('description', this.editDeviceData.description); // ✅ ส่งค่า description
    formData.append('latitude', this.editDeviceData.latitude);
    formData.append('longitude', this.editDeviceData.longitude);
    formData.append('status', this.editDeviceData.status);
  
    if (this.editDeviceData.values && this.editDeviceData.values.length > 0) {
      formData.append('values', JSON.stringify(this.editDeviceData.values));
    } else {
      formData.append('values', JSON.stringify([]));
    }
  
    if (this.editDeviceData.image instanceof File) {
      formData.append('device_image', this.editDeviceData.image);
    }
  
    console.log('📤 Sending FormData:', Object.fromEntries(formData.entries()));
  
    this.authService.editDevice(this.editDeviceData.id, formData).subscribe(
      () => {
        Swal.fire('Success', 'Device updated successfully', 'success');
        this.isEditModalOpen = false;
        this.fetchDevices();
      },
      (error) => {
        Swal.fire('Error', 'Failed to update device', 'error');
      }
    );
  }
  
  imagePreviewUrl: string | null = null; // ใช้เก็บ URL รูปภาพที่ preview

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
  
    // สร้าง preview URL ของรูปภาพ
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreviewUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  // 🟢 ฟังก์ชันลบรูปภาพ
removeImage(): void {
  this.imagePreviewUrl = null;
  this.newDevice.image = '' as string | File;
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
    this.authService.getUserProfile().subscribe(
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
        Swal.fire(
          'Success',
          'Values updated successfully and timestamp refreshed',
          'success'
        );
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
