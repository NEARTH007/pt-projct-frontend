import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit { 

  totalDevices: number = 0;
  activeDevices: number = 0;
  inactiveDevices: number = 0;
  totalUsers: number = 0;
  totalAdmins: number = 0;
  deviceTypeStats: any = {}; 

  // สีที่ใช้สำหรับแต่ละประเภทอุปกรณ์
  deviceTypeColors: any = {
    "อุปกรณ์น้ำ": "#36A2EB",
    "อุปกรณ์ไฟฟ้า": "#FFD700",
    "ความชื้น": "#4CAF50",
    "default": "#9E9E9E"
  };

  // ตัวแปรเก็บกราฟเพื่อป้องกันการซ้อน
  barChart: any;
  pieChart: any;
  userPieChart: any;
  deviceTypeChart: any;

  constructor(private authService: AuthService) {
    Chart.register(...registerables);
  }

  ngOnInit() {
    this.fetchDeviceData();
    this.fetchUserData();
  }

  // ✅ ดึงข้อมูลอุปกรณ์
  fetchDeviceData() {
    this.authService.getDevices().subscribe((devices) => {
      this.totalDevices = devices.length;
      this.activeDevices = devices.filter((d) => d.status === 'ใช้งานปกติ').length;
      this.inactiveDevices = devices.filter((d) => d.status === 'ใช้งานไม่ได้').length;

      this.calculateDeviceTypeStats(devices);
      this.createBarChart();
      this.createPieChart();
      this.createDeviceTypeChart();
    });
  }

  // ✅ ดึงข้อมูล Users & Admins
  fetchUserData() {
    this.authService.getAllUsers().subscribe((users) => {
      this.totalUsers = users.filter((user: any) => user.role === 'User').length;
      this.totalAdmins = users.filter((user: any) => user.role === 'Admin').length;

      this.createUserPieChart();
    });
  }

  // ✅ กราฟแท่ง: อุปกรณ์ทั้งหมด
  createBarChart() {
    if (this.barChart) this.barChart.destroy();
    this.barChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ['Total Devices', 'Active Devices', 'Inactive Devices'],
        datasets: [{
          label: 'Devices',
          data: [this.totalDevices, this.activeDevices, this.inactiveDevices],
          backgroundColor: ['#36A2EB', '#00C853', '#D32F2F'],
          barThickness: 30,
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        maintainAspectRatio: false,
      },
    });
  }

  // ✅ กราฟวงกลม: อุปกรณ์ที่ใช้งานได้/ไม่ได้
  createPieChart() {
    if (this.pieChart) this.pieChart.destroy();
    this.pieChart = new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: ['Active Devices', 'Inactive Devices'],
        datasets: [{
          data: [this.activeDevices, this.inactiveDevices],
          backgroundColor: ['#00C853', '#D32F2F'],
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        maintainAspectRatio: false,
        aspectRatio: 1.5,
      },
    });
  }

  // ✅ กราฟวงกลม: ผู้ใช้ (Users & Admins)
  createUserPieChart() {
    if (this.userPieChart) this.userPieChart.destroy();
    this.userPieChart = new Chart('userPieChart', {
      type: 'pie',
      data: {
        labels: ['Users', 'Admins'],
        datasets: [{
          data: [this.totalUsers, this.totalAdmins],
          backgroundColor: ['#FF9800', '#3F51B5'],
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        maintainAspectRatio: false,
        aspectRatio: 1.5,
      },
    });
  }

  // ✅ คำนวณจำนวนอุปกรณ์แยกตามประเภท
  calculateDeviceTypeStats(devices: any[]) {
    this.deviceTypeStats = {};
    devices.forEach((device) => {
      const type = device.device_type_name || 'Unknown';

      if (!this.deviceTypeStats[type]) {
        this.deviceTypeStats[type] = { total: 0, active: 0, inactive: 0 };
      }

      this.deviceTypeStats[type].total++;
      if (device.status === 'ใช้งานปกติ') {
        this.deviceTypeStats[type].active++;
      } else {
        this.deviceTypeStats[type].inactive++;
      }
    });
  }

  // ✅ กราฟแท่ง: แสดงอุปกรณ์ตามประเภท
  createDeviceTypeChart() {
    if (this.deviceTypeChart) this.deviceTypeChart.destroy();
    const labels = Object.keys(this.deviceTypeStats);
    const activeData = labels.map((type) => this.deviceTypeStats[type].active);
    const inactiveData = labels.map((type) => this.deviceTypeStats[type].inactive);

    const colors = labels.map((type) => this.deviceTypeColors[type] || this.deviceTypeColors["default"]);
    const inactiveColors = labels.map(() => "#D32F2F");

    this.deviceTypeChart = new Chart('deviceTypeChart', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Active',
            data: activeData,
            backgroundColor: colors,
            barThickness: 30,
          },
          {
            label: 'Inactive',
            data: inactiveData,
            backgroundColor: inactiveColors,
            barThickness: 30,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        maintainAspectRatio: false,
      },
    });
  }
}
