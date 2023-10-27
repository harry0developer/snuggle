import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreferencesModalPageModule } from '../preferences-modal/preferences-modal.module';
import { CountryCodeModalModalPage } from './country-code-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PreferencesModalPageModule,
  ],
  declarations: [CountryCodeModalModalPage]
})
export class CountryCodeModalPageModule {}
