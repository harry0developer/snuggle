import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/models/models';
import Methods from 'src/app/utils/helper/funtions';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.page.html',
  styleUrls: ['./user-modal.page.scss'],
})
export class UserModalPage implements OnInit {

  user: User;
  extras: string[] = [];
 
  @ViewChild("swiper") swipperContainer: any;

  constructor(
    private modalCtrl: ModalController) { }


  ngAfterViewInit() {
    console.log("Swipe ", this.swipperContainer);
    this.swipperContainer
  }

  ngOnInit() {
    this.extras = [...this.user.want,...this.user.with]
  }
 
  
  dismiss() {
    return this.modalCtrl.dismiss();
  }

  
  getUserAge(user: User){
    return Methods.getUserAge(user);
  }

  getCurrentActiveIndex() {

  }
}
