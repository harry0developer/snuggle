import {
  Component, OnInit, ElementRef,  QueryList, ViewChildren, 
  ChangeDetectionStrategy, NgZone, ChangeDetectorRef } from "@angular/core";
import { AlertController, IonCard, LoadingController, ModalController } from "@ionic/angular";
import { BehaviorSubject } from 'rxjs';
import { FilterPage } from "../filter/filter.page";
import { Router } from "@angular/router";
import { LocationPage } from "../location/location.page";
import { CameraPage } from "../camera/camera.page";
import { UserModalPage } from "../user-modal/user-modal.page";
import { Auth } from "@angular/fire/auth";
import { MatchPage } from "../match/match.page";
import { Geo, Location, Preferences, User } from "../../models/models";
import { FirebaseService } from "../../service/firebase.service";
import { GestureCtrlService } from "../../service/gesture-ctrl.service";
import { ChatService } from "../../service/chat.service";
import { LocationService } from "../../service/location.service";
import { STORAGE, COLLECTION, MODALS, ROUTES } from "../../utils/const";
import { Address, NativeGeocoder, ReverseOptions } from '@capgo/nativegeocoder';

import moment from 'moment';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
 
export class UsersPage implements OnInit {
  users$: any;
  currentUser: any;
  defaultImage = '../../../assets/default.jpg';
  allUsers: User[] = [];
  users: User[] = [];
  usersWithDistance: User[] = [];
  toBeRemoved: any[] = [];
  usersLoaded$ = new BehaviorSubject(false);
  activeUser: User;
  distanceFilter = {
    min: 1,
    max: 120,
    value: 50
  };
  location: any;
  geo: Geo;

  isLoading: boolean = false;

  userPreferences: Preferences;

  mySwipes: any[] = [];
  
  @ViewChildren(IonCard, { read: ElementRef }) cards: QueryList<ElementRef>;

  constructor(
    private gestureCtrlService: GestureCtrlService,
    private firebaseService: FirebaseService,
    private router: Router,
    private auth: Auth,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private chatService: ChatService,
    private locationService: LocationService,
    public zone: NgZone,
    private loadingCtrl: LoadingController,
    private cdr: ChangeDetectorRef
  ){}
   
  
  ngAfterViewInit() {
    this.cards.changes.subscribe(r =>{
      const cardArray = this.cards.toArray();      
      this.gestureCtrlService.useSwiperGesture(cardArray); 
    });
  }

 async ngOnInit() {  
    this.getUserPreferences();
    //1. Get current logged in user
    await this.setCurrentUser();
    //2. Get all user
    await this.getAllUsers();
  }
 
  async setCurrentUser() {
    this.geo = this.firebaseService.getStorage(STORAGE.GEO);
    await this.firebaseService.getCurrentUser().then((user: User) => {
      if(!user.location.address) {
        user.location.geo.latitude = this.geo.latitude;
        user.location.geo.longitude = this.geo.longitude;
        this.updateUserLocation(user);
      }  
      this.currentUser = user;
      this.firebaseService.setStorage(STORAGE.USER, user);
      if(!user.profile_picture) {
        this.showAlert("Incomplete profile", "Please add your profile picture before you can start swiping", "Go to profile")
      }
    }).catch(err => {
      console.log(err);
    });
  }
 


  async getAllUsers() {
    this.usersLoaded$.next(false);
    this.users = [];
    let usersEx: User[] = [];
    await this.chatService.getData(COLLECTION.USERS).forEach((users: any) => {      
      //I want list
      let wantList: any[] = [];
      users.forEach((u:any) => {
        u.want.forEach((uw :any) => {
          if(this.currentUser.want.includes(uw)) {
            wantList.push(u);
          }
        })
      });

      // With list 
      let withList: any[] = [];
 
      users.forEach((otherUser: User) => {
        this.currentUser.with.forEach((myWith: string) => {
          if(myWith == otherUser.gender) {
            withList.push(otherUser)
          }
        })
      })
 
      wantList = [...new Set(wantList)];
      withList = [...new Set(withList)];
      const filtered =  [...wantList, ...withList];
      users =[...new Set(filtered)];
      //Exclude the ones I Swipped
      this.chatService.getMySwipes().forEach((s:any) => {
        const swipes = [...s.swippers, ...s.swipped];

        //Get users location
        this.getUsersWithLocation(users);

        if(swipes.length < 1) {
          this.users = users;
          this.usersWithDistance = this.users.filter((u: any) => parseInt(u.location.distance) < this.distanceFilter.value);
        } else {
          usersEx = users;
          //exclude swipped
          s.swipped.forEach((s:any) => {    
            usersEx.forEach((u: any)=> {
              if(u.uid == s.swipperUid && s.match) {
                usersEx.splice(usersEx.indexOf(u), 1);
              } 
            })
          });

          // exclude swipper
          s.swippers.forEach((m: any) => {    
            usersEx.forEach((u: any) => {
              if(m.swippedUid === u.uid) {
                usersEx.splice(usersEx.indexOf(u), 1);
              }
            })
          });

          this.users = usersEx;
          // this.usersWithDistance = this.users.filter(u => parseInt(u.location.distance) < this.distanceFilter.value);
          this.applyDistanceFilter();
        } 
        this.usersLoaded$.next(true);
      });
    });
  }

