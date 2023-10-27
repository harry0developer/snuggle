import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {

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