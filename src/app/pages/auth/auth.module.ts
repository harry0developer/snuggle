import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SignupModalPageModule } from '../signup-modal/signup-modal.module';
import { SigninModalPageModule } from '../signin-modal/signin-modal.module';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthPage } from './auth.page';
import { SigninPhoneModalPageModule } from '../signin-phone-modal/signin-phone-modal.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SignupModalPageModule,
    SigninModalPageModule,
    SigninPhoneModalPageModule,
    AuthRoutingModule    
  ],
  declarations: [AuthPage]
})
export class AuthPageModule {}
