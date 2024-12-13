import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule, routes } from "./app.routes";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegisterComponent } from "./components/register/register.component";
import { LoginComponent } from "./components/login/login.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { AppComponent } from "./app.component";
import { UserManagementComponent } from "./components/user-management/user-management.component";
import { ProfileSettingsComponent } from "./components/profile-settings/profile-settings.component";
import { LocationComponent } from "./components/location/location.component";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { DevicesComponent } from "./components/Devices/devices.component";




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
    ProfileSettingsComponent,
    FormsModule,
    LocationComponent,
    DevicesComponent,
    RouterModule.forRoot(routes),

  ],
  declarations: [
  ],
})
export class AppModule { }