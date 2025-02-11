import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule, routes } from "./app.routes";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegisterComponent } from "./components/register/register.component";
import { LoginComponent } from "./components/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { AppComponent } from "./app.component";
import { UserManagementComponent } from "./components/user-management/user-management.component";
import { LocationComponent } from "./components/dashboard/location/location.component";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { DevicesComponent } from "./components/dashboard/Devices/devices.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { SidebarComponent } from "./components/dashboard/sidebar/sidebar.component";
import { NavbarComponent } from "./components/dashboard/navbar/navbar.component";
import { NotFountComponent } from "./components/dashboard/not-fount/not-fount.component";
import { DashboardIotmapDeviceComponent } from "./components/dashboard/dashboard-iotmap-device/dashboard-iotmap-device.component";
import { BoardComponent } from "./components/board/board.component";






@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    RegisterComponent,
    LoginComponent,
    DashboardComponent,
    AppComponent,
    UserManagementComponent,
    ProfileComponent,
    FormsModule,
    LocationComponent,
    SidebarComponent,
    NavbarComponent,
    DevicesComponent,
    NotFountComponent,
    UserManagementComponent,
    DashboardIotmapDeviceComponent,
    BoardComponent,
    RouterModule.forRoot(routes),
    

  ],
  declarations: [
  ],
})
export class AppModule { }