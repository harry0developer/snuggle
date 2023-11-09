import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { User } from 'src/app/models/models';
import { FirebaseService } from 'src/app/service/firebase.service';
import { COLLECTION, LOGIN_TYPE, ROUTES, STORAGE } from 'src/app/utils/const';

import moment from 'moment';

@Component({
  selector: 'app-signup-modal',
  templateUrl: './signup-modal.page.html',
  styleUrls: ['./signup-modal.page.scss'],
})
export class SignupModalPage implements OnInit {

  validations_form: FormGroup;
  signup_form: FormGroup;
  errorMessage: string = '';
  activeStep: number = 0;

  validation_messages = {
    'name': [
      { type: 'required', message: 'Name is required.' },
      { type: 'minlength', message: 'Name must be at least 4 characters long.' }
    ],
    'email': [
     { type: 'required', message: 'Email is required.' },
     { type: 'pattern', message: 'Please enter a valid email.' }
   ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' }
    ],
    'verificationCode': [
      { type: 'required', message: 'Verification code is required.' },
      { type: 'minlength', message: 'Verification code must be 6 characters long.' },
      { type: 'maxlength', message: 'Verification code must be 6 characters long.' }
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

  verificationCode: string;
  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    public actionSheetController: ActionSheetController,
    private loadingCtrl:LoadingController
  ) { } 

  get email() {
    return this.validations_form.get('email')?.value;
  }

  get password() {
    return this.validations_form.get('password')?.value;
  }

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
 
  ngOnInit() {    
    this.setMaxDate();
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ])),
    });

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
      want: new FormControl('', Validators.compose([
        Validators.required
      ])),
      with: new FormControl('', Validators.compose([
        Validators.required
      ])),
    
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
    this.user = { 
      uid: "",
      email: this.email,
      name: this.firebaseService.capitalize(this.name),
      gender: this.gender,
      want: this.want,
      with: this.with,
      dob: this.dob,
      loginType: LOGIN_TYPE.EMAIL,
      profile_picture: "",
      images: [],
      password: this.password,
      isVerified: false,
      location: {
        distance: "",
        geo: {
          latitude: 0,
          longitude: 0
        }
      }
    }; 

    const loading = await this.loadingCtrl.create({message: "Creating account, please wait..."});
    await loading.present();

    console.log(this.user);
    const location = this.firebaseService.getStorage(STORAGE.LOCATION);
    const user = await this.firebaseService.createAccountWithEmailAndPassword(this.email, this.password);
    if(!!user && user.user.uid) {
      this.user.uid = user.user.uid;
      this.user.location.geo.latitude = location.latitude;
      this.user.location.geo.longitude = location.longitude;
      this.user.isVerified = user.user.emailVerified;
      this.firebaseService.addDocumentToFirebaseWithCustomID(COLLECTION.USERS, this.user).then(res => {
        loading.dismiss();
        this.firebaseService.sendEmailVerification();
        this.firebaseService.setStorage(STORAGE.USER, this.user);
        this.modalCtrl.dismiss().then(() => this.router.navigateByUrl(ROUTES.USERS, {replaceUrl:true}));
      }).catch(err => {
        console.log(err);
        loading.dismiss();
      })
    } else {
      loading.dismiss();
      console.log("No user registered");
      this.showAlert("Could not create account", "Check that your email address is correctly formated")
    }
  }
   
  async stepOne() { 
    const loading = await this.loadingCtrl.create({message: "Checkng email.."});
    await loading.present();

    const user = await this.firebaseService.queryUsersByEmail(this.email);

    console.log("FOund ", user);
    
    await loading.dismiss();
    if(user && user.length > 0) {
      this.showAlert("Email address already in use", "Please sign in, reset password or create an account with a different email address");
    } else {
      this.next();
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header, message, buttons: ['Dismiss']
    })

    await alert.present();
  }

  cancel() {
    this.modalCtrl.dismiss();
  }   

  resedCode() {
    this.code = ""+Math.floor(Math.random()*100000+1);
    console.log("Cocde: ", this.code);

  }

  cancelCreateAccount() {
    this.router.navigateByUrl(ROUTES.SIGNUP, {replaceUrl: true})
  } 

  otpController(event: any, next: any, prev: any) {
    if(isNaN(event.target.value)) {
      event.target.value = "";
      return 0;
    } else {
      if (event.target.value.length < 1 && prev) {
        prev.setFocus();
        return 0;
      } else if (next && event.target.value.length > 0) {
        next.setFocus();
        return 0;
      } else {
        return 0;
      }
    }
  }

}
