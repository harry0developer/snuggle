import { Component } from '@angular/core'; 
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { InternetPage } from './pages/internet/internet.page';
import { LocationService } from './service/location.service';
import { LocationPage } from './pages/location/location.page';
import { SERVICE, STORAGE } from './utils/const';
import { FirebaseService } from './service/firebase.service';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent{
  location: any;
  constructor(
    private locationService: LocationService,
    private loadingCtrl:LoadingController,
    private firebaseService: FirebaseService,
    private platform: Platform,
    private modalCtrl: ModalController) {

      this.platform.ready().then(() => {
         
      })
       
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
