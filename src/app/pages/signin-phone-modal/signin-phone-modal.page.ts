import { Component, Input, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs'; 
import { CountryCodeModalModalPage } from '../country-code-modal/country-code-modal.page';
import { SignupPhoneModalPage } from '../signup-phone-modal/signup-phone-modal.page';
import { Country, User } from 'src/app/models/models';
import { FirebaseService } from 'src/app/service/firebase.service';
import { WindowService } from 'src/app/service/window.service';
import { COLLECTION, ROUTES, STORAGE } from 'src/app/utils/const';
 
@Component({
  selector: 'app-signin-phone-modal',
  templateUrl: './signin-phone-modal.page.html',
  styleUrls: ['./signin-phone-modal.page.scss'],
})
export class SigninPhoneModalPage implements OnInit {

  validations_form: FormGroup;
  phone_number_form: FormGroup;
  otp_code_form: FormGroup;
  signin_form: FormGroup;
  errorMessage: string = '';
  activeStep: number = 0;
 
  selectedCountryCode: string;
  currentUser: any;
  countries: Observable<any>;
  code: string;

  applicationVerifier: any;
  windowRef: any;
  verificationCode: string;
  users: User[] = [];
  OTPCodeActive: boolean = false;

  phoneNumber: string;
  phoneNumberWithSpaces: string;

  appVerifier: any;

  user: any;

  isLoading: boolean = false;

  
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

  phone_number_validation = {
    'phone': [
     { type: 'required', message: 'Phone number is required.' },
     { type: 'minlength', message: 'Phone number must be at least 9 characters long.' }
    ]
  };
 
   
  country: Country = {
    name: "South Africa",
    flag: "🇿🇦",
    code: "ZA",
    dialCode: "+27"
  };

  @Input() isLogin: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    public actionSheetController: ActionSheetController,
    private loadingCtrl:LoadingController,
    private win: WindowService
  ) { } 

  get phone() {
    return this.phone_number_form.get('phone')?.value;
  } 
 

  ngOnInit() {    
    this.windowRef = this.win.windowRef;
    // this.windowRef.recaptchaVerifier = new RecaptchaVerifier( 
    //   'recaptcha-container', {
    //     'size': 'invisible'
    //   },
    //   getAuth()
    // );
    this.windowRef.recaptchaVerifier.render();
  

    this.selectedCountryCode = "+27";
    this.phone_number_form = this.formBuilder.group({
      phone: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(11),
      ])),
      code: new FormControl('', Validators.compose([
        Validators.required
      ]))

    });

    this.otp_code_form = this.formBuilder.group({
      otp: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(11),
      ]))
    });
  } 

  async signin() {
    const appVerifier = this.windowRef.recaptchaVerifier;
    
    this.phoneNumber = (this.selectedCountryCode.trim()+this.phone.trim()).replace(/\s+/g, '');
    this.phoneNumberWithSpaces = this.selectedCountryCode+this.phone;
    
    this.firebaseService.signInWithPhoneNumber(this.phoneNumber, appVerifier).then(res => {
      this.windowRef.confirmationResult = res;
      this.OTPCodeActive = true;
    }).catch(() => {
      this.showAlert("Create account failed", "Something went wrong while creating account");
    })
  } 

  async verifyLoginCode(form: NgForm) {
    const loading = await this.loadingCtrl.create({message: "Verifying code, please wait..."});
    await loading.present();

    const frm = form.value;
    const otp = [...frm.otp1, ...frm.otp2, ...frm.otp3, ...frm.otp4, ...frm.otp5, ...frm.otp6].join('');
    this.windowRef.confirmationResult.confirm(otp).then((result: any) => {
      loading.dismiss();
      this.user = result.user;
      this.loginWithPhoneNumber(result.user.uid); 
      // if(this.isLogin) {
      //   this.loginWithPhoneNumber(result.user.uid); 
      // } else {
      //   this.addUserIntoFirestore(result.user);
      // }
      
    }).catch(() => {
      loading.dismiss();
      this.showAlert("Incorrect OTP", "The verification code entered is incorrect");
    });
  }

  private async loginWithPhoneNumber(uid: string) {
    const loading = await this.loadingCtrl.create({message: "Fetching your info, please wait..."});
    await loading.present();
    this.firebaseService.queryUsersByUid(COLLECTION.USERS, uid).then(user => {
      loading.dismiss();
      console.log("Found User", user);
      
      if(user.length > 0 && user[0].gender && user[0].dob) {
        this.modalCtrl.dismiss().then(() => {
          this.router.navigateByUrl(ROUTES.USERS);
        });
      } else {
        this.showCreatePhoneProfileAlert("Profile not found", "Please complete your profile to start matching", "Complete Profile");
      }
    }).catch(err => {
      console.log("Error ", err);
      loading.dismiss();
    })
  }

  async showCreatePhoneProfileAlert(header: string, message: string, btnText: string) {
    const alert = await this.alertCtrl.create({
      header, message, buttons: [btnText], 
       backdropDismiss: true
    });
    await alert.present();
    alert.onDidDismiss().then(() => {
      this.addUserIntoFirestore(this.user);
    });
  }

  private async addUserIntoFirestore(user: any) {
    const loading = await this.loadingCtrl.create({message: "Setting you up, please wait..."});
    await loading.present();

    this.firebaseService.createAccountWithMobile(COLLECTION.USERS, user).then(u => {
      loading.dismiss();    
      const data: User = {
        uid: user.uid,
        phone: user.phoneNumber,
        name: "",
        email: "",
        password: "",
        gender: "",
        want: [],
        with: [],
        dob: "",
        images: [],
        profile_picture: "",
        isVerified: true, 
        location: {
            distance: "",
            geo: {
              lat: 0,
              lng: 0
            }
        }
      }; 
      
      this.firebaseService.setStorage(STORAGE.USER, data);
      this.modalCtrl.dismiss().then(() => {
        this.openCreateAccountModal();
      });
    }).catch(err => {
      loading.dismiss();
      this.showAlert("Create account", "Something went wrong while creating account");
    })
  }

  private async openCreateAccountModal() {
    const modal = await this.modalCtrl.create({
      component: SignupPhoneModalPage,
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

  resendOTPCode() {
    console.log("Reset otp code");
  }

  async openCountryCodeModal() {
    const modal = await this.modalCtrl.create({
      component: CountryCodeModalModalPage,
      componentProps: {
        "code": this.code
      }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'save') {
      console.log("applied", data);
      this.selectedCountryCode = data.dial_code;
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
 
  handleChange(e: any) {
    console.log("Event ", e);
    this.selectedCountryCode = e.detail.value
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
