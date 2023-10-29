import { Component, ComponentRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/service/firebase.service';
import { ROUTES, STORAGE } from 'src/app/utils/const';
import { PreferencesModalPage } from '../preferences-modal/preferences-modal.page';
import { User } from 'src/app/models/models';
import { TermsPage } from '../tc/tc.page';
import { SafetyTipsPage } from '../safety-tips/safety-tips.page';
import { SupportPage } from '../support/support.page';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.page.html',
  styleUrls: ['./settings-modal.page.scss'],
})
export class SettingsModalPage implements OnInit {

  name: string;
  user: User;
  wantList: string[] = [];
  withList: string[] = [];
  dateOfBirth: string = "";
 
  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    public actionSheetController: ActionSheetController,
    private firebaseService: FirebaseService) {
  }

  ngOnInit() {}

  async openPreferencesModal() {
    const modal = await this.modalCtrl.create({
      component: PreferencesModalPage,
      componentProps: {
        "user": this.user
      }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'save') {
      console.log("applied");
    }
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Deactivate account',
      buttons: [
        {
          text: 'Deactivate',
          role: 'destructive',
          data: {
            action: 'deactivate',
          },
          handler: () => { this.logout() }
        }, 
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
    });

    await actionSheet.present();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }
 

  async openModal(compRef: any) {
    const modal = await this.modalCtrl.create({
      component: compRef,
      componentProps: {
        "user": this.user
      }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      console.log("confirmed");
    }
  }

  openTermsAndConditionsModal() {
    this.openModal(TermsPage);
  }

  openSafetyTipsModal() {
    this.openModal(SafetyTipsPage);
  }

  openSupportModal() {
    this.openModal(SupportPage);
  }


  async logout() {
    await this.firebaseService.signout().then(() => {
      this.cancel().then(() => {
        this.router.navigateByUrl(ROUTES.REAUTH, {replaceUrl:true})
      })
    })
  }
}