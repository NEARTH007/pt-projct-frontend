import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { LocationComponent } from './location/location.component';
import { ProfileComponent } from '../profile/profile.component';
import { UserManagementComponent } from '../user-management/user-management.component';
import { DashboardIotmapDeviceComponent } from './dashboard-iotmap-device/dashboard-iotmap-device.component';
import { DevicesComponent } from './Devices/devices.component';
import { BoardComponent } from '../board/board.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'location', component: LocationComponent },
      { path: 'devices', component: DevicesComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'user-management', component: UserManagementComponent },
      { path: 'dashboard-iotmap-device', component: DashboardIotmapDeviceComponent },
      { path: 'board', component: BoardComponent },
      
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
