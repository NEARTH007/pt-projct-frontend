import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { LocationComponent } from './location/location.component';
import { ProfileComponent } from '../profile/profile.component';
import { UserManagementComponent } from '../user-management/user-management.component';
import { DashboardIotmapDeviceComponent } from './dashboard-iotmap-device/dashboard-iotmap-device.component';
import { DevicesComponent } from './Devices/devices.component';
import { BoardComponent } from '../board/board.component';
import { AdminGuard } from '../../guards/admin.guard';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'devices', component: DevicesComponent }, // ✅ เอา `canActivate: [AdminGuard]` ออก
      { path: 'profile', component: ProfileComponent },
      { path: 'user-management', component: UserManagementComponent, canActivate: [AdminGuard] },
      { path: 'dashboard-iotmap-device', component: DashboardIotmapDeviceComponent },
      { path: 'board', component: BoardComponent },
      { path: 'login', redirectTo: 'request-password-reset', pathMatch: 'full' },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
