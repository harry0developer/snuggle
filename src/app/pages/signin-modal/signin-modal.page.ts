import { Component, Input, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { User } from 'src/app/models/models';
import { FirebaseService } from 'src/app/service/firebase.service';
import { FIREBASE_ERROR, LOGIN_TYPE, ROUTES, STATUS, STORAGE } from 'src/app/utils/const';

@Component({
  selector: 'app-signin-modal',
  templateUrl: './signin-modal.page.html',
  styleUrls: ['./signin-modal.page.scss'],
})
export class SigninModalPage implements OnInit {

  validations_form: FormGroup;
  signin_form: FormGroup;
  errorMessage: string = '';
  activeStep: number = 0;
  user: User;
  validation_messages = {
    'email': [
     { type: 'required', message: 'Email is required.' },
     { type: 'pattern', message: 'Please enter a valid email.' }
   ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 6 characters long.' }
    ]
  };
 
  currentUser: any;

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    public actionSheetController: ActionSheetController,
    private loadingCtrl:LoadingController,
    private toastController: ToastController
  ) { } 

  get email() {
    return this.validations_form.get('email')?.value;
  }

  get password() {
    return this.validations_form.get('password')?.value;
  }
 
  ngOnInit() {    
    this.user = this.firebaseService.getStorage(STORAGE.USER);
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
  }
  
  ngAfterViewInit() {    
    if(this.user.loginType == LOGIN_TYPE.EMAIL) {
      this.validations_form.controls['email'].setValue(this.user.email);
    }
  }
  async signin() {
    const loading = await this.loadingCtrl.create( {message:"Signing in, please wait..."});
    await loading.present();

    const status: any = await this.firebaseService.login(this.email, this.password);

    await loading.dismiss();

    if(status ===  STATUS.SUCCESS) {
      this.modalCtrl.dismiss();
      this.router.navigateByUrl(ROUTES.USERS, {replaceUrl: true})
    } else {
      if(this.firebaseService.findInString(status.message, FIREBASE_ERROR.SIGNIN_INCORRECT_PASSWORD.key)){
        this.showAlert("Login failed",  FIREBASE_ERROR.SIGNIN_INCORRECT_PASSWORD.value);
      }
      else if(this.firebaseService.findInString(status.message, FIREBASE_ERROR.SIGNIN_USER_NOT_FOUND.key)){
        this.showAlert("Login failed",  FIREBASE_ERROR.SIGNIN_USER_NOT_FOUND.value);
      } 
      else if(this.firebaseService.findInString(status.message, FIREBASE_ERROR.SIGNI_BLOCKED.key)){
        this.showAlert("Login failed",  FIREBASE_ERROR.SIGNI_BLOCKED.value);
      } else {
        this.showAlert("Login failed",  FIREBASE_ERROR.SINGIN_GENERIC);

      }
    }
  } 

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header, message, buttons: ['Dismiss']
    })
    await alert.present();
  }

  resetPassword() {
    this.activeStep = 1;
  }


  async presentToast(msg: string,position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: msg,
      duration: 6000,
      position: position,
    });

    await toast.present();
  }
  
 async sendNewPassword() {
    const loading = await this.loadingCtrl.create({message: "Sending an email. please wait..."});
    await loading.present();
    this.firebaseService.forgotPassword(this.email).then((res: any) => {
      console.log(res) ;
      loading.dismiss();
      if(res.includes("auth/user-not-found")) {
        this.showAlert("Email not registered", "Please provide an email address that is registered");
      } else {
        this.presentToast("Password reset link sent to your email address", 'bottom');
      }
    }).catch(err => {
      loading.dismiss();
      this.presentToast("An error occured, please try again", 'bottom');
    })
  }

  cancel() {
    // this.router.navigateByUrl(ROUTES.SIGNIN, {replaceUrl: true})
    this.modalCtrl.dismiss();
  }  
 

}
