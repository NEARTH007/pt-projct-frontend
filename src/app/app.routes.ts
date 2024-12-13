import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { LocationComponent } from './components/location/location.component';
import { DevicesComponent } from './components/Devices/devices.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // เปลี่ยนเส้นทางไปยังหน้า login เมื่อเปิดแอป
  { path: 'login', component: LoginComponent }, // กำหนดเส้นทางสำหรับหน้า login
  { path: 'register', component: RegisterComponent }, // กำหนดเส้นทางสำหรับหน้า register
  { path: 'dashboard', component: DashboardComponent },
  { path: 'uesr-management', component: UserManagementComponent },
  { path:  'profile', component: ProfileSettingsComponent },
  { path:  'location', component: LocationComponent },
  { path:  'device', component: DevicesComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}