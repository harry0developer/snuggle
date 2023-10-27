import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular'; 
import { SignupModalPage } from '../signup-modal/signup-modal.page';
import { SigninModalPage } from '../signin-modal/signin-modal.page';
import { FirebaseService } from 'src/app/service/firebase.service';
import { ROUTES, STORAGE } from 'src/app/utils/const';
import { SigninPhoneModalPage } from '../signin-phone-modal/signin-phone-modal.page';
 
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  constructor( 
    public actionSheetController: ActionSheetController, 
    private modalCtrl: ModalController, 
    private firebaseServcice: FirebaseService,
    private router: Router
  ) { } 
 
  ngOnInit() {
    const seenIntro = this.firebaseServcice.getStorage(STORAGE.SEEN_INTRO);
    if(!seenIntro) {
      this.router.navigateByUrl(ROUTES.INTRO);
    }
  } 

  async openEmailSignupModal() {
    const modal = await this.modalCtrl.create({
      component: SignupModalPage,
      initialBreakpoint: 0.8,
      breakpoints: [0, 0.8],
      backdropBreakpoint: 0,
      backdropDismiss: false
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      console.log("confirmed");
    }
  }

  async openPhoneModal(isLogin:boolean) {
    const modal = await this.modalCtrl.create({
      component: SigninPhoneModalPage,
      componentProps: {
        "isLogin": isLogin
      },
      initialBreakpoint: 0.8,
      breakpoints: [0, 0.8],
      backdropBreakpoint: 0,
      backdropDismiss: false
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      console.log("confirmed");
    }
  }

  async openEmailSigninModal() {
    const modal = await this.modalCtrl.create({
      component: SigninModalPage,
      initialBreakpoint: 0.8,
      breakpoints: [0, 0.8],
      backdropBreakpoint: 0,
      backdropDismiss: false
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      console.log("confirmed");
    }
  }

  
  async loginActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Login with",
      buttons: [{
        text: 'Phone number',
        handler: () => {
          this.openPhoneModal(true);
        }
      },
      {
        text: 'Email and password',
        handler: () => {
          this.openEmailSigninModal();
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  async createAccountActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: "Create account with",
      buttons: [{
        text: 'Phone number',
        handler: () => {
          this.openPhoneModal(false);
        }
      },
      {
        text: 'Email and password',
        handler: () => {
          this.openEmailSignupModal();
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }
}
