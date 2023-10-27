import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tc-page',
  templateUrl: './tc.page.html',
  styleUrls: ['./tc.page.scss'],
})
export class TermsPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

}
