import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular'; 
import { SignupModalPage } from '../signup-modal/signup-modal.page';
import { SigninModalPage } from '../signin-modal/signin-modal.page';
import { FirebaseService } from 'src/app/service/firebase.service';
import { COLLECTION, LOGIN_TYPE, ROUTES, STORAGE } from 'src/app/utils/const';
import { SigninPhoneModalPage } from '../signin-phone-modal/signin-phone-modal.page';
import { User } from 'src/app/models/models';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
 
@Component({
  selector: 'app-re-auth',
  templateUrl: './re-auth.page.html',
  styleUrls: ['./re-auth.page.scss'],
})
export class ReAuthPage implements OnInit {
  user: User;
  verification: any = {
    emailVerified: false
  };
  constructor( 
    public actionSheetController: ActionSheetController, 
    private modalCtrl: ModalController, 
    private firebaseServcice: FirebaseService,
    private alertCtrl: AlertController,
    private toastController: ToastController
  ) { } 
 
  ngOnInit() {
    this.user = this.firebaseServcice.getStorage(STORAGE.USER);

    onAuthStateChanged(getAuth(), (user: any) => {
      console.log("State changed ", user);
      this.verification.emailVerified = user.emailVerified;
      this.user.isVerified = user.emailVerified;
      this.firebaseServcice.updateUserProfile(COLLECTION.USERS, this.user).then(() => {
        this.firebaseServcice.setStorage(STORAGE.USER,this.user);
      })
      
    })
  } 



  private async openPhoneModal(isLogin:boolean) {
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

  private async openEmailSigninModal(email: string) {
    const modal = await this.modalCtrl.create({
      component: SigninModalPage,
      componentProps: {
        "emailAddress": email
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

  async presentToast(msg: string,position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: msg,
      duration: 6000,
      position: position,
    });

    await toast.present();
  }
  

  reLogin() {
    if(this.user.loginType == LOGIN_TYPE.EMAIL) {
      this.openEmailSigninModal(this.user.email);
    } else if(this.user.loginType == LOGIN_TYPE.PHONE){
      this.openPhoneModal(true);
    }
  }

  // verifyAccount() {
  //   if(getAuth().currentUser.emailVerified) {
  //     this.presentToast("Account verified, please login", "top");
  //   } else {
  //     this.firebaseServcice.sendEmailVerification().then((res: any) => {
  //       console.log("Verify ", res);
  //       this.presentToast("Account verification link sent", "top")
        
  //     }).catch(err => {
  //       console.log("err ",err);
        
  //     })
  //   }
  // }

  async showAlert(header: string, message: string, btnText: string) {
    const alert = await this.alertCtrl.create({
      header, message, buttons: [btnText], 
       backdropDismiss: false
    });
    await alert.present();
    // alert.onDidDismiss().then(() => {
    //   this.router.navigateByUrl(ROUTES.PROFILE, {replaceUrl:true})
    // });
  }
    
}
