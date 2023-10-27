import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersPage } from './users.page';
import { HttpClientModule } from "@angular/common/http";

import { UsersPageRoutingModule } from './users-routing.module';
import { FilterPageModule } from '../filter/filter.module';
import { MatchPageModule } from '../match/match.module';
import { LocationPageModule } from '../location/location.module';
import { CameraPageModule } from '../camera/camera.module';
import { UserModalPageModule } from '../user-modal/user-modal.module';
import { SwipeCardPage } from '../swipe-card/swipe-card.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    UsersPageRoutingModule,
    UserModalPageModule,
    CameraPageModule,
    LocationPageModule,
    MatchPageModule,
    FilterPageModule,
    
  ],
  declarations: [UsersPage, SwipeCardPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class UsersPageModule {}
