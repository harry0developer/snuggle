import { NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CountryCodeModalPageModule } from '../country-code-modal/country-code-modal.module';
import { SignupPhoneModalPageModule } from '../signup-phone-modal/signup-phone-modal.module';
import { SigninPhoneModalPage } from './signin-phone-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SignupPhoneModalPageModule,
    CountryCodeModalPageModule
  ],
  declarations: [SigninPhoneModalPage],
  schemas: [NO_ERRORS_SCHEMA]
})
export class SigninPhoneModalPageModule {}
