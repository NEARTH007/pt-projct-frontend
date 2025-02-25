import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators'; // ✅ เพิ่ม import

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

  logout(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }).pipe(
      catchError((error) => {
        console.error('Logout failed:', error);
        return throwError(error);
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
  requestPasswordReset(payload: { email: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/request-password-reset`, payload).pipe(
      catchError((error) => {
        console.error('Password reset request failed:', error);
        return throwError(error);
      })
    );
  }
  
  
  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/reset-password`, { token, newPassword }).pipe(
      catchError((error) => {
        console.error('Reset Password failed:', error);
        return throwError(error);
      })
    );
  }
  
  
  getAllUsers(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/users`, { headers }).pipe(
      catchError((error) => {
        console.error('Fetch users failed:', error);
        return throwError(() => new Error('Failed to fetch users'));
      })
    );
  }

  updateUser(id: number, payload: FormData): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    );
  
    return this.http.patch(`${this.apiUrl}/users/${id}`, payload, { headers }).pipe(
      catchError((error) => {
        console.error('Update user failed:', error);
        return throwError(error);
      })
    );
  }
  
  

  deleteUser(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .delete(`${this.apiUrl}/users/delete/${id}`, { headers }) // เปลี่ยน `/users/${id}` เป็น `/users/delete/${id}`
      .pipe(
        catchError((error) => {
          console.error('Delete user failed:', error);
          return throwError(error);
        })
      );
  }
  
  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('⛔ No token found in localStorage!');
      return throwError(() => new Error('No token found'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/profile`, { headers }).pipe(
      tap((user: any) => console.log("🔍 Received User Profile:", user)), // ✅ กำหนด type
      catchError(error => {
        console.error('🚨 Error Fetching Profile:', error);
        return throwError(error);
      })
    );
  }


  getProfile(token: string): Observable<any> {
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
  
  getUser(): any {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // ✅ Decode JWT Token
      return { id: payload.id, username: payload.username, role: payload.role };
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
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



  getDevices(): Observable<any[]> {
    const headers = this.getHeaders();
    return this.http.get<any[]>(`${this.apiUrl}/devices`, { headers }).pipe(
      tap((devices) => console.log("📌 API Response:", devices)), // ✅ Debug
      catchError((error) => {
        console.error("🚨 Failed to fetch devices:", error);
        return throwError(() => new Error("Unable to fetch devices"));
      })
    );
  }
  

  
addDevice(data: FormData): Observable<any> {
  const headers = new HttpHeaders().set(
    'Authorization',
    `Bearer ${localStorage.getItem('token') || ''}`
  );

  return this.http.post(`${this.apiUrl}/devices/add`, data, { headers }).pipe(
    catchError((error) => {
      console.error('Failed to add device:', error);
      return throwError(() => new Error('Unable to add device'));
    })
  );
}

getDeviceTypes(): Observable<any[]> {
  const headers = this.getHeaders();
  return this.http.get<any[]>(`${this.apiUrl}/device-types`, { headers }).pipe(
    catchError((error) => {
      console.error('Failed to fetch device types:', error);
      return throwError(() => new Error('Unable to fetch device types'));
    })
  );
}


editDevice(id: number, data: FormData): Observable<any> {
  const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
  );

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
        console.error('Failed to delete device:', error);
        return throwError(() => new Error('Unable to delete device'));
      })
    );
  }
  
  
  getDeviceById(id: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get<any>(`http://localhost:5006/api/auth/devices/${id}`, { headers }).pipe(
      catchError((error) => {
        console.error('Failed to fetch device by ID:', error);
        return throwError(() => new Error('Unable to fetch device by ID'));
      })
    );
  }
  
  
// Add Values
addDeviceValues(data: { deviceId: number; value1: string; value2: string }): Observable<any> {
  const headers = this.getHeaders();
  return this.http.post(`${this.apiUrl}/devices/${data.deviceId}/values`, data, { headers });
}

// Edit Values
editDeviceValues(id: number, data: { value1: string; value2: string }): Observable<any> {
  const headers = this.getHeaders();
  return this.http.put(`${this.apiUrl}/values/${id}`, data, { headers }).pipe(
    catchError((error) => {
      console.error('Failed to update values:', error);
      return throwError(() => new Error('Unable to update values'));
    })
  );
}


// Get Values by Device ID
getDeviceValues(deviceId: number): Observable<any[]> {
  const headers = this.getHeaders();
  return this.http.get<any[]>(`${this.apiUrl}/devices/${deviceId}/values`, { headers });
}
 }