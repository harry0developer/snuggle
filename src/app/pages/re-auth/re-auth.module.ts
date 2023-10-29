import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SignupModalPageModule } from '../signup-modal/signup-modal.module';
import { SigninModalPageModule } from '../signin-modal/signin-modal.module';
import { ReAuthRoutingModule } from './re-auth-routing.module';
import { ReAuthPage } from './re-auth.page';
import { SigninPhoneModalPageModule } from '../signin-phone-modal/signin-phone-modal.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SignupModalPageModule,
    SigninModalPageModule,
    SigninPhoneModalPageModule,
    ReAuthRoutingModule    
  ],
  declarations: [ReAuthPage]
})
export class ReAuthPageModule {}
