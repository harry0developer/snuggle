import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-internet',
  templateUrl: './internet.page.html',
  styleUrls: ['./internet.page.scss'],
})
export class InternetPage{

  errorCount: number = 0;
  constructor(private modalCtrl: ModalController) { }
 
  dismiss() {
    return this.modalCtrl.dismiss(null, 'none');
  }

  tryAgain() {
    this.logCurrentNetworkStatus().then((status: any) => {
      this.errorCount = ++this.errorCount;
      if(status.connected) {
        this.dismiss();
      }
    });
  } 
 
  logCurrentNetworkStatus = async () => {
    return await Network.getStatus();
  };
 
}