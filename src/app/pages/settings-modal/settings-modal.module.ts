import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';


import { SettingsModalPage } from './settings-modal.page';
import { PreferencesModalPageModule } from '../preferences-modal/preferences-modal.module';
import { TermsModule } from '../tc/tc.module';
import { SafetyTipsModule } from '../safety-tips/safety-tips.module';
import { SupportModule } from '../support/support.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TermsModule,
    SafetyTipsModule,
    SupportModule,
    PreferencesModalPageModule
  ],
  declarations: [SettingsModalPage]
})
export class SettingsModalPageModule {}
