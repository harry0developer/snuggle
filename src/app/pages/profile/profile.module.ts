import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfilePage } from './profile.page';
import { ProfilePageRoutingModule } from './profile-routing.module';
import { SettingsModalPageModule } from '../settings-modal/settings-modal.module';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { GALLERY_CONFIG, GalleryConfig } from 'ng-gallery';
import { GalleryModule, GalleryItem, ImageItem } from 'ng-gallery';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ProfilePageRoutingModule,
    SettingsModalPageModule,
    AngularFireStorageModule,
    GalleryModule
  ],
  providers: [
    {
      provide: GALLERY_CONFIG,
      useValue: {
        autoHeight: true,
        imageSize: 'cover'
      } as GalleryConfig
    }
  ],
  declarations: [ProfilePage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]

})
export class ProfilePageModule {}
