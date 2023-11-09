import { Component } from '@angular/core'; 
import { ModalController, Platform } from '@ionic/angular';
import { FirebaseService } from './service/firebase.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { Geolocation } from '@capacitor/geolocation';
import { STORAGE } from './utils/const';
import { LocationPage } from './pages/location/location.page';
import { NativeGeocoder, ReverseOptions } from '@capgo/nativegeocoder';
import { Location } from './models/models';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent{
  location: Location;

  constructor(
    private platform: Platform, 
    private firebaseService: FirebaseService,
    private modalCtrl: ModalController,
    ) {
    this.platform.ready().then(() => { 
      this.getCurrentLocation().then((res: any) => {
        console.log("Address ", res);
        // this.getAddressFromCoordinates(res.coords.latitude, res.coords.longitude);
        this.setGeo(res.coords.latitude, res.coords.longitude);
        
      }).catch(error => {
        console.log("Error ", error);
        this.showGeoLocationErroModal();
      })
    })
  }

  setGeo(latitude: number, longitude: number) {
    this.firebaseService.setStorage(STORAGE.GEO, {latitude, longitude});
  }

  // async getAddressFromCoordinates(latitude: number, longitude: number) {
  //   const latLng: ReverseOptions = {
  //     latitude,
  //     longitude, 
  //     apiKey: 'AIzaSyD2w1H2MKOBgl-C6Bb1EwwY19mK5cdIy-w',
  //     maxResults: 1
  //   }
  //   await NativeGeocoder.reverseGeocode(latLng).then(res => {
  //     console.log("Location res", res.addresses[0])
  //     this.firebaseService.setStorage(STORAGE.LOCATION, res.addresses[0]);
  //   }).catch(err => {
  //     console.log("Error ", err);
  //   })
  // }
 
  async showGeoLocationErroModal() {
    const modal = await this.modalCtrl.create({
      component: LocationPage,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'retry') {
      this.getCurrentLocation().then((res: any) => {
        this.setGeo(res.coords.latitude, res.coords.longitude);
        // this.getAddressFromCoordinates(res.coords.latitude, res.coords.longitude);
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