  async getUsersWithLocation(users: User[]) {
    this.locationService.applyHaversine(users, this.geo.latitude, this.geo.longitude).forEach((u: any) => {
      this.users = [];
      u.forEach((user: User) => {
        this.updateUserLocation(user);
      });
    });    
  } 
  
  private async updateUserLocation(user: User) {

    if(!user.location.address) {
      const latLng: ReverseOptions = {
        latitude: user.location.geo.latitude,
        longitude: user.location.geo.longitude, 
        apiKey: 'AIzaSyD2w1H2MKOBgl-C6Bb1EwwY19mK5cdIy-w',
        maxResults: 1
      }    
      await NativeGeocoder.reverseGeocode(latLng).then(res => {
        user.location.address = res.addresses[0]?.locality;
        // console.log('User with address',user.uid, "Add ", res.addresses[0]?.locality );        
        this.users.push(user);
      });
    } else {
      this.users.push(user);
    }
  }

  async getAddressFromCoordinates(user: User, latitude: number, longitude: number) {
    const latLng: ReverseOptions = {
      latitude,
      longitude, 
      apiKey: 'AIzaSyD2w1H2MKOBgl-C6Bb1EwwY19mK5cdIy-w',
      maxResults: 1
    }
    await NativeGeocoder.reverseGeocode(latLng).then(res => {
      console.log("Location res", res.addresses[0]);
      const loc: Address = res.addresses[0];
      user.location.address = loc.locality;
      user.location.geo = {latitude: loc.latitude, longitude: loc.longitude};
      this.firebaseService.updateUserProfile(user);
      // this.firebaseService.setStorage(STORAGE.LOCATION, res.addresses[0]);
    }).catch(err => {
      console.log("Error ", err);
    })
  }

 
  
  getUserPreferences() {
    const prefs = this.firebaseService.getStorage(STORAGE.PREFERENCES);
    if(prefs && prefs.distance) {
      this.userPreferences = prefs;
      this.distanceFilter.value = prefs.distance;
    } else {
      this.distanceFilter.value = 0;
      this.userPreferences = {
        distance: "0"
      }
    }
  }

  async updateUserPreference(pref: string) {   
    this.isLoading = true;
    const loading = await this.loadingCtrl.create({message: "Applying filter..."});
    await loading.present();

    this.userPreferences.distance = pref;
    this.firebaseService.setUserPreferences(this.userPreferences).then(() => {
      this.distanceFilter.value = parseInt(pref);
      this.firebaseService.setStorage(STORAGE.PREFERENCES, this.userPreferences);
      this.usersWithDistance = this.users; // this.users.filter((u: any) => parseInt(u.location.distance) < this.distanceFilter.value);
      this.cdr.detectChanges();
      loading.dismiss();
      this.isLoading = false;

     }).catch(() => {
      this.isLoading = false;
     });
  }
  
  pinFormatter(value: number) {
    return `${value} km`;
  }
  
  filterUsers() {
    console.log("Filtering..");
  }

  filterChange(event: any) {
    this.distanceFilter.value = event.detail.value;
  }

  applyDistanceFilter() {
    this.updateUserPreference(this.distanceFilter.value + "");
  }

  async openModal(name: string, user: any = null) {
    let genericModal;
    if(name == MODALS.FILTER) {
      genericModal = await this.modalCtrl.create({
        component: FilterPage,
        componentProps: {
          "distance": this.userPreferences.distance
        }
      });
    }
    else if(name == MODALS.CAMERA) {
      genericModal = await this.modalCtrl.create({
        component: CameraPage,
      });
    } else if(name == MODALS.LOCATION) {
      genericModal = await this.modalCtrl.create({
        component: LocationPage,
      });
    }
    else if(name == MODALS.MATCH) {
      genericModal = await this.modalCtrl.create({
        component: MatchPage,
        componentProps: { 
          user,
          me: this.currentUser
        }
      });
    }
    genericModal.present();
    const { data, role } = await genericModal.onWillDismiss();
    if (role === 'confirm') {
      console.log("confirmed");
    } else if(role === 'filter') {
      this.updateUserPreference(data);
    }
  } 

  getUserAge(user: User){
    return  moment().diff(user.dob, 'years');
  }

  async logout() {
    await this.firebaseService.signout().then(() => {
      this.router.navigateByUrl(ROUTES.AUTH, {replaceUrl:true})
    })
  }

  async showUserModal(user: any) {
    
    const modal = await this.modalCtrl.create({
      component: UserModalPage,
      // initialBreakpoint: ,
      // breakpoints: [0, 1],
      componentProps: { 
        user
      }
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      console.log("confirmed");
    }
  }

  async showAlert(header: string, message: string, btnText: string) {
    const alert = await this.alertCtrl.create({
      header, message, buttons: [btnText], 
       backdropDismiss: false
    });
    await alert.present();
    alert.onDidDismiss().then(() => {
      this.router.navigateByUrl(ROUTES.PROFILE, {replaceUrl:true})
    });
  }
 
}