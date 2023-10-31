import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-network',
  templateUrl: './network.page.html',
  styleUrls: ['./network.page.scss'],
})
export class NetworkPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }


  dismiss() {
    return this.modalCtrl.dismiss(null, 'none');
  }

  tryAgain() {
    return this.modalCtrl.dismiss(null, 'retry');
  }

}