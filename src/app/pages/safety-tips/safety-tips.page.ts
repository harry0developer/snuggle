import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-safety-tips',
  templateUrl: './safety-tips.page.html',
  styleUrls: ['./safety-tips.page.scss'],
})
export class SafetyTipsPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

}
