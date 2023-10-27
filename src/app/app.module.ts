import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// import { IvyGalleryModule } from 'angular-gallery';
// import { BrMaskerModule } from 'brmasker-ionic-3'; //--legacy-peer-deps

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

// Firebase 
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore} from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { LocationService } from './service/location.service';
import { ChatService } from './service/chat.service';
import { WindowService } from './service/window.service';
import { InternetPage } from './pages/internet/internet.page';


@NgModule({
  declarations: [AppComponent, InternetPage],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    BrowserModule, 
    FormsModule,
    AppRoutingModule, 
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,

    AppRoutingModule, 
    ReactiveFormsModule,
    HttpClientModule,
    // IvyGalleryModule,
    // BrMaskerModule,

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,

   //this was working but cannot get list of documents in a collection 
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())

  ],
  providers: [
    // FirebaseService,
    LocationService,
    ChatService,
    WindowService,
    {
      provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy 
    },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule {}
