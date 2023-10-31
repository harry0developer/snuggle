import { Component } from '@angular/core'; 
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { FirebaseService } from './service/firebase.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { Geolocation } from '@capacitor/geolocation';
import { STORAGE } from './utils/const';
import { LatLng } from './models/models';
import { LocationPage } from './pages/location/location.page';
import { error } from 'console';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent{
  location: any;

  constructor(
    private platform: Platform, 
    private firebaseService: FirebaseService,
    private modalCtrl: ModalController
    ) {
    this.platform.ready().then(() => { 
      this.getCurrentLocation().then((res: any) => {
        const latLng:LatLng = {
          lat: res.coords.latitude,
          lng: res.coords.longitude
        };
        this.firebaseService.setStorage(STORAGE.LOCATION, latLng);
      }).catch(error => {
        console.log("Error ", error);
        this.showGeoLocationErroModal();
      })
    })
  }

  
  async showGeoLocationErroModal() {
    const modal = await this.modalCtrl.create({
      component: LocationPage,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'retry') {
      this.getCurrentLocation().then((res: any) => {
        const latLng:LatLng = {
          lat: res.coords.latitude,
          lng: res.coords.longitude
        };
        this.firebaseService.setStorage(STORAGE.LOCATION, latLng);
      }).catch(error => {
        this.showGeoLocationErroModal();
        console.log("Error ", error);
        
      })
    }
  }

  async getCurrentLocation() {
    const options = {
      timeout: 6000, 
      enableHighAccuracy: true, 
      maximumAge: 3600
    };
    return await Geolocation.getCurrentPosition(options); 
  }

  async showSplashscreen() {
    await SplashScreen.hide();
    
    // Show the splash for an indefinite amount of time:
    await SplashScreen.show({
      autoHide: false,
    });
    
    // Show the splash for two seconds and then automatically hide it:
    await SplashScreen.show({
      showDuration: 2000,
      autoHide: true,
    });
  }

}
