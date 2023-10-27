import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfilePage } from './profile.page';
import { ProfilePageRoutingModule } from './profile-routing.module';
import { SettingsModalPageModule } from '../settings-modal/settings-modal.module';
 
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ProfilePageRoutingModule,
    SettingsModalPageModule,
    AngularFireStorageModule,
    
     
  ],
  declarations: [ProfilePage],
})
export class ProfilePageModule {}
