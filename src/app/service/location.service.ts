import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; 
import { LatLng, User } from '../models/models';
//export ANDROID_HOME=$HOME/Android/Sdk
//ionic cap run android -l --external


@Injectable({
  providedIn: 'root'
})
export class LocationService {

  KM: number = 1.60934;

  constructor() { }
  
  async printCurrentPosition() {
    const options = {
      timeout: 6000, 
      enableHighAccuracy: true, 
      maximumAge: 3600
    };
    // return await Geolocation.getCurrentPosition(options); 
  };


  async checkLocationPermissions() {
    // return await Geolocation.checkPermissions();
  }

  applyHaversine(users: User[], lat: number, lng:number): Observable<User[]>{
    
    if (users && lat && lng) {
      let usersLocation = {
        lat: lat,
        lng: lng
      };
      users.map(user => {
        let placeLocation = {
          lat: user.location.geo.lat,
          lng: user.location.geo.lng
        };
        user.location.distance = this.getDistanceBetweenPoints(
          usersLocation,
          placeLocation
        ).toFixed(0);
      });
      return of(users);
    } else {
      return of(users);
    }
  }

  private getDistanceBetweenPoints(start: LatLng, end: LatLng,) {
    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    let R = earthRadius['miles'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d * this.KM; //convert miles to km
  }

  toRad(x: number) {
    return x * Math.PI / 180;
  }  
}
