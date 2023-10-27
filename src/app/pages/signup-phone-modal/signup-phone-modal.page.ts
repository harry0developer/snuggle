import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { User } from 'src/app/models/models';
import { FirebaseService } from 'src/app/service/firebase.service';
import { COLLECTION, ROUTES, STORAGE } from 'src/app/utils/const';
import moment from 'moment';

@Component({
  selector: 'app-signup-phone-modal',
  templateUrl: './signup-phone-modal.page.html',
  styleUrls: ['./signup-phone-modal.page.scss'],
})
export class SignupPhoneModalPage implements OnInit {

  validations_form: FormGroup;
  signup_form: FormGroup;
  errorMessage: string = '';
  activeStep: number = 0;

  validation_messages = {
    'name': [
      { type: 'required', message: 'Name is required.' },
      { type: 'minlength', message: 'Name must be at least 4 characters long.' }
    ]
  };
 
  profilePicture: string;
  user: User;
  currentUser: any;
  uploadedImages: any;
  code: string;
  verificationCodeError: string = "";
  selectedDate: any;
  minDate: any;
  maxDate: any;

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    public actionSheetController: ActionSheetController,
    private loadingCtrl:LoadingController,
    
  ) { } 


  get dob() {
    return this.signup_form.get('dob')?.value;
  }

  get gender() {
    return this.signup_form.get('gender')?.value;
  }
 
  get name() {
    return this.signup_form.get('name')?.value;
  }
  get want() {
    return this.signup_form.get('want')?.value;
  }
  get with() {
    return this.signup_form.get('with')?.value;
  }
  get verificationCode() {
    return this.signup_form.get('verificationCode')?.value;
  } 

  ngOnInit() {    
    this.setMaxDate(); 

    this.signup_form = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(4)
      ])),
      gender: new FormControl('', Validators.compose([
        Validators.required
      ])), 
      dob: new FormControl('', Validators.compose([
        Validators.required
      ])),
      orientation: new FormControl('', Validators.compose([
        Validators.required
      ])),
      want: new FormControl('', Validators.compose([
        Validators.required
      ])),
      with: new FormControl('', Validators.compose([
        Validators.required
      ])),
      verificationCode: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5)
      ]))
    });
  }


  back() {
    if(this.activeStep > 0) {
      --this.activeStep;
    }
  }

	next() {
		++this.activeStep;
	}
 
  setMaxDate() {
    const m = moment().subtract(18, 'years');
    const mm = moment().subtract(100, 'years');
    this.minDate = mm.format();
    this.maxDate = m.format();
    this.selectedDate = m.format();    
  }
 
  async createAccount() {
    const loading = await this.loadingCtrl.create({message: "Creating account, please wait..."});
    await loading.present();
    const user = this.firebaseService.getStorage(STORAGE.USER);
   
    let userData = {...this.signup_form.value};
    userData.phone = user?.phone;
    userData.uid = user?.uid;
    
    if(userData.uid) {
      this.firebaseService.updateUserProfile(COLLECTION.USERS, userData).then(res => {
        loading.dismiss();
        this.modalCtrl.dismiss().then(() => this.router.navigateByUrl(ROUTES.USERS, {replaceUrl:true}));
      }).catch(err => {
        console.log(err);
        loading.dismiss();
      })
    } else {
      loading.dismiss();
      this.showAlert("Could not create account", "Check that your email address is correctly formated")
    }
  } 

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header, message, buttons: ['Dismiss']
    });
    await alert.present();
  }

  cancel() {
    this.modalCtrl.dismiss();
  }  

  async cancelActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Are you sure?',
      buttons: [
        {
          text: 'Yes',
          role: 'destructive',
          handler: () => {
            this.modalCtrl.dismiss();
          }
        }, 
        {
          text: 'No',
          role: 'cancel'
        },
      ],
    });
    await actionSheet.present();
  }

  sendVerificationCode() {
    this.next();
    this.code = ""+Math.floor(Math.random()*100000+1);
  }

  resedCode() {
    this.code = ""+Math.floor(Math.random()*100000+1);
  }

 

}
