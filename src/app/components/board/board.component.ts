import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AuthService } from '../../services/auth.service'; // Adjust the import path

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  totalDevices: number = 0;
  activeDevices: number = 0;
  inactiveDevices: number = 0;

  constructor(private authService: AuthService) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.fetchDeviceData();
  }

  fetchDeviceData() {
    this.authService.getDevices().subscribe((devices) => {
      this.totalDevices = devices.length;
      this.activeDevices = devices.filter((device) => device.status === 'ใช้งานปกติ').length;
      this.inactiveDevices = devices.filter((device) => device.status === 'ใช้งานไม่ได้').length;

      this.createBarChart();
      this.createPieChart();
    });
  }

  createBarChart() {
    new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['Total Devices', 'Active Devices', 'Inactive Devices'],
        datasets: [
          {
            label: 'Devices',
            data: [this.totalDevices, this.activeDevices, this.inactiveDevices],
            backgroundColor: ['#36A2EB', '#00C853', '#D32F2F'], // Blue for total, Green for active, Red for inactive
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }
  
  createPieChart() {
    new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: ['Active Devices', 'Inactive Devices'],
        datasets: [
          {
            label: 'Devices Status',
            data: [this.activeDevices, this.inactiveDevices],
            backgroundColor: ['#00C853', '#D32F2F'], // Green for active, Red for inactive
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }
}