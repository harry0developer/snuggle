import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
// import { Gallery } from 'angular-gallery';
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
 
  constructor(
    // private gallery: Gallery, 
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.extras = [...this.user.want,...this.user.with]
  }

  showGallery(index: number) {
    let imgs = [];
    for(let img of this.user.images ) {
      imgs.push({path: img})
    }
    let prop = {
        images: imgs,
        index,
        counter: true,
        arrows: false
    };
    // this.gallery.load(prop);
  }

  dismiss() {
    return this.modalCtrl.dismiss();
  }

  
  getUserAge(user: User){
    return Methods.getUserAge(user);
  }
}
