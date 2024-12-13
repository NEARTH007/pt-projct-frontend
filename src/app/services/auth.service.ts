import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5006/api/auth';


  constructor(private http: HttpClient) {}

  login(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, payload).pipe(
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError(error); // ส่งข้อผิดพลาดต่อไป
      })
    );
  }
  
  register(payload: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload).pipe(
      catchError((error) => {
        console.error('Register failed:', error);
        if (error.error) {
          alert(error.error); // Display the error message (plain text response)
        } else {
          alert('Registration failed. Please try again.');
        }
        return throwError(error);// Propagate the error to the component
      })
    );
  }
  
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`).pipe(
      catchError((error) => {
        console.error('Fetch users failed:', error);
        return throwError(error);
      })
    );
  }
  
  updateUser(id: number, payload: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${id}`, payload).pipe(
      catchError((error) => {
        console.error('Update user failed:', error);
        return throwError(error);
      })
    );
  }
  
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`).pipe(
      catchError((error) => {
        console.error('Delete user failed:', error);
        return throwError(error);
      })
    );
  }  

  getUserProfile(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/profile`, { headers }).pipe(
      catchError((error) => {
        console.error('Fetch user profile failed:', error);
        return throwError(error);
      })
    );
  }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found!');
      throw new Error('No token found');
    }
    console.log('Token:', token); // Debugging
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  

  // Location APIs
  getLocations(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/location`, { headers }).pipe(
      catchError((error) => {
        console.error('Failed to fetch locations:', error);
        return throwError(() => new Error('Unable to fetch locations'));
      })
    );
  }

  addLocation(data: { name: string; description: string }): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/location/add`, data, { headers }).pipe(
      catchError((error) => {
        console.error('Failed to add location:', error);
        return throwError(() => new Error('Unable to add location'));
      })
    );
  }

  editLocation(id: number, data: { name: string; description: string }): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${this.apiUrl}/location/edit/${id}`, data, { headers }).pipe(
      catchError((error) => {
        console.error('Failed to edit location:', error);
        return throwError(() => new Error('Unable to edit location'));
      })
    );
  }

  deleteLocation(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/location/delete/${id}`, { headers }).pipe(
      catchError((error) => {
        console.error('Failed to delete location:', error);
        return throwError(() => new Error('Unable to delete location'));
      })
    );
  }

  getLocationById(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/location/${id}`, { headers }).pipe(
      catchError((error) => {
        console.error('Failed to fetch location by ID:', error);
        return throwError(() => new Error('Unable to fetch location by ID'));
      })
    );
  }

  // Device APIs (เหมือนกับ Location)
  getDevices(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/devices`, { headers }).pipe(
      catchError((error) => {
        console.error('Failed to fetch devices:', error);
        return throwError(() => new Error('Unable to fetch devices'));
      })
    );
  }

  addDevice(data: { name: string; description: string }): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}/devices/add`, data, { headers }).pipe(
      catchError((error) => {
        console.error('Failed to add device:', error);
        return throwError(() => new Error('Unable to add device'));
      })
    );
  }

  editDevice(id: number, data: { name: string; description: string }): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${this.apiUrl}/devices/edit/${id}`, data, { headers }).pipe(
      catchError((error) => {
        console.error('Failed to edit device:', error);
        return throwError(() => new Error('Unable to edit device'));
      })
    );
  }

  deleteDevice(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/devices/delete/${id}`, { headers }).pipe(
      catchError((error) => {
        console.error('Failed to delete location:', error);
        return throwError(() => new Error('Unable to delete location'));
      })
    );
  }
  
  
  getDeviceById(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/devices/${id}`, { headers }).pipe(
      catchError((error) => {
        console.error('Failed to fetch device by ID:', error);
        return throwError(() => new Error('Unable to fetch device by ID'));
      })
    );
  }
}