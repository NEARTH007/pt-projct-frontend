import { Component, AfterViewInit, HostListener } from '@angular/core';
import * as L from 'leaflet';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Define a blue custom icon with increased size
const customIcon = L.icon({
  iconUrl: 'https://www.iconpacks.net/icons/2/free-location-icon-2955-thumb.png', // Blue pin icon
  iconSize: [40, 40], // Increased width and height for better appearance
  iconAnchor: [17.5, 45], // Adjust anchor to center the icon
  popupAnchor: [0, -40], // Adjust popup position
});

@Component({
  selector: 'app-dashboard-iotmap-device',
  templateUrl: './dashboard-iotmap-device.component.html',
  styleUrls: ['./dashboard-iotmap-device.component.css'],
  imports: [CommonModule],
})
export class DashboardIotmapDeviceComponent implements AfterViewInit {
  private map: any;
  selectedDevice: any = null;
  private bootstrap: any;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  async ngAfterViewInit(): Promise<void> {
    this.bootstrap = await import('bootstrap');
    this.initMap();
    this.loadDevices();

    this.route.queryParams.subscribe((params) => {
      const lat = parseFloat(params['lat']);
      const lng = parseFloat(params['lng']);
      const status = params['status'];
      if (!isNaN(lat) && !isNaN(lng)) {
        this.zoomToDevice(lat, lng, status);
      }
    });

    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 200);
  }

  @HostListener('window:resize', [])
  onResize(): void {
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  private loadDevices(): void {
    this.authService.getDevices().subscribe(
      (devices) => {
        devices.forEach((device) => {
          if (device.latitude && device.longitude) {
            const marker = L.marker([device.latitude, device.longitude], {
              icon: customIcon,
            }).addTo(this.map);

            // Add Tooltip
            marker.bindTooltip(
              `
                <div style="font-size: 14px; font-weight: bold;">
                  ${device.name}
                </div>
                <div style="font-size: 12px; color: ${
                  device.status === 'ใช้งานปกติ' ? '#00c853' : '#d32f2f'
                }; font-weight: 500;">
                  ${device.status}
                </div>
              `,
              {
                permanent: false,
                direction: 'top',
                offset: [0, -10],
                className: 'custom-tooltip',
              }
            );

            marker.on('click', () => {
              this.authService.getDeviceById(device.id).subscribe(
                (deviceDetails) => {
                  const formattedDeviceDetails = {
                    ...deviceDetails,
                    value1: 'N/A', // Default values in case they're not fetched
                    value2: 'N/A',
                  };
            
                  // Fetch value1 and value2 separately
                  this.authService.getDeviceValues(device.id).subscribe(
                    (values: any) => {
                      if (values && values.length > 0) {
                        formattedDeviceDetails.value1 = values[0]?.value1 || 'N/A';
                        formattedDeviceDetails.value2 = values[0]?.value2 || 'N/A';
                      }
            
                      // Assign fetched details to `selectedDevice`
                      this.selectedDevice = formattedDeviceDetails;
            
                      // Open Offcanvas
                      const offcanvasElement = document.getElementById('offcanvasMapDetails');
                      if (offcanvasElement && this.bootstrap) {
                        const offcanvas = new this.bootstrap.Offcanvas(offcanvasElement);
                        offcanvas.show();
                      }
                    },
                    (error) => {
                      console.error('Failed to fetch device values:', error);
                    }
                  );
                },
                (error) => {
                  console.error('Failed to fetch device details:', error);
                }
              );
            });            
          }
        });
      },
      (error) => {
        console.error('Failed to load devices:', error);
      }
    );
  }

  selectedImage: string | null = null;

openImageModal(imageUrl: string): void {
  if (!imageUrl) {
    console.error("No image URL provided.");
    return;
  }

  const modalElement = document.getElementById('imageModal');
  if (modalElement) {
    const modal = new this.bootstrap.Modal(modalElement);
    this.selectedImage = imageUrl;
    modal.show();
  } else {
    console.error("Modal element not found.");
  }
}


  private zoomToDevice(lat: number, lng: number, status: string): void {
    this.map.setView([lat, lng], 17, { animate: true, duration: 0.5 });

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map);

    marker.bindPopup(
      `
      <div style="font-size: 14px; font-weight: bold;">
        Device is here
      </div>
      <div style="font-size: 12px; color: gray;">
        Status: ${status}
      </div>
    `
    ).openPopup();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [13.6437847, 100.6259531],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: true,
      dragging: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
  }
}
