import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { User } from 'src/app/models/models';
import { FirebaseService } from 'src/app/service/firebase.service';
import { COLLECTION } from 'src/app/utils/const';

@Component({
  selector: 'app-preferences-modal',
  templateUrl: './preferences-modal.page.html',
  styleUrls: ['./preferences-modal.page.scss'],
 
})
export class PreferencesModalPage implements OnInit{

  @Input() user: User;
  preferencesForm: FormGroup;

  wantList: string[] = [];
  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.preferencesForm = this.formBuilder.group({
      want: new FormControl('', Validators.compose([
        Validators.required
      ])),
      with: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
  }
 
  cancel() {
    this.modalCtrl.dismiss(null);
  }

  get want() {
    return this.preferencesForm.get('want')?.value;
  }

  get with() {
    return this.preferencesForm.get('with')?.value;
  }

  savePreferences() {
    let data = this.user;
    data.want = this.want;
    data.with = this.with;    
    this.showLoading();
    this.firebaseService.addDocumentToFirebaseWithCustomID(COLLECTION.USERS, data).then(res => {
      console.log("Document updated", res);
      this.loadingCtrl.dismiss();
      this.modalCtrl.dismiss();
    }).catch(err => {
      this.loadingCtrl.dismiss();
      this.modalCtrl.dismiss();
      console.log("Error while updating doc", err);
      
    })
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Updating preferences, please wait...',
    });

    loading.present();
  }
 
}
